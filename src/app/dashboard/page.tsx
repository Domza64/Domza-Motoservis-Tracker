import { auth } from "@/auth";
import LoginScreen from "@/component/LoginScreen";
import MilageDisplay from "@/component/MilageDisplay";
import ServiceItemCard from "@/component/ServiceItemCard";
import dbConnect from "@/lib/dbConnect";
import UserModel, { ServiceItem } from "@/model/UserModel";
import Link from "next/link";

export default async function Dashboard() {
  const session = await auth();

  const userEmail = session?.user?.email;
  if (!session?.user || !userEmail) {
    return <LoginScreen />;
  }

  const userData = await getData(userEmail);

  return (
    <main className="flex flex-col items-center mb-12">
      <section className="my-56">
        <h1 className="text-4xl">Domza Motoservis Tracker</h1>
        <p>Welcome {session?.user.name}!</p>
        <div className="flex items-center gap-2">
          <MilageDisplay initialMilage={userData.currentMilage} />
        </div>
      </section>
      <section className="w-full max-w-5xl">
        <form className="flex gap-1 flex-col mb-4">
          <label className="text-lg">My bikes:</label>
          <select>
            <option>Yamaha WR 125 X</option>
            <option>KTM EXC 250</option>
            <option>Add new bike</option>
          </select>
        </form>
        <h2 className="text-2xl">Service Items:</h2>
        <div className="flex flex-col gap-2">
          {userData.serviceItem.map((serviceItem: ServiceItem) => (
            <ServiceItemCard
              key={serviceItem.title}
              serviceItem={serviceItem}
              currentMotorcycleMilage={userData.currentMilage}
            />
          ))}
        </div>
        <Link href="/dashboard/add" className="underline">
          Add new item
        </Link>
      </section>
    </main>
  );
}

async function getData(email: string) {
  await dbConnect();
  var result = await UserModel.findOne({ email });

  if (!result) {
    result = await UserModel.create({
      email,
      serviceItem: [],
      currentMilage: 0,
    });
  }

  return result;
}
