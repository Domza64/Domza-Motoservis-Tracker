import Link from "next/link";
import UserDropdown from "./UserDropdown";
import {
  getKindeServerSession,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Header() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = await getUser();

  return (
    <header className="w-full flex justify-center p-4 bg-black text-white">
      <div className="flex justify-between w-full max-w-5xl">
        <nav className="flex gap-6 items-center font-semibold uppercase underline decoration-motoservis_red decoration-2">
          <Link href={"/"}>Home</Link>
          <Link href={"/dashboard"}>My Garage</Link>
          <Link href={"/#about"}>About</Link>
        </nav>
        <div>
          {isUserAuthenticated ? (
            <UserDropdown
              img={user.picture as string}
              username={user?.username as string}
            />
          ) : (
            <>
              <LoginLink>Sign in</LoginLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
