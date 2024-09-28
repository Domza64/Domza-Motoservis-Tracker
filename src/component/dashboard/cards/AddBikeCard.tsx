import Link from "next/link";
import GarageCard from "./GarageCard";

export default async function AddBikeCard() {
  return (
    <GarageCard>
      <Link
        className="w-full h-full flex justify-center items-center"
        href={"/dashboard/addBike"}
      >
        +
      </Link>
    </GarageCard>
  );
}
