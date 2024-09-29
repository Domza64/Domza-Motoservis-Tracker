import dbConnect from "@/lib/dbConnect";
import Link from "next/link";
import MotorMenu from "@/component/dashboard/MotorMenu";
import DeleteModal from "@/component/deleteModal/DeleteModal";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import MilageDisplay from "@/component/dashboard/MilageDisplay";
import TrackedServicesModel, {
  ServiceItem,
} from "@/model/TrackedServicesModel";
import ServiceItemCard from "@/component/dashboard/cards/ServiceItemCard/ServiceItemCard";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const trackedServices = await getData(id);

  return (
    <div className="w-full max-w-5xl flex flex-col items-start p-4">
      <div className="w-full flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-semibold">
            {trackedServices?.motorcycleName}
          </h3>
          <div className="flex items-center gap-2">
            <MilageDisplay
              motorcycleId={id}
              initialMilage={trackedServices.milage.at(-1)?.milage}
            />
          </div>
        </div>
        <div>
          <MotorMenu id={id} motorcycleName={trackedServices.motorcycleName} />
        </div>
      </div>
      <h4 className="text-2xl mt-8">Service Items:</h4>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4 w-full">
        {trackedServices.serviceItem.map((serviceItem: ServiceItem) => (
          <ServiceItemCard
            key={serviceItem.title}
            serviceItem={serviceItem}
            motorcycleId={trackedServices.id}
            currentMotorcycleMilage={trackedServices.milage.at(-1)?.milage || 0}
          />
        ))}
        <Link href={`${id}/add`} className="underline order-last">
          Add new item
        </Link>
      </div>
      <DeleteModal title={trackedServices.motorcycleName} motorcycleId={id} />
    </div>
  );
}

async function getData(id: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  await dbConnect();

  try {
    const trackedServices = await TrackedServicesModel.findById(id);

    if (!trackedServices) {
      // TODO - Create new service history record
      throw new Error(`Motorcycle: ${id} service history was not found`);
    }

    if (trackedServices.ownerId !== user.id) {
      throw new Error(
        `You are not the owner of the trecked services id: ${trackedServices.motorcycleId}.`
      );
    }

    return trackedServices;
  } catch (error) {
    console.error("Error fetching bike:", error);
    throw new Error(`Unknown error: ${error}`);
  }
}
