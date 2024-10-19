"use client";

import { deleteServiceRecord } from "@/app/Actions";

interface Props {
  bikeId: string;
  trackedServiceItemId: string;
  serviceRecordId: string;
}

export default function DeleteButton(props: Props) {
  const { bikeId, trackedServiceItemId, serviceRecordId } = props;
  return (
    <button
      onClick={async () =>
        await deleteServiceRecord(bikeId, trackedServiceItemId, serviceRecordId)
      }
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
    >
      Delete
    </button>
  );
}
