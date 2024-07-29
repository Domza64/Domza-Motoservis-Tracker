"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { revalidatePath } from "next/cache";

export async function setMilage(formData: FormData) {
  try {
    await dbConnect();
    const session = await auth();

    const userEmail = session?.user?.email;

    await UserModel.findOneAndUpdate(
      {
        email: userEmail,
      },
      {
        currentMilage: Number(formData.get("milage")),
      }
    );

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error setting milage: ", error);
  }
}

export async function addServiceItem(prevState: any, formData: FormData) {
  try {
    await dbConnect();
    const session = await auth();
    const userEmail = session?.user?.email;

    // TODO - Calculate days from this data
    //serviceInterval: formData.get("serviceInterval") || undefined,
    //serviceIntervalDate: formData.get("serviceIntervalDate") || undefined,

    const newServiceItem = {
      title: formData.get("title"),
      lastService: formData.get("lastService"),
      lastServiceDate: formData.get("lastServiceDate"),
      serviceIntervalDays: 0,
    };

    await UserModel.findOneAndUpdate(
      {
        email: userEmail,
      },
      { $push: { serviceItem: newServiceItem } },
      { new: true, useFindAndModify: false }
    );

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error adding service item: ", error);
    return { success: false };
  }
}

export async function deleteServiceItem(formData: FormData) {
  try {
    await dbConnect();
    const session = await auth();
    const userEmail = session?.user?.email;

    const id = formData.get("id");

    await UserModel.findOneAndUpdate(
      {
        email: userEmail,
      },
      { $pull: { serviceItem: { _id: id } } },
      { new: true, useFindAndModify: false }
    );

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error adding service item: ", error);
  }
}
