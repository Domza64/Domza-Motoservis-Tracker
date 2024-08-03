"use client";

import { addMotorcycle } from "@/app/Actions";
import SubmitButton from "@/component/SubmitButton";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";

export default function AddBike() {
  const [state, formAction] = useFormState(addMotorcycle, undefined);

  useEffect(() => {
    if (state?.success) {
      redirect(`/dashboard/${state.id}`);
    }
  }, [state]);

  return (
    <div className="flex flex-col items-center mt-12">
      <h3 className="text-xl font-bold mb-4">Add new Motorcycle</h3>
      <form
        action={formAction}
        className="flex gap-1 flex-col bg-slate-200 shadow-md max-w-lg p-4 rounded"
      >
        <div>
          <input
            type="text"
            name="motorcycleName"
            id="motorcycleName"
            placeholder="Motorcycle name"
            required
          />
        </div>
        <div>
          <input
            type="number"
            min="0"
            name="currentMilage"
            id="currentMilage"
            placeholder="Current milage"
            required
          />
        </div>
        <SubmitButton />
      </form>
    </div>
  );
}
