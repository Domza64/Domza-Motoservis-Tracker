"use client";

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
import { deleteMotorcycle, deleteServiceItem } from "@/app/Actions";

interface Props {
  title: string;
  motorcycleId: string;
  serviceItemId?: string;
}

export default function DeleteModal({
  title,
  motorcycleId,
  serviceItemId,
}: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <button
        onClick={onOpen}
        className="text-motoservis_red hover:text-motoservis_red_dark transition-all"
      >
        {serviceItemId ? "Delete Service Item" : "Delete Motorcycle"}
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
                  Are you sure you want to delete the <b>{title}</b>?
                  <br />
                  <span className="text-gray-500">
                    This will permenantly delete all of the data associated with{" "}
                    {title} and it cannot be reversed.
                  </span>
                </p>
              </ModalBody>
              <ModalFooter>
                <form
                  action={serviceItemId ? deleteServiceItem : deleteMotorcycle}
                >
                  <input
                    type="hidden"
                    name="motorcycleId"
                    value={motorcycleId}
                  />
                  <input
                    type="hidden"
                    name="serviceItemId"
                    value={serviceItemId}
                  />
                  <Button
                    onPress={onClose}
                    className="bg-motoservis_red text-white"
                    type="submit"
                  >
                    Delete
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
