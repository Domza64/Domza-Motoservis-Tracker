"use server";

import dbConnect from "@/lib/dbConnect";
import TrackedServicesModel from "@/model/TrackedServicesModel";
import UserModel from "@/model/UserModel";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function setMilage(formData: FormData) {
  // Connect to db
  await dbConnect();

  // Get user details
  const { getUser } = getKindeServerSession();
  const authenticatedUser = await getUser();

  // Get form data
  const id = formData.get("motorcycleId");
  const newMilage = formData.get("milage");

  // Update the milage
  await TrackedServicesModel.findOneAndUpdate(
    {
      _id: id,
      ownerId: authenticatedUser.id,
    },
    { $push: { milage: { date: new Date(), milage: newMilage } } },
    { new: true, useFindAndModify: false }
  );

  revalidatePath(`/dashboard/${id}`);
}

const totalDays = (formData: FormData) => {
  const daysEntryValue = formData.get("intervalValueDays"); // Get the entry value
  const days: number | null = daysEntryValue ? Number(daysEntryValue) : null; // Convert to number or null
  const type: string = formData.get("intervalType") as string; // Cast to string

  let totalDays: number | null = null; // Variable to store the total days

  // Calculate total days based on the type
  if (days !== null) {
    switch (type) {
      case "d": // If the type is days
        totalDays = days;
        break;
      case "m": // If the type is months
        totalDays = days * 30; // Approximate days in a month
        break;
      case "y": // If the type is years
        totalDays = days * 365; // Approximate days in a year
        break;
      default:
        console.error("Unknown interval type");
    }
  }
  return totalDays;
};

export async function updateServiceItem(formData: FormData) {
  // Connect to the database
  await dbConnect();

  // Get user details
  const { getUser } = getKindeServerSession();
  const authenticatedUser = await getUser();

  // Extract the serviceItemId from the form data
  const serviceItemId = formData.get("serviceItemId") as string;

  const updateFields = {
    title: (formData.get("title") as string) || "Default Title", // Type assertion and default value
    serviceInterval: parseFloat(formData.get("serviceInterval") as string) || 0, // Default to 0 if not provided
    serviceIntervalDays: totalDays(formData),
  };
  // Get the id of the parent service document
  const id = formData.get("id") as string;

  // Update the service item
  const test = await TrackedServicesModel.updateOne(
    {
      _id: id,
      ownerId: authenticatedUser.id, // Ensure ownerId matches authenticatedUser's ID
      "serviceItem._id": serviceItemId, // Ensure we are updating the correct service item
    },
    {
      $set: {
        [`serviceItem.$.title`]: updateFields.title, // Update the title in the matched service item
        [`serviceItem.$.serviceInterval`]: updateFields.serviceInterval, // Update the serviceInterval
        [`serviceItem.$.serviceIntervalDays`]: updateFields.serviceIntervalDays, // Update the serviceIntervalDays
      },
    }
  );

  redirect(`/dashboard/${id}`);
}

export async function addServiceItem(formData: FormData) {
  // Connect to db
  await dbConnect();

  // Get user details
  const { getUser } = getKindeServerSession();
  const authenticatedUser = await getUser();

  const id = formData.get("id") as string;

  const newServiceItem = {
    title: (formData.get("title") as string) || "Default Title", // Type assertion and default value
    services: [
      {
        date: new Date(formData.get("lastServiceDate") as string) || new Date(), // Default to now if not provided
        lastService: parseFloat(formData.get("lastService") as string) || 0, // Default to 0 if not provided
      },
    ],
    serviceInterval: parseFloat(formData.get("serviceInterval") as string) || 0, // Default to 0 if not provided
    serviceIntervalDays: totalDays(formData),
  };

  await TrackedServicesModel.findOneAndUpdate(
    {
      _id: id,
      ownerId: authenticatedUser.id, // Ensure ownerId matches authenticatedUser's ID
    },
    { $push: { serviceItem: newServiceItem } },
    { new: true, useFindAndModify: false }
  );

  redirect(`/dashboard/${id}`);
}

export async function deleteMotorcycle(formData: FormData) {
  // Get user details
  const { getUser } = getKindeServerSession();
  const authenticatedUser = await getUser();
  const userId = authenticatedUser.id;

  // Get id for motorcycle to delete
  const id = formData.get("motorcycleId");

  // Delete the motorcycle and it's tracked services
  await dbConnect();
  await TrackedServicesModel.findOneAndDelete({ _id: id, ownerId: userId });
  await UserModel.findOneAndUpdate(
    { authId: userId },
    { $pull: { bikes: { _id: id } } }
  );

  redirect("/dashboard");
}

