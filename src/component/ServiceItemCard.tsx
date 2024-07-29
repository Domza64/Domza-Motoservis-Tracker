import { ServiceItem } from "@/model/UserModel";
import { deleteServiceItem } from "@/app/Actions";

interface Props {
  serviceItem: ServiceItem;
  currentMotorcycleMilage: number;
}

export default function ServiceItemCard({
  serviceItem,
  currentMotorcycleMilage,
}: Props) {
  // @ts-ignore
  const id = serviceItem._id.toString();

  const serviceInterval = serviceItem.serviceInterval;
  const sinceLastService = currentMotorcycleMilage - serviceItem.lastService;
  //const serviceIntervalDate = serviceItem.serviceIntervalDate;

  return (
    <div className="rounded bg-sky-100 p-4 shadow-md">
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
        {/*<DeleteButton />*/}
        <button type="submit">Delete</button>
      </form>
    </div>
  );
}
