import { auth } from "@/auth";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";

export default async function Header() {
  const session = await auth();

  return (
    <header className="w-full flex justify-center p-4">
      <div className="flex justify-between w-full max-w-5xl">
        <nav className="flex gap-4">
          <Link href={"/"}>Home</Link>
          <Link href={"/dashboard"}>Dashboard</Link>
          <Link href={"/#about"}>About</Link>
        </nav>
        <div>
          {session ? (
            <div className="flex gap-2 items-center">
              <p>{session?.user?.name}</p>
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
