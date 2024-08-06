import { deleteServiceItem } from "@/app/Actions";
import { ServiceItem } from "@/model/MotorcycleModel";
import DeleteButton from "./DeleteButton";

interface Props {
  serviceItem: ServiceItem;
  motorcycleId: string;
  currentMotorcycleMilage: number;
}

export default function ServiceItemCard({
  serviceItem,
  motorcycleId,
  currentMotorcycleMilage,
}: Props) {
  // @ts-ignore
  const id = serviceItem._id.toString();

  const serviceInterval = serviceItem.serviceInterval;
  const sinceLastService = currentMotorcycleMilage - serviceItem.lastService;
  const serviceNeeded = true;
  //const serviceIntervalDate = serviceItem.serviceIntervalDate;

  return (
    <div
      className={"rounded bg-white py-2 px-4 shadow-md flex flex-col w-full"}
    >
      <p className="font-bold text-xl">{serviceItem.title}</p>
      <p>
        <span className="font-semibold">Since last service:</span>{" "}
        {sinceLastService + " km"}
      </p>
      <p>
        <span className="font-semibold">Service every: </span> {serviceInterval}{" "}
        km
      </p>
      <hr className="border-slate-600 my-2" />
      <div className="w-full flex justify-between">
        {serviceNeeded ? (
          <p className="text-red-500 font-bold">
            Service needed <br />
            <span className="text-gray-800 font-normal">
              since: {sinceLastService - serviceItem.serviceInterval + " km"}
            </span>
          </p>
        ) : (
          <p className="text-green-500">Service done</p>
        )}
        <form action={deleteServiceItem}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="motorcycleId" value={motorcycleId} />
          {/*<DeleteButton />*/}
          <button className="text-red-500 underline" type="submit">
            Delete track item
          </button>
        </form>
      </div>
    </div>
  );
}
