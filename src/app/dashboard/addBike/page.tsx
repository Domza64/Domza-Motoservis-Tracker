import dbConnect from "@/lib/dbConnect";
import TrackedServicesModel from "@/model/TrackedServicesModel";
import UserModel from "@/model/UserModel";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { put } from "@vercel/blob";
import { redirect } from "next/navigation";

export default async function AddBike() {
  async function addMotorcycle(formData: FormData) {
    "use server";

    await dbConnect();

    // Get the authenticated user's email
    const { getUser } = getKindeServerSession();
    const authenticatedUser = await getUser();
    const authId = authenticatedUser.id;

    // Get form data
    const motorcycleName = formData.get("motorcycleName") as string;
    const currentMilage: number = parseInt(
      formData.get("currentMilage") as string,
      10
    );

    // Handle the image upload
    const imageFile = formData.get("image") as File;
    let imageUrl = "";

    if (imageFile) {
      const { url } = await put(`motorcycles/${imageFile.name}`, imageFile, {
        access: "public",
      });
      imageUrl = url; // Save the returned URL of the uploaded image
    }

    // Create the new motorcycle object first
    const newMotorcycle = {
      motorcycleName,
      imageUrl,
    };

    // Save the motorcycle to the database and get its ID
    const userModel = await UserModel.findOneAndUpdate(
      { authId: authId },
      {
        $push: { bikes: newMotorcycle },
      },
      { new: true, useFindAndModify: false }
    );

    const motorcycleId = userModel.bikes[userModel.bikes.length - 1]._id;

    // Create a new tracked services entry with the motorcycleId
    await TrackedServicesModel.create({
      _id: motorcycleId,
      milage: [{ milage: currentMilage, date: new Date() }],
      ownerId: authId,
      motorcycleName: motorcycleName,
    });

    // Redirect to the motorcycle's dashboard page
    redirect(`/dashboard/${motorcycleId}`);
  }

  return (
    <div className="flex flex-col items-center w-full mb-24 p-4">
      <h3 className="text-xl font-bold mb-4">Add new Motorcycle</h3>
      <form
        action={addMotorcycle}
        className="flex gap-3 flex-col bg-slate-200 shadow-md max-w-lg p-4 rounded w-full"
      >
        <input
          name="motorcycleName"
          type="text"
          placeholder="Motorcycle model"
        />
        <input
          name="currentMilage"
          type="number"
          placeholder="Current Milage"
          defaultValue="0"
          min={0}
        />
        <input type="file" name="image" accept="image/*" />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
