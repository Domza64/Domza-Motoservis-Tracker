"use client";

import { deleteMotorcycle } from "@/app/Actions";
import { useRouter } from "next/navigation";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";

interface Props {
  id: string;
  title: string;
}

export default function DeleteMotorcycleButton({ id, title }: Props) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <button
        onClick={onOpen}
        className="text-motoservis_red hover:text-motoservis_red_dark transition-all"
      >
        Delete Motorcycle
      </button>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-1">
                <span className="text-motoservis_red">Delete</span>
                {" " + title}
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete the <b>{title}</b> motorcycle?
                  <br />
                  <span className="text-gray-500">
                    This will remove all of your service data and it cannot be
                    reversed.
                  </span>
                </p>
              </ModalBody>
              <ModalFooter>
                <form
                  action={async (formData) => {
                    await deleteMotorcycle(formData);
                    router.push("/dashboard");
                  }}
                >
                  <input type="hidden" value={id} name="id" id={id} />
                  <Button type="submit" color="danger" variant="light">
                    Deletea
                  </Button>
                </form>
                <Button className="bg-slate-400 text-white" onPress={onClose}>
                  Canel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
