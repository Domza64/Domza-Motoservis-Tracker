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

export async function addServiceItem(formData: FormData) {
  // Connect to db
  await dbConnect();

  // Get user details
  const { getUser } = getKindeServerSession();
  const authenticatedUser = await getUser();

  // TODO - Calculate days from this data
  //serviceInterval: formData.get("serviceInterval") || undefined,
  //serviceIntervalDate: formData.get("serviceIntervalDate") || undefined,

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
  const updatedTrackedService = await TrackedServicesModel.findOneAndUpdate(
    {
      _id: motorcycleId,
      ownerId: authenticatedUser.id,
      "serviceItem._id": serviceItemId,
    },
    {
      $push: {
        "serviceItem.$.services": {
          lastService: parseFloat(currentMilage) || 0,
          date: new Date(),
        },
      },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  );
  console.log(updatedTrackedService);

  // Revalidate the path for the dashboard
  revalidatePath(`/dashboard/${motorcycleId}`);
}
