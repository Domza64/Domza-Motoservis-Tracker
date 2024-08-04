import { deleteMotorcycle } from "@/app/Actions";
import { auth } from "@/auth";
import DeleteButton from "@/component/DeleteButton";
import DeleteMotorcycleButton from "@/component/DeleteMotorcycleButton";
import MilageDisplay from "@/component/MilageDisplay";
import ServiceItemCard from "@/component/ServiceItemCard";
import dbConnect from "@/lib/dbConnect";
import MotorcycleModel, {
  IMotorcycleModel,
  ServiceItem,
} from "@/model/MotorcycleModel";
import UserModel from "@/model/UserModel";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const motorcycle: IMotorcycleModel = await getData(id);

  return (
    <section className="w-full bg-slate-200 flex justify-center py-16">
      <div className="w-full max-w-5xl flex flex-col items-start">
        {motorcycle ? (
          <>
            <h3 className="text-3xl font-semibold">
              {motorcycle?.motorcycleName}
            </h3>
            <div className="flex items-center gap-2">
              <MilageDisplay initialMilage={motorcycle.currentMilage} />
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
            <DeleteMotorcycleButton id={id} />
          </>
        ) : (
          <p>Not found :(</p>
        )}
      </div>
    </section>
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
