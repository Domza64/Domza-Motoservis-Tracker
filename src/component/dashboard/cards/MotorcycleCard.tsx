"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import GarageCard from "./GarageCard";

interface Props {
  text?: string;
  id?: string;
  image?: string;
}

export default function MotorcycleCard({ text, id, image }: Props) {
  const url = `/dashboard/${id}`;
  const path = usePathname();

  const selectedId = path.slice(path.lastIndexOf("/") + 1);

  return (
    <GarageCard>
      <div className="w-full h-full relative rounded-md overflow-hidden">
        <Link
          href={url}
          className={`${
            selectedId == id ? "border-motoservis_red border-2 " : ""
          } w-full h-full flex justify-center items-center text-center font-bold z-10 absolute text-white hover:text-gray-200 transition-all`}
        >
          {text}
        </Link>
        <img
          src={image}
          alt="Image of motorcycle"
          className="w-full h-auto object-cover" // Adjust opacity to darken the image
        />
        <div className="absolute inset-0 bg-black opacity-30"></div>{" "}
      </div>
    </GarageCard>
  );
}
