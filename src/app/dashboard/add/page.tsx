"use client";

import { addServiceItem } from "@/app/Actions";
import SubmitButton from "@/component/SubmitButton";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";

export default function AddServiceItemForm() {
  const [state, formAction] = useFormState(addServiceItem, undefined);

  useEffect(() => {
    if (state?.success) {
      redirect("/dashboard");
    }
  }, [state]);

  return (
    <main className="flex flex-col items-center mt-12">
      <h1 className="text-xl font-bold mb-4">Add new Service Item to track</h1>
      <form
        action={formAction}
        className="flex gap-1 flex-col bg-slate-200 shadow-md max-w-lg p-4 rounded"
      >
        <div>
          <span>*</span>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Service item"
            required
          />
        </div>
        <div>
          <span>*</span>
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
          <span>*</span>
          <label htmlFor="lastServiceDate">Last service date</label>
          <input
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
          min="0"
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
        <SubmitButton />
      </form>
    </main>
  );
}
