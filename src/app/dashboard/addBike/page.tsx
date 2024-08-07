import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import MotorcycleModel from "@/model/MotorcycleModel";
import UserModel from "@/model/UserModel";
import { Input } from "@nextui-org/react";
import { redirect } from "next/navigation";

export default async function AddBike() {
  async function addMotorcycle(formData: FormData) {
    "use server";

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

    redirect(`/dashboard/${newMotorcycleResponse._id}`);
  }

  return (
    <div className="flex flex-col items-center w-full mb-24 p-4">
      <h3 className="text-xl font-bold mb-4">Add new Motorcycle</h3>
      <form
        action={addMotorcycle}
        className="flex gap-3 flex-col bg-slate-200 shadow-md max-w-lg p-4 rounded w-full"
      >
        <Input
          name="motorcycleName"
          type="text"
          label="Motorcycle"
          placeholder="Motorcycle model"
          labelPlacement="outside"
        />
        <Input
          name="currentMilage"
          type="number"
          label="Current Milage"
          placeholder="0.00"
          labelPlacement="outside"
          defaultValue="0"
          min={0}
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">km</span>
            </div>
          }
        />
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
