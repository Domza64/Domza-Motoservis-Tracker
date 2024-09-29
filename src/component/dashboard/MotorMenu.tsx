"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import Image from "next/image";
import DeleteModal from "../deleteModal/DeleteModal";

export default function MotorMenu({
  id,
  motorcycleName,
}: {
  id: string;
  motorcycleName: string;
}) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Image
          src={"/icon/more-horiz.svg"}
          alt={"More icon"}
          height={32}
          width={32}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions">
        <DropdownItem>
          <DeleteModal title={motorcycleName} motorcycleId={id} />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
