"use client";
import { useState } from "react";
import DeleteButton from "./serviceItemAnalitycs/DeleteButton";
import { updateServiceRecord } from "@/app/Actions";

export default function ServiceItemRowItem({
  serviceDate,
  servicedAt,
  id,
  serviceItemId,
  serviceId,
}: {
  id: string;
  serviceItemId: string;
  serviceDate: Date;
  servicedAt: number;
  serviceId: string;
}) {
  const [editing, setEditing] = useState(false);

  // Format date for input type="date"
  const formatDateForInput = (date: Date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  if (editing) {
    return (
      <form
        action={updateServiceRecord}
        className="w-full flex text-center"
        onSubmit={() => setEditing(false)}
      >
        <input type="hidden" name="bikeId" value={id} />
        <input
          type="hidden"
          name="trackedServiceItemId"
          value={serviceItemId}
        />
        <input type="hidden" name="serviceRecordId" value={serviceId} />
        <input
          name="serviceDate"
          className="py-2 w-1/3 px-4 border-b"
          defaultValue={formatDateForInput(serviceDate)}
          type="date"
          required
        />
        <input
          name="servicedAt"
          className="py-2 w-1/3 px-4 border-b"
          type="number"
          defaultValue={servicedAt}
          required
        />
        <div className="py-2 w-1/3 px-4 border-b justify-center flex space-x-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          >
            Submit
          </button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="w-full flex text-center">
      <span className="py-2 w-1/3 px-4 border-b">
        {new Date(serviceDate).toLocaleDateString()}
      </span>
      <span className="py-2 w-1/3 px-4 border-b">{servicedAt} km</span>
      <div className="py-2 w-1/3 px-4 border-b justify-center flex space-x-2">
        <button
          onClick={() => setEditing(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
        >
          Edit
        </button>
        <DeleteButton
          bikeId={id}
          trackedServiceItemId={serviceItemId}
          serviceRecordId={serviceId}
        />
      </div>
    </div>
  );
}
