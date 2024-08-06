import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="w-full px-4 py-12 flex justify-center items-center">
      <Spinner />
    </div>
  );
}
