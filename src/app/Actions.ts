"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { revalidatePath } from "next/cache";

export async function setMilage(formData: FormData) {
  await dbConnect();
  const session = await auth();

  const userEmail = session?.user?.email;
  console.log(userEmail);

  const result = await UserModel.findOneAndUpdate(
    {
      email: userEmail,
    },
    {
      currentMilage: Number(formData.get("milage")),
    }
  );

  revalidatePath("/dashboard");
}
