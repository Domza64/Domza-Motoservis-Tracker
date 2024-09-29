import DeleteModal from "../../../deleteModal/DeleteModal";
import { ServiceItem } from "@/model/TrackedServicesModel";
import { setServiced } from "@/app/Actions";
import Image from "next/image";
import { Link } from "@nextui-org/react";

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
  const sinceLastService =
    // @ts-ignore
    currentMotorcycleMilage - serviceItem.services.at(-1)?.lastService;
  const serviceNeeded = sinceLastService >= serviceInterval;
  const untilNextService = serviceInterval - sinceLastService;

  var untilNextServiceDays = undefined;
  const lastServiceDate = serviceItem.services.at(-1)?.date || new Date();
  const currentDate = new Date();
  if (lastServiceDate) {
    // Calculate the time difference in milliseconds
    const timeDifference =
      currentDate.getTime() - new Date(lastServiceDate).getTime();
    // Convert the time difference from milliseconds to days
    const daysSinceLastService = Math.floor(
      timeDifference / (1000 * 60 * 60 * 24)
    );
    untilNextServiceDays =
      daysSinceLastService - serviceItem.serviceIntervalDays;
  }

  return (
    <div
      className={`rounded bg-white py-2 px-4 shadow-md flex flex-col justify-between w-full ${
        serviceNeeded ? "border-primary border-2 order-1" : "order-2"
      }`}
    >
      <div className="flex justify-between items-start">
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
          {serviceItem.serviceIntervalDays && (
            <p>
              <span className="font-semibold">Service every: </span>{" "}
              {serviceItem.serviceIntervalDays} days
            </p>
          )}
          <p>
            <span className="font-semibold">Last service at: </span>{" "}
            {/* TODO - show last not one at index 0 */}
            {serviceItem.services.at(-1)?.lastService} km
          </p>
          <p>
            <span className="font-semibold">
              Last service {daysAgo(lastServiceDate)} days ago.
            </span>
          </p>
        </div>
        <div className="flex flex-col h-full justify-between items-end">
          <div className="flex gap-1 justify-center items-center">
            <Link
              href={`${motorcycleId}/service-item/${id}`}
              className="hover:bg-gray-200 transition-all"
            >
              <Image
                src={"/icon/analytics.svg"}
                alt={"Service item data"}
                width={36}
                height={36}
              />
            </Link>
            <Link
              href={`${motorcycleId}/service-item?id=${id}`}
              className="hover:bg-gray-200 transition-all"
            >
              <Image
                src={"/icon/settings.svg"}
                alt={"Service item settings"}
                width={36}
                height={36}
              />
            </Link>
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
            <button className="bg-blue-500 hover:bg-blue-600 transition-all text-white rounded py-1 px-2 flex gap-1 font-semibold shadow-lg">
              <Image
                src={"/icon/service.svg"}
                alt={"Check icon"}
                width={24}
                height={24}
              />
              <span>Set Serviced!</span>
            </button>
          </form>
        </div>
      </div>
      <hr className="border-slate-600 my-2" />
      <div className="w-full flex justify-between items-end">
        {serviceNeeded ? (
          <div className="p-1">
            <Image
              src={"/icon/warning.svg"}
              alt={"Warning icon"}
              width={32}
              height={32}
            />
            <span>Service needed</span>
            <br />
            <span className="font-normal">
              since: {sinceLastService - serviceItem.serviceInterval + " km"}
            </span>
            <br />
            <span className="font-normal">
              since:{" "}
              {daysAgo(lastServiceDate) -
                serviceItem.serviceIntervalDays +
                " days"}
            </span>
          </div>
        ) : (
          <div>
            <div className="flex gap-1 items-center">
              <Image
                src={"/icon/serviced.svg"}
                alt={"Checkmark icon"}
                width={32}
                height={32}
              />
              <span className="text-green-500 p-1 rounded font-bold">
                Service done
              </span>
            </div>
            <div className="flex flex-col">
              <span>
                <b>{untilNextService} km </b>until next service is needed.
              </span>
              {untilNextServiceDays ? (
                <span>
                  <b>{untilNextServiceDays} days </b>until next service is
                  needed.
                </span>
              ) : (
                <></>
              )}
            </div>
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

function daysAgo(date: Date): number {
  const today = new Date(); // Get the current date
  const timeDifference = today.getTime() - date.getTime(); // Calculate the time difference in milliseconds
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  return daysDifference;
}
