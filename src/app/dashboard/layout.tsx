import AddBikeCard from "@/component/dashboard/cards/AddBikeCard";
import MotorcycleCard from "@/component/dashboard/cards/MotorcycleCard";
import dbConnect from "@/lib/dbConnect";
import UserModel, { IUserModel, MotorcycleModel } from "@/model/UserModel";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userData: IUserModel = await getData(user.id);

  return (
    <main className="flex justify-between items-center flex-col flex-1">
      <section className="w-full max-w-5xl my-16 p-4">
        <h1 className="text-3xl font-semibold">Welcome {user.username}</h1>
        <h2 className="text-xl font-semibold mt-4">My garage:</h2>
        <div className="flex gap-4 flex-wrap">
          {userData.bikes.map((motorcycle: MotorcycleModel) => (
            <MotorcycleCard
              key={motorcycle._id as string}
              text={motorcycle.motorcycleName}
              id={motorcycle.id}
            />
          ))}
          <AddBikeCard />
        </div>
      </section>
      {children}
    </main>
  );
}

async function getData(authId: string) {
  await dbConnect();
  var result = await UserModel.findOne({ authId });

  if (!result) {
    result = await UserModel.create({
      authId,
    });
  }

  return result;
}
