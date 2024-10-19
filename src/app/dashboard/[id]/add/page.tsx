import { addServiceItem } from "@/app/Actions";

export default async function AddServiceItemPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  // Get today's date in the format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col items-center my-16">
      <form
        action={addServiceItem}
        className="flex gap-1 flex-col bg-slate-300 shadow-md max-w-lg p-4 rounded"
      >
        <h3 className="text-xl font-bold mb-4">Add new Tracked Service Item</h3>
        <input type="hidden" name="id" value={id} />
        <div>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Service item"
            required
          />
        </div>
        <div>
          <input
            type="number"
            min="0"
            name="lastService"
            id="lastService"
            placeholder="Last serviced at 'X' km"
            required
          />
        </div>
        <div>
          <label htmlFor="lastServiceDate">Last service date</label>
          <input
            max={today}
            defaultValue={today}
            type="date"
            name="lastServiceDate"
            id="lastServiceDate"
            required
          />
        </div>
        <hr className="border-slate-600 my-1" />
        <label htmlFor="serviceInterval">Service interval (km)</label>
        <input
          type="number"
          name="serviceInterval"
          id="serviceInterval"
          min="1"
          placeholder="Should service every: 'X' km"
        />
        <hr className="border-slate-600 my-1" />
        <div>
          <span>Service interval (days/month/years)</span>

          <div className="flex gap-2 items-center">
            <div className="mb-4">
              <input
                type="number"
                id="intervalValue"
                name="intervalValue"
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
                <option value="days">Days</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>
        </div>
        <button className="bg-slate-600 hover:bg-slate-700 transition-all py-1 px-2 text-white font-bold">
          Submit
        </button>
      </form>
    </div>
  );
}
