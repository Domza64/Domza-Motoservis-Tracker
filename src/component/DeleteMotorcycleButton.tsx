"use client";

import { useEffect } from "react";
import DeleteButton from "./DeleteButton";
import { useFormState } from "react-dom";
import { deleteMotorcycle } from "@/app/Actions";
import { redirect } from "next/navigation";

interface Props {
  id: string;
}

export default function DeleteMotorcycleButton({ id }: Props) {
  const [state, formAction] = useFormState(deleteMotorcycle, undefined);

  useEffect(() => {
    if (state?.success) {
      redirect("/dashboard");
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" value={id} name="id" id={id} />
      <DeleteButton />
    </form>
  );
}
