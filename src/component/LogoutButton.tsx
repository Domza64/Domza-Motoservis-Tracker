"use client";

import { signOut } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      className="rounded bg-slate-300 text-black py-1 px-2"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign Out
    </button>
  );
}
