import { useFormStatus } from "react-dom";

export default function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="bg-red-400 text-white rounded py-1 px-3 font-bold hover:bg-red-500 disabled:bg-blue-500"
      type="submit"
      disabled={pending}
    >
      Delete
    </button>
  );
}
