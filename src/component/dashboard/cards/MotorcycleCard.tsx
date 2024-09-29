"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import GarageCard from "./GarageCard";

interface Props {
  text?: string;
  id?: string;
}

export default function MotorcycleCard({ text, id }: Props) {
  const url = `/dashboard/${id}`;
  const path = usePathname();

  const selectedId = path.slice(path.lastIndexOf("/") + 1);

  return (
    <GarageCard>
      <Link
        href={url}
        className={`${
          selectedId == id ? "border-motoservis_red border-2 " : ""
        } w-full h-full flex justify-center items-center text-center bg-[url('/image/custom_image.jpega')] bg-cover bg-center rounded-md font-bold`}
      >
        {text}
      </Link>
    </GarageCard>
  );
}
