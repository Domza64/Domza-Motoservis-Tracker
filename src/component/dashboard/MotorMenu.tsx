"use client";

import Image from "next/image";
import DeleteModal from "../deleteModal/DeleteModal";

export default function MotorMenu({
  id,
  motorcycleName,
}: {
  id: string;
  motorcycleName: string;
}) {
  return <DeleteModal title={motorcycleName} motorcycleId={id} />;
}
