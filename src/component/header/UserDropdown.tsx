"use client";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

export default function UserDropdown({
  img,
  username,
}: {
  img: string;
  username: string;
}) {
  return <LogoutLink>Log out</LogoutLink>;
}
