"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  text?: string;
  id?: string;
}

export default function MotorcycleCard({ text, id }: Props) {
  const url = id ? `/dashboard/${id}` : "/dashboard/addBike";
  const path = usePathname();

  const selectedId = path.slice(path.lastIndexOf("/") + 1);

  return (
    <Link
      href={url}
      className={`select-none cursor-pointer h-24 w-24 hover:bg-slate-200 border-2 transition-all p-4 shadow-md bg-${
        text ? "slate-100" : "slate-300"
      } ${
        selectedId == id ? "border-motoservis_red" : ""
      } text-center flex justify-center items-center rounded uppercase font-semibold text-slate-800 leading-5`}
    >
      {text ? <span>{text}</span> : <span>Add new</span>}
    </Link>
  );
}
