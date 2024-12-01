import { updateServiceRecord } from "@/app/Actions";
import ServiceItemRowItem from "@/component/dashboard/ServiceItemRowItem";
import dbConnect from "@/lib/dbConnect";
import TrackedServicesModel, {
  ServiceItem,
} from "@/model/TrackedServicesModel";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function DataPage({
  params,
}: {
  params: Promise<{ id: string; serviceItemId: string }>;
}) {
  const { id, serviceItemId } = await params;

  if (serviceItemId) {
    const data: ServiceItem = await getData(id, serviceItemId);
    return (
      <section className="p-6 w-full max-w-6xl">
        <div className="container mx-auto p-6 bg-white shadow-md rounded-md">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Service: {data.title}
          </h1>

          <div className="mb-4">
            <p>
              <span className="font-bold">Service Interval: </span>{" "}
              {data.serviceInterval} km
            </p>
            <p>
              <span className="font-bold">Service Interval Days: </span>{" "}
              {data.serviceIntervalDays} days
            </p>
          </div>

          <div className="min-w-full bg-white border border-gray-300">
            <div className="w-full flex text-center font-bold">
              <span className="py-2 w-1/3 px-4 border-b">Service Date</span>
              <span className="py-2 w-1/3 px-4 border-b">Serviced At (km)</span>
              <span className="py-2 w-1/3 px-4 border-b">Actions</span>
            </div>
            <div>
              {data.services.reverse().map((service) => {
                // @ts-ignore
                const serviceId = service._id.toString();
                return (
                  <>
                    <ServiceItemRowItem
                      id={id}
                      serviceItemId={serviceItemId}
                      serviceDate={service.serviceDate}
                      servicedAt={service.servicedAt}
                      serviceId={serviceId}
                      key={serviceId}
                    />
                  </>
                );
              })}
            </div>
          </div>
          <form
            action={updateServiceRecord}
            className="flex w-full bg-gray-200"
          >
            <input type="hidden" name="bikeId" value={id} />
            <input
              type="hidden"
              name="trackedServiceItemId"
              value={serviceItemId}
            />
            <div className="p-2 border-b flex-1">
              <input
                required
                type="date"
                name="serviceDate"
                className="border-gray-400 shadow-sm border-1 rounded py-2 px-4"
              />
            </div>
            <div className="p-2 border-b flex-1">
              <input
                required
                type="number"
                name="servicedAt"
                placeholder="Serviced At (km)"
                className="border-gray-400 shadow-sm border-1 rounded py-2 px-4"
              />
            </div>
            <div className="py-2 px-4 border-b flex space-x-2">
              <button className="bg-green-500 w-full hover:bg-green-600 text-white font-bold py-1 px-2 rounded">
                Add new
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }

  return <span>Error!</span>;
}

async function getData(bikeId: string, trackedServiceItemId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  await dbConnect();

  try {
    const serviceRecord = await TrackedServicesModel.findOne(
      {
        ownerId: user.id, // Match the owner
        serviceItem: {
          $elemMatch: { _id: trackedServiceItemId }, // Find the specific service item by its ID
        },
      },
      {
        "serviceItem.$": 1, // This will return only the matched service item
      }
    );

    if (!serviceRecord || serviceRecord.serviceItem.length === 0) {
      throw new Error(`Motorcycle: ${bikeId} service history was not found`);
    }

    // Since the query with "$" returns an array with a single element, return just the item
    return serviceRecord.serviceItem[0];
  } catch (error) {
    console.error("Error fetching bike:", error);
  }
}
