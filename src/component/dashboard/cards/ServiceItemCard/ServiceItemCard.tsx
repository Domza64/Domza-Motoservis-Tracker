import DeleteModal from "../../../deleteModal/DeleteModal";
import { ServiceItem } from "@/model/TrackedServicesModel";
import { setServiced } from "@/app/Actions";
import Image from "next/image";
import Link from "next/link";

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

  // Destructure properties for better readability
  const { serviceInterval, serviceIntervalDays, services } = serviceItem;

  // Calculate mileage since last service
  const lastService = services.at(-1);
  const sinceLastService = lastService
    ? currentMotorcycleMilage - lastService.servicedAt
    : 0;

  // Determine if service is needed based on mileage
  const isServiceDue = sinceLastService >= serviceInterval;

  // Initialize variables for remaining kilometers and days until next service
  const kmUntilNextService = lastService
    ? serviceInterval - sinceLastService
    : undefined;
  let daysUntilNextService: number | undefined;

  // Check if last service exists to calculate days until next service
  if (lastService) {
    const lastServiceDate = new Date(lastService.serviceDate);
    const daysSinceLastService = daysAgo(lastServiceDate);
    daysUntilNextService = serviceIntervalDays - daysSinceLastService;

    // Calculate if the service is overdue based on days
    if (serviceIntervalDays && daysUntilNextService < 0) {
      daysUntilNextService = undefined; // Reset if the calculation is invalid
    }
  }

  return (
    <div
      className={`rounded bg-white py-2 px-4 shadow-md flex flex-col justify-between w-full ${
        isServiceDue ? "border-primary border-2 order-1" : "order-2"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-xl">{serviceItem.title}</p>
          {lastService ? (
            <>
              <>
                <span className="font-semibold">Since last service:</span>{" "}
                {sinceLastService + " km"},{" "}
                <span>{daysAgo(new Date(lastService.serviceDate))} days</span>
              </>
              <p>
                <span className="font-semibold">Last service: </span>{" "}
                {lastService.servicedAt} km,{" "}
                {formatDate(lastService.serviceDate)}
              </p>
            </>
          ) : (
            <p>No service records available.</p>
          )}
          <hr className="my-1 border-slate-600" />
          {(serviceInterval || serviceIntervalDays) && (
            <>
              <span className="font-semibold">Service interval: </span>
              {serviceIntervalDays && <span>{serviceIntervalDays} days,</span>}
              {serviceInterval && <span> {serviceInterval} km</span>}
            </>
          )}
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
        {isServiceDue ? (
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
              since:{" "}
              {lastService ? sinceLastService - serviceInterval + " km" : "N/A"}
            </span>
            <br />
            <span className="font-normal">
              since: {lastService ? daysUntilNextService + " days" : "N/A"}
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
                {kmUntilNextService} km, {daysUntilNextService} days until next
                service is needed.
              </span>
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

// Utility function to calculate days since a given date
function daysAgo(date: Date): number {
  const today = new Date(); // Get the current date
  const timeDifference = today.getTime() - date.getTime(); // Calculate the time difference in milliseconds
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  return daysDifference;
}

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options).replace(/,/g, "");
}
