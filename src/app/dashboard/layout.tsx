import { auth } from "@/auth";
import LoginScreen from "@/component/LoginScreen";
import MotorcycleCard from "@/component/MotorcycleCard";
import dbConnect from "@/lib/dbConnect";
import UserModel, { IUserModel } from "@/model/UserModel";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const userEmail = session?.user?.email;
  if (!session?.user || !userEmail) {
    return <LoginScreen />;
  }

  const userData: IUserModel = await getData(userEmail);

  // For some reason using userData.bikes directly in .map just doesn't work... I'll fix this later at some point bruh...
  const bikes = JSON.parse(JSON.stringify(userData.bikes));

  return (
    <main className="flex items-center flex-col">
      <section className="w-full max-w-5xl">
        <h1 className="text-3xl font-semibold">
          Welcome {session?.user.name}!
        </h1>
        <h2 className="text-xl font-semibold mt-4">My garage:</h2>
        <div className="flex gap-4">
          {Object.entries(bikes).map(([id, text]) => (
            <MotorcycleCard key={id} text={text as string} id={id} />
          ))}
          <MotorcycleCard />
        </div>
      </section>
      {children}
    </main>
  );
}

async function getData(email: string) {
  await dbConnect();
  var result = await UserModel.findOne({ email });

  if (!result) {
    result = await UserModel.create({
      email,
    });
  }

  return result;
}
