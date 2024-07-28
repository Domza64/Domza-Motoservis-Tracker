"use client";
import { signIn, useSession } from "next-auth/react";
import LoginButton from "./LoginButton";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginScreen() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/dashboard");
    } else {
      signIn("google");
    }
  }, [session]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section>
        <h1 className="text-4xl">Domza Motoservis</h1>
        <LoginButton />
      </section>
    </main>
  );
}
