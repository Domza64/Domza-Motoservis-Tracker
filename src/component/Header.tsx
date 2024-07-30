import { auth } from "@/auth";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";

export default async function Header() {
  const session = await auth();

  return (
    <header className="w-full flex justify-center p-4 bg-black text-white">
      <div className="flex justify-between w-full max-w-5xl">
        <nav className="flex gap-6 items-center font-semibold uppercase underline decoration-indigo-400 decoration-2">
          <Link href={"/"}>Home</Link>
          <Link href={"/dashboard"}>My Garage</Link>
          <Link href={"/#about"}>About</Link>
        </nav>
        <div>
          {session ? (
            <div className="flex gap-2 items-center">
              <p className="font-semibold">{session?.user?.name}</p>
              <LogoutButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}
