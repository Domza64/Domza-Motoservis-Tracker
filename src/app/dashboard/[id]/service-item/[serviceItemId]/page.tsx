import DeleteButton from "@/component/dashboard/serviceItemAnalitycs/DeleteButton";
import dbConnect from "@/lib/dbConnect";
import TrackedServicesModel, {
  ServiceItem,
  ServiceTime,
} from "@/model/TrackedServicesModel";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function DataPage({
  params,
}: {
  params: { id: string; serviceItemId: string };
}) {
  const id = params.id;
  const serviceItemId = params.serviceItemId;

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

          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="text-left">
                <th className="py-2 px-4 border-b">Service Date</th>
                <th className="py-2 px-4 border-b">Serviced At (km)</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.services.map((service) => (
                // @ts-ignore
                <tr key={service._id}>
                  <td className="py-2 px-4 border-b">
                    {new Date(service.serviceDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {service.servicedAt} km
                  </td>
                  <td className="py-2 px-4 border-b flex space-x-2">
                    <button
                      disabled
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Edit
                    </button>
                    <DeleteButton
                      bikeId={id}
                      trackedServiceItemId={serviceItemId}
                      // @ts-ignore
                      serviceRecordId={service._id.toString()}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
