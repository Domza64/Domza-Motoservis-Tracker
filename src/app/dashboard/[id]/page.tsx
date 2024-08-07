import { auth } from "@/auth";
import MilageDisplay from "@/component/MilageDisplay";
import ServiceItemCard from "@/component/ServiceItemCard";
import dbConnect from "@/lib/dbConnect";
import MotorcycleModel, {
  IMotorcycleModel,
  ServiceItem,
} from "@/model/MotorcycleModel";
import UserModel from "@/model/UserModel";
import Link from "next/link";
import MotorMenu from "@/component/MotorMenu";
import DeleteModal from "@/component/deleteModal/DeleteModal";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const motorcycle: IMotorcycleModel = await getData(id);

  if (!motorcycle) {
    throw new Error(`Motorcycle: ${id} was not found`);
  }

  return (
    <div className="w-full max-w-5xl flex flex-col items-start p-4">
      <div className="w-full flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-semibold">
            {motorcycle?.motorcycleName}
          </h3>
          <div className="flex items-center gap-2">
            <MilageDisplay
              motorcycleId={id}
              initialMilage={motorcycle.currentMilage}
            />
          </div>
        </div>
        <div>
          <MotorMenu id={id} />
        </div>
      </div>
      <h4 className="text-2xl mt-8">Service Items:</h4>
      <div className="flex flex-col gap-4 my-4 w-full">
        {motorcycle.serviceItem.map((serviceItem: ServiceItem) => (
          <ServiceItemCard
            key={serviceItem.title}
            serviceItem={serviceItem}
            motorcycleId={motorcycle.id}
            currentMotorcycleMilage={motorcycle.currentMilage}
          />
        ))}
      </div>
      <Link href={`${id}/add`} className="underline">
        Add new item
      </Link>
      <DeleteModal title={motorcycle.motorcycleName} motorcycleId={id} />
    </div>
  );
}

async function getData(id: string) {
  const session = await auth();
  const email = session?.user?.email;

  await dbConnect();

  // Find the user by email
  const user = await UserModel.findOne({ email });

  if (!user || !user.bikes.has(id)) {
    // If the user does not exist or the id is not in the bikes map
    return undefined;
  }

  const bike = await MotorcycleModel.findById(id);

  if (!bike) {
    // If the bike does not exist, return undefined
    return undefined;
  }

  // Return the bike details
  return bike;
}
