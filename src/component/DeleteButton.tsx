import { useFormStatus } from "react-dom";

export default function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded bg-slate-600 py-1 px-2 text-white font-bold"
      type="submit"
      disabled={pending}
    >
      Delete
    </button>
  );
}
