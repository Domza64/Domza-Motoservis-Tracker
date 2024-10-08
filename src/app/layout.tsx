import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import "./globals.css";
import Header from "@/component/header/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Domza Motoservis Tracker",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextUIProvider className="min-h-screen flex flex-col justify-between">
          <Header />
          {children}
          {/*<Footer /> - No need for footer currently, might be added later */}
        </NextUIProvider>
      </body>
    </html>
  );
}
