import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  return (
    <main className="flex flex-col items-center bg-gradient-to-tl from-slate-900 to-black text-white min-h-screen">
      <section className="mt-12 sm:mt-32 w-full flex flex-col items-center">
        <div className="flex flex-col lg:flex-row items-center w-full gap-16 sm:gap-48 max-w-6xl p-4">
          <Image width={420} height={420} alt="Logo" src="/motoservis.svg" />
          <div className="w-full flex flex-col items-start sm:mt-12">
            <h1 className="text-5xl font-bold">
              Never Miss a Bike Check{" "}
              <span className="text-motoservis_red underline">again</span>!
            </h1>
            <h2 className="mt-6 text-xl font-semibold">
              Track your services and get reminded when to:
            </h2>
            <ul className="ml-6 flex flex-col list-disc">
              <li>Change oil</li>
              <li>Check tire pressure</li>
              <li>Do service</li>
              <li>And much much more...</li>
            </ul>
            <Link
              href={"/dashboard"}
              className=" mt-5 underline decoration-indigo-400 underline-offset-6 decoration-2 font-bold text-lg"
            >
              Check my garage
            </Link>
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-100 to-gray-400 w-full flex items-center justify-center px-4 py-8 mt-24">
          <Link
            href="/dashboard"
            className="bg-black text-white px-10 py-5 rounded-lg font-bold text-3xl shadow-lg shadow-slate-900 hover:scale-105 hover:bg-slate-900 transition-all"
          >
            Check my garage
          </Link>
        </div>
      </section>
      <section
        id="about"
        className="bg-black w-full flex justify-center py-24 px-4"
      >
        <div className="max-w-5xl w-full">
          <h2 className="text-4xl font-semibold">About</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam
            assumenda accusantium eos libero earum eaque molestias voluptatibus
            nihil in minima explicabo ipsum natus aut enim velit architecto,
            eveniet reprehenderit dolore!
          </p>
        </div>
      </section>
    </main>
  );
}
