import dbConnect from "@/lib/dbConnect";
import Link from "next/link";
import DeleteModal from "@/component/deleteModal/DeleteModal";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import MilageDisplay from "@/component/dashboard/MilageDisplay";
import TrackedServicesModel, {
  ServiceItem,
} from "@/model/TrackedServicesModel";
import ServiceItemCard from "@/component/dashboard/cards/ServiceItemCard/ServiceItemCard";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const motorcycleid = (await params).id;
  const { motorcycleName, milage, serviceItem, id } = await getData(
    motorcycleid
  );

  return (
    <div className="w-full max-w-5xl flex flex-col items-start p-4">
      <div className="w-full flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-semibold">{motorcycleName}</h3>
          <div className="flex items-center gap-2">
            <MilageDisplay
              motorcycleId={motorcycleid}
              initialMilage={milage.at(-1)?.milage}
            />
          </div>
        </div>
      </div>
      <h4 className="text-2xl mt-8">Service Items:</h4>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4 w-full">
        {serviceItem.map((serviceItem: ServiceItem) => (
          <ServiceItemCard
            key={serviceItem.title}
            serviceItem={serviceItem}
            motorcycleId={id}
            currentMotorcycleMilage={milage.at(-1)?.milage || 0}
          />
        ))}
        <Link href={`${motorcycleid}/add`} className="underline order-last">
          Add new item
        </Link>
      </div>
      <span>Delete bike: </span>
      <DeleteModal title={motorcycleName} motorcycleId={motorcycleid} />
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
