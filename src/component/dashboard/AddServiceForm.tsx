"use client";

import { ServiceTime } from "@/model/TrackedServicesModel";
import { useState } from "react";

const AddServiceForm = ({
  onAdd,
}: {
  onAdd: (newService: ServiceTime) => void;
}) => {
  const [newService, setNewService] = useState<ServiceTime>({
    serviceDate: new Date(),
    servicedAt: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: name === "serviceDate" ? new Date(value) : parseInt(value, 10),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newService); // Add new service
    setNewService({ serviceDate: new Date(), servicedAt: 0 }); // Reset form
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-4 border rounded-md bg-white"
    >
      <div className="mb-4">
        <label
          htmlFor="serviceDate"
          className="block text-sm font-medium text-gray-700"
        >
          Service Date
        </label>
        <input
          type="date"
          name="serviceDate"
          value={newService.serviceDate.toISOString().split("T")[0]} // Format Date as yyyy-mm-dd
          onChange={handleChange}
          className="border-gray-400 shadow-sm border-1 rounded py-2 px-4"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="servicedAt"
          className="block text-sm font-medium text-gray-700"
        >
          Serviced At (km)
        </label>
        <input
          type="number"
          name="servicedAt"
          value={newService.servicedAt}
          onChange={handleChange}
          className="border-gray-400 shadow-sm border-1 rounded py-2 px-4"
          placeholder="Serviced At (km)"
        />
      </div>
      <button
        type="submit"
        className="bg-green-500 w-full hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Add new
      </button>
    </form>
  );
};

export default AddServiceForm;
