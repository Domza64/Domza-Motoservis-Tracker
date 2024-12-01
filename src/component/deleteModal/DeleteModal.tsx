"use client";

import React, { useState } from "react";
import Image from "next/image";
import { deleteMotorcycle, deleteServiceItem } from "@/app/Actions";

interface Props {
  title: string;
  motorcycleId: string;
  serviceItemId?: string;
}

export default function DeleteModal({
  title,
  motorcycleId,
  serviceItemId,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={handleOpen}
        className="text-red-600 hover:text-red-800 transition-all hover:bg-gray-200 rounded-lg p-2"
      >
        <Image
          src={"/icon/delete.svg"}
          alt={"Delete icon"}
          width={32}
          height={32}
        />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-red-600 font-bold text-lg">Delete {title}</h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="mt-4">
              <p>
                Are you sure you want to delete the <b>{title}</b>? This will
                permanently delete all of the data associated with {title} and
                it cannot be reversed.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleClose}
                className="bg-slate-400 text-white px-4 py-2 rounded-lg hover:bg-slate-500"
              >
                Cancel
              </button>
              <form
                action={serviceItemId ? deleteServiceItem : deleteMotorcycle}
                method="POST"
                className="inline"
              >
                <input type="hidden" name="motorcycleId" value={motorcycleId} />
                <input
                  type="hidden"
                  name="serviceItemId"
                  value={serviceItemId || ""}
                />
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
