import { addServiceItem, updateServiceItem } from "@/app/Actions";
import dbConnect from "@/lib/dbConnect";
import TrackedServicesModel, {
  ServiceItem,
} from "@/model/TrackedServicesModel";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function AddServiceItemPage({
  params,
  searchParams,
}: {
  params: { id: string; serviceItemId: string };
  searchParams: { id?: string };
}) {
  const id = params.id;
  const serviceItemId = searchParams.id;

  // Get today's date in the format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  var data: ServiceItem | undefined = undefined;
  if (serviceItemId) {
    data = await getData(id, serviceItemId);
  }

  return (
    <div className="flex flex-col items-center my-16">
      <h3 className="text-xl font-bold mb-4">
        {data ? `Edit ${data?.title}.` : "Add new Service Item"}
      </h3>
      <form
        action={data ? updateServiceItem : addServiceItem}
        className="flex gap-1 flex-col bg-slate-300 shadow-md max-w-lg p-4 rounded"
      >
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="serviceItemId" value={serviceItemId} />
        <div>
          <span>*</span>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={data ? data.title : undefined}
            placeholder="Service item"
            required
          />
        </div>
        {!data && (
          <>
            <div>
              <span>*</span>

              <label htmlFor="lastServiceDate">
                Last serviced at &apos;X&apos; km
              </label>
              <input
                type="number"
                min="0"
                name="lastService"
                id="lastService"
                placeholder="Last serviced at 'X' km"
                defaultValue={0}
                required
              />
            </div>
            <div>
              <span>*</span>
              <label htmlFor="lastServiceDate">Last service date</label>
              <input
                max={today}
                type="date"
                name="lastServiceDate"
                defaultValue={today}
                id="lastServiceDate"
                required
              />
            </div>
          </>
        )}
        <hr className="border-slate-600 my-1" />
        <label htmlFor="serviceInterval">Service interval (km)</label>
        <input
          type="number"
          name="serviceInterval"
          id="serviceInterval"
          min="0"
          defaultValue={data?.serviceInterval || undefined}
          placeholder="Should service every: 'X' km"
        />
        <hr className="border-slate-600 my-1" />
        <div>
          <span>Service interval (days/month/years)</span>

          <div className="flex gap-2 items-center">
            <div className="mb-4">
              <input
                type="number"
                id="intervalValueDays"
                name="intervalValueDays"
                defaultValue={data?.serviceIntervalDays || undefined}
                min="1"
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <select
                id="intervalType"
                name="intervalType"
                className="mt-1 p-2 border rounded w-full"
              >
                <option value="d">Days</option>
                <option value="m">Months</option>
                <option value="y">Years</option>
              </select>
            </div>
          </div>
        </div>
        <button className="bg-slate-600 hover:bg-slate-700 transition-all py-1 px-2 text-white font-bold">
          {data ? "Update" : "Add"}
        </button>
      </form>
    </div>
  );
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
