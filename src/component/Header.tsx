import { auth } from "@/auth";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import { Avatar } from "@nextui-org/react";
import Image from "next/image";
import UserDropdown from "./UserDropdown";

export default async function Header() {
  const session = await auth();

  return (
    <header className="w-full flex justify-center p-4 bg-black text-white">
      <div className="flex justify-between w-full max-w-5xl">
        <nav className="flex gap-6 items-center font-semibold uppercase underline decoration-motoservis_red decoration-2">
          <Link href={"/"}>Home</Link>
          <Link href={"/dashboard"}>My Garage</Link>
          <Link href={"/#about"}>About</Link>
        </nav>
        <div>
          {session ? (
            <UserDropdown
              img={session?.user?.image as string}
              username={session?.user?.name as string}
            />
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}
