"use client";

import { signOut } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      className="text-white underline text-xs font-semibold"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      LOG OUT
    </button>
  );
}
