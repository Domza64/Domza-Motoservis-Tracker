"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import Image from "next/image";
import DeleteMotorcycleButton from "./DeleteMotorcycleButton";

export default function MotorMenu({ id }: { id: string }) {
  const items = [
    {
      key: "random",
      label: "Something random",
    },
    {
      key: "delete",
      label: "test",
    },
  ];

  return (
    <Dropdown>
      <DropdownTrigger>
        <Image
          src={"/more-horiz.svg"}
          alt={"More icon"}
          height={32}
          width={32}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions" items={items}>
        {(item) => (
          <DropdownItem
            key={item.key}
            color={item.key === "delete" ? "danger" : "default"}
            className={item.key === "delete" ? "text-danger" : ""}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
