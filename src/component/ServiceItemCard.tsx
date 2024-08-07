import MotorcycleModel, { ServiceItem } from "@/model/MotorcycleModel";
import DeleteModal from "./deleteModal/DeleteModal";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@/auth";
import UserModel from "@/model/UserModel";
import { revalidatePath } from "next/cache";

interface Props {
  serviceItem: ServiceItem;
  motorcycleId: string;
  currentMotorcycleMilage: number;
}

export default async function ServiceItemCard({
  serviceItem,
  motorcycleId,
  currentMotorcycleMilage,
}: Props) {
  // @ts-ignore
  const id = serviceItem._id.toString();

  const serviceInterval = serviceItem.serviceInterval;
  const sinceLastService = currentMotorcycleMilage - serviceItem.lastService;
  const serviceNeeded = sinceLastService >= serviceInterval;
  const untilNextService = serviceInterval - sinceLastService;
  //const serviceIntervalDate = serviceItem.serviceIntervalDate;

  async function setServiced(formData: FormData) {
    "use server";
    await dbConnect();
    const session = await auth();
    const email = session?.user?.email;

    const serviceItemId = formData.get("serviceItemId");
    const currentMilage = formData.get("currentMilage");
    const motorcycleId = formData.get("motorcycleId");

    const user = await UserModel.findOne({ email });

    if (user && user.bikes.has(motorcycleId)) {
      await MotorcycleModel.findOneAndUpdate(
        {
          _id: motorcycleId,
          "serviceItem._id": serviceItemId,
        },
        {
          $set: {
            "serviceItem.$.lastService": currentMilage,
            "serviceItem.$.lastServiceDate": new Date(),
          },
        }
      );
      revalidatePath(`/dashboard/${motorcycleId}`);
    }
  }

  return (
    <div
      className={`rounded bg-white py-2 px-4 shadow-md flex flex-col w-full ${
        serviceNeeded ? "border-red-500 border-2 order-1" : "order-2"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          {" "}
          <p className="font-bold text-xl">{serviceItem.title}</p>
          <p>
            <span className="font-semibold">Since last service:</span>{" "}
            {sinceLastService + " km"}
          </p>
          <p>
            <span className="font-semibold">Service every: </span>{" "}
            {serviceInterval} km
          </p>
          <p>
            <span className="font-semibold">Last service at: </span>{" "}
            {serviceItem.lastService} km
          </p>
        </div>
        <form action={setServiced}>
          <input
            type="hidden"
            name="serviceItemId"
            value={id}
            className="hidden"
          />
          <input
            type="hidden"
            value={currentMotorcycleMilage}
            name="currentMilage"
          />
          <input type="hidden" value={motorcycleId} name="motorcycleId" />
          <button className="bg-blue-500 hover:bg-blue-600 transition-all text-white rounded py-1 px-2 font-semibold shadow-lg">
            SET <br />
            Serviced!
          </button>
        </form>
      </div>
      <hr className="border-slate-600 my-2" />
      <div className="w-full flex justify-between">
        {serviceNeeded ? (
          <p className="bg-red-500 p-1 rounded px-2 text-white font-bold text-center">
            ! Service needed ! <br />
            <span className="font-normal">
              since: {sinceLastService - serviceItem.serviceInterval + " km"}
            </span>
          </p>
        ) : (
          <div className="flex gap-2 items-center">
            <span className="bg-green-500 p-1 rounded px-2 text-white font-bold">
              Service done
            </span>
            <span>
              {untilNextService + " km until next service is needed."}
            </span>
          </div>
        )}
        <DeleteModal
          title={serviceItem.title}
          motorcycleId={motorcycleId}
          serviceItemId={id}
        />
      </div>
    </div>
  );
}
