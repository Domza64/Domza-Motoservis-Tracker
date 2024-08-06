"use client";

import { addMotorcycle } from "@/app/Actions";
import SubmitButton from "@/component/SubmitButton";
import { Input } from "@nextui-org/react";
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
    <div className="flex flex-col items-center w-full mb-24 p-4">
      <h3 className="text-xl font-bold mb-4">Add new Motorcycle</h3>
      <form
        action={formAction}
        className="flex gap-3 flex-col bg-slate-200 shadow-md max-w-lg p-4 rounded w-full"
      >
        <Input
          name="motorcycleName"
          type="text"
          label="Motorcycle"
          placeholder="Motorcycle model"
          labelPlacement="outside"
        />
        <Input
          name="currentMilage"
          type="number"
          label="Current Milage"
          placeholder="0.00"
          labelPlacement="outside"
          defaultValue="0"
          min={0}
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">km</span>
            </div>
          }
        />
        <SubmitButton className={"mt-4"} />
      </form>
    </div>
  );
}
