"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import MotorcycleModel from "@/model/MotorcycleModel";
import UserModel from "@/model/UserModel";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function setMilage(formData: FormData) {
  console.log("EIIIi");
  await dbConnect();
  const session = await auth();
  const email = session?.user?.email;

  const motorcycleId = formData.get("motorcycleId");
  const milage = formData.get("milage");

  const user = await UserModel.findOne({ email });

  if (user && user.bikes.has(motorcycleId)) {
    const motor = await MotorcycleModel.findOneAndUpdate(
      {
        _id: motorcycleId,
      },
      { $set: { currentMilage: milage } },
      { new: true, useFindAndModify: false }
    );

    console.log("MOTOR", motor);

    revalidatePath(`/dashboard/${motorcycleId}`);
  } else {
    console.log("USER", user, "MOTOR ID:", motorcycleId);
  }
}

export async function addServiceItem(formData: FormData) {
  await dbConnect();
  const session = await auth();
  const email = session?.user?.email;

  // TODO - Calculate days from this data
  //serviceInterval: formData.get("serviceInterval") || undefined,
  //serviceIntervalDate: formData.get("serviceIntervalDate") || undefined,

  const id = formData.get("id") as string;

  const newServiceItem = {
    title: formData.get("title"),
    lastService: formData.get("lastService"),
    lastServiceDate: formData.get("lastServiceDate"),
    serviceInterval: formData.get("serviceInterval"),
    serviceIntervalDays: 0,
  };

  // Find the user by email
  const user = await UserModel.findOne({ email });

  if (user && user.bikes.has(id)) {
    await MotorcycleModel.findOneAndUpdate(
      {
        _id: id,
      },
      { $push: { serviceItem: newServiceItem } },
      { new: true, useFindAndModify: false }
    );
  }

  redirect(`/dashboard/${id}`);
}

export async function deleteMotorcycle(formData: FormData) {
  const session = await auth();
  const email = session?.user?.email;
  const id = formData.get("id");

  await dbConnect();

  // Find the user by email
  const user = await UserModel.findOne({ email });

  if (user && user.bikes.has(id)) {
    // Remove bike from user's list
    user.bikes.delete(id);
    await user.save();

    // Delete the bike from the database
    await MotorcycleModel.findByIdAndDelete(id);
  }

  redirect("/dashboard");
}

export async function deleteServiceItem(formData: FormData) {
  await dbConnect();
  const session = await auth();
  const email = session?.user?.email;

  const id = formData.get("serviceItemId");
  const motorcycleId = formData.get("motorcycleId");

  const user = await UserModel.findOne({ email });

  if (user && user.bikes.has(motorcycleId)) {
    await MotorcycleModel.findOneAndUpdate(
      {
        _id: motorcycleId,
      },
      { $pull: { serviceItem: { _id: id } } },
      { new: true, useFindAndModify: false }
    );

    revalidatePath(`/dashboard/${motorcycleId}`);
  }
}
