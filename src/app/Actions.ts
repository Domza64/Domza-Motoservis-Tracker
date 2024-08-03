"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import MotorcycleModel from "@/model/MotorcycleModel";
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
    const email = session?.user?.email;

    // TODO - Calculate days from this data
    //serviceInterval: formData.get("serviceInterval") || undefined,
    //serviceIntervalDate: formData.get("serviceIntervalDate") || undefined,

    const id = formData.get("id") as string;

    const newServiceItem = {
      title: formData.get("title"),
      lastService: formData.get("lastService"),
      lastServiceDate: formData.get("lastServiceDate"),
      serviceIntervalDays: 0,
    };

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user || !user.bikes.has(id)) {
      return {
        success: false,
        message: "Bike not found or user does not own this bike.",
      };
    }

    await MotorcycleModel.findOneAndUpdate(
      {
        _id: id,
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

export async function addMotorcycle(prevState: any, formData: FormData) {
  try {
    await dbConnect();
    const session = await auth();
    const userEmail = session?.user?.email;

    const newMotorcycle = {
      motorcycleName: formData.get("motorcycleName"),
      currentMilage: formData.get("currentMilage"),
      serviceItem: [],
    };

    const newMotorcycleResponse = await MotorcycleModel.create(newMotorcycle);

    await UserModel.findOneAndUpdate(
      {
        email: userEmail,
      },
      {
        $set: {
          [`bikes.${newMotorcycleResponse._id}`]:
            newMotorcycleResponse.motorcycleName,
        },
      },
      { new: true, useFindAndModify: false }
    );

    revalidatePath("/dashboard");

    return { success: true, id: newMotorcycleResponse._id };
  } catch (error) {
    console.error("Error adding service item: ", error);
    return { success: false };
  }
}

export async function deleteServiceItem(formData: FormData) {
  try {
    await dbConnect();
    const session = await auth();
    const email = session?.user?.email;

    const id = formData.get("id");
    const motorcycleId = formData.get("motorcycleId");

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user || !user.bikes.has(motorcycleId)) {
      return {
        success: false,
        message: "Bike not found or user does not own this bike.",
      };
    }

    await MotorcycleModel.findOneAndUpdate(
      {
        _id: motorcycleId,
      },
      { $pull: { serviceItem: { _id: id } } },
      { new: true, useFindAndModify: false }
    );

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error deleting service item: ", error);
  }
}

export async function deleteMotorcycle(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    const email = session?.user?.email;
    const id = formData.get("id");

    await dbConnect();

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user || !user.bikes.has(id)) {
      return {
        success: false,
        message: "Bike not found or user does not own this bike.",
      };
    }

    // Remove bike from user's list
    user.bikes.delete(id);
    await user.save();

    // Delete the bike from the database
    const result = await MotorcycleModel.findByIdAndDelete(id);

    if (!result) {
      // If the bike does not exist or could not be deleted
      return { success: false, message: "Failed to delete bike." };
    }

    revalidatePath("/dashboard");
    // Return success response
    return { success: true, message: "Bike successfully deleted." };
  } catch (error) {
    console.error("Error deleting motorcycle: ", error);
    return { success: false };
  }
}
