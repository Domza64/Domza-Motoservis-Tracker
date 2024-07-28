import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex flex-col items-center">
      <section className="my-56">
        <h1 className="text-4xl">Domza Motoservis Tracker</h1>
        <Link href="/dashboard" className="underline">
          Go to Service Dashboard
        </Link>
      </section>
      <section id="about">
        <h2 className="text-2xl">About</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam
          assumenda accusantium eos libero earum eaque molestias voluptatibus
          nihil in minima explicabo ipsum natus aut enim velit architecto,
          eveniet reprehenderit dolore!
        </p>
      </section>
    </main>
  );
}
