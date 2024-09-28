import { useFormStatus } from "react-dom";

export default function SubmitButton({ className }: { className?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      className={`rounded bg-slate-600 hover:bg-slate-700 transition-all py-1 px-2 text-white font-bold ${className}`}
      type="submit"
      disabled={pending}
    >
      Submit
    </button>
  );
}
