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
  //const serviceIntervalDate = serviceItem.serviceIntervalDate;

  return (
    <div className="rounded bg-white p-4 shadow-md w-full">
      <p className="font-bold">{serviceItem.title}</p>
      {serviceInterval && <p>Should service every: {serviceInterval} km</p>}
      {/*serviceIntervalDate && (
        <p>Should service every: {serviceIntervalDate} days</p>
      )*/}
      <p>Since last service: {sinceLastService + " km"}</p>
      {sinceLastService > serviceInterval ? (
        <p className="text-red-500 font-bold">
          Service needed{" "}
          <span className="text-gray-800 font-normal">
            since: {sinceLastService - serviceItem.serviceInterval + " km"}
          </span>
        </p>
      ) : (
        <p className="text-green-500">Service done</p>
      )}
      {/* TODO - Add are you sure prompt */}
      <form action={deleteServiceItem}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="motorcycleId" value={motorcycleId} />
        {/*<DeleteButton />*/}
        <button type="submit">Delete</button>
      </form>
    </div>
  );
}
