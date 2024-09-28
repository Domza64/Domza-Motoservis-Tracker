"use client";

import { ReactNode } from "react";

export default function GarageCard({ children }: { children: ReactNode }) {
  return (
    <div
      className={`select-none cursor-pointer h-24 w-24 hover:bg-slate-200 border-2 transition-all shadow-md rounded uppercase font-semibold text-slate-800 leading-5`}
    >
      {children}
    </div>
  );
}
