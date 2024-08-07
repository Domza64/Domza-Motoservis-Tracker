"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import LogoutButton from "./LogoutButton";

export default function UserDropdown({
  img,
  username,
}: {
  img: string;
  username: string;
}) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <div className="flex gap-3 items-center hover:cursor-pointer">
          <span className="hidden sm:block select-none">{username}</span>
          <img
            className="rounded-full border-motoservis_red border-2 p-0.5"
            src={img}
            width={45}
            height={45}
            alt={"User profile image"}
          />
        </div>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="logout">
          <LogoutButton />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
