import { auth } from "@/auth";
import LoginScreen from "@/component/LoginScreen";
import MilageDisplay from "@/component/MilageDisplay";
import dbConnect from "@/lib/dbConnect";
import UserModel, { ServiceItem } from "@/model/UserModel";

export default async function Dashboard() {
  const session = await auth();

  const userEmail = session?.user?.email;
  if (!session?.user || !userEmail) {
    return <LoginScreen />;
  }

  const userData = await getData(userEmail);

  return (
    <main className="flex flex-col items-center">
      <section className="my-56">
        <h1 className="text-4xl">Domza Motoservis Tracker</h1>
        <p>Welcome {session?.user.name}!</p>
        <div className="flex items-center gap-2">
          <MilageDisplay initialMilage={userData.currentMilage} />
        </div>
      </section>
      <section>
        <h2 className="text-2xl">Service Items:</h2>
        {userData.serviceItem.map((serviceItem: ServiceItem) => (
          <div>
            <p>Title: {serviceItem.title}</p>
            <p>Service interval: {serviceItem.lastService}</p>
          </div>
        ))}
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
