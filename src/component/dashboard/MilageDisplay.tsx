"use client";

import { setMilage } from "@/app/Actions";
import { useEffect, useState } from "react";

interface Props {
  initialMilage: number;
  motorcycleId: string;
}

export default function MilageDisplay({ initialMilage, motorcycleId }: Props) {
  const [milage, setMilageState] = useState(initialMilage);
  const [editMilage, setEditMilage] = useState(false);

  useEffect(() => {
    setMilageState(initialMilage);
  }, [editMilage, initialMilage]);

  return editMilage ? (
    <>
      {/* Todo: what happens if milage is not set succesfully? In that case don't set form to false, instead display error message to try again. */}
      <form
        className="flex gap-2"
        action={setMilage}
        onSubmit={() => setEditMilage(false)}
      >
        <div className="flex flex-col">
          {milage < initialMilage && (
            <span className="text-red-500">
              Selected milage is lower than your current milage!
            </span>
          )}
          <input hidden value={motorcycleId} name="motorcycleId" />
          <input
            className={`bg-gray-200 ${
              milage < initialMilage ? "border-red-500 border-2" : ""
            } bg-white p-1 rounded`}
            min={0}
            value={milage}
            onChange={(e) => setMilageState(Number(e.target.value))}
            required
            name="milage"
            type="number"
          />
        </div>
        <button className="bg-slate-600 rounded text-white font-semibold py-1 px-2">
          Set new milage
        </button>
      </form>
      <button className="underline" onClick={() => setEditMilage(false)}>
        Cancel
      </button>
    </>
  ) : (
    <>
      <span>Currently has: {initialMilage} km</span>
      <button className="underline" onClick={() => setEditMilage(true)}>
        Edit
      </button>
    </>
  );
}