export async function deleteServiceItem(formData: FormData) {
  // Connect to db
  await dbConnect();

  // Get user details
  const { getUser } = getKindeServerSession();
  const authenticatedUser = await getUser();

  // Get the service item ID and motorcycle ID from the form data
  const id = formData.get("serviceItemId") as string;
  const motorcycleId = formData.get("motorcycleId") as string;

  // Delete the service item
  await TrackedServicesModel.findOneAndUpdate(
    {
      _id: motorcycleId,
      ownerId: authenticatedUser.id,
    },
    { $pull: { serviceItem: { _id: id } } },
    { new: true, useFindAndModify: false }
  );

  // Revalidate the path for the dashboard
  revalidatePath(`/dashboard/${motorcycleId}`);
}

export async function setServiced(formData: FormData) {
  // Connect to the database
  await dbConnect();

  // Get user details
  const { getUser } = getKindeServerSession();
  const authenticatedUser = await getUser();

  // Get necessary data from form data
  const serviceItemId = formData.get("serviceItemId") as string;
  const currentMilage = formData.get("currentMilage") as string;
  const motorcycleId = formData.get("motorcycleId") as string;

  // Update the service item with the new mileage and date
  await TrackedServicesModel.findOneAndUpdate(
    {
      _id: motorcycleId,
      ownerId: authenticatedUser.id,
      "serviceItem._id": serviceItemId,
    },
    {
      $push: {
        "serviceItem.$.services": {
          servicedAt: parseFloat(currentMilage) || 0,
          serviceDate: new Date(),
          test: "test",
        },
      },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  );

  // Revalidate the path for the dashboard
  revalidatePath(`/dashboard/${motorcycleId}`);
}

export async function deleteServiceRecord(
  bikeId: string,
  trackedServiceItemId: string,
  serviceRecordId: string
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  await dbConnect();

  try {
    await TrackedServicesModel.updateOne(
      {
        ownerId: user.id, // Match the owner
        serviceItem: {
          $elemMatch: { _id: trackedServiceItemId }, // Find the specific service item by its ID
        },
      },
      {
        $pull: {
          "serviceItem.$.services": { _id: serviceRecordId },
        },
      }
    );

    revalidatePath(`/dashboard/${bikeId}/service-item/${trackedServiceItemId}`);
  } catch (error) {
    console.error("Error fetching bike:", error);
  }
}

export async function updateServiceRecord(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const serviceRecordId = formData.get("serviceRecordId") as string | undefined;
  const trackedServiceItemId = formData.get("trackedServiceItemId") as string;
  const bikeId = formData.get("bikeId") as string;
  const date = formData.get("serviceDate") as string;
  const mileage = Number(formData.get("servicedAt") as string);

  await dbConnect();

  try {
    if (serviceRecordId == undefined) {
      // Create a new tracked services record
      await TrackedServicesModel.findOneAndUpdate(
        {
          ownerId: user.id,
          "serviceItem._id": trackedServiceItemId,
        },
        {
          $push: {
            "serviceItem.$.services": {
              $each: [{ servicedAt: mileage, serviceDate: date }],
              $sort: { serviceDate: 1 },
            },
          },
        }
      );
    } else {
      // Update existing record
      // Update existing record
      await TrackedServicesModel.findOneAndUpdate(
        {
          ownerId: user.id,
          "serviceItem._id": trackedServiceItemId,
          "serviceItem.services._id": serviceRecordId,
        },
        {
          $set: {
            "serviceItem.$[outer].services.$[inner].servicedAt": mileage,
            "serviceItem.$[outer].services.$[inner].serviceDate": date,
          },
        },
        {
          arrayFilters: [
            { "outer._id": trackedServiceItemId },
            { "inner._id": serviceRecordId },
          ],
        }
      );

      // Ensure the array is sorted after the update
      await TrackedServicesModel.findOneAndUpdate(
        {
          ownerId: user.id,
          "serviceItem._id": trackedServiceItemId,
        },
        {
          $push: {
            "serviceItem.$.services": {
              $each: [],
              $sort: { serviceDate: 1 },
            },
          },
        }
      );
    }

    revalidatePath(`/dashboard/${bikeId}/service-item/${trackedServiceItemId}`);
  } catch (error) {
    console.error("Error updating service record:", error);
  }
}
