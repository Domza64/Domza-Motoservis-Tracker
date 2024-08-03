import Link from "next/link";

interface Props {
  text?: string;
  id?: string;
}

export default function MotorcycleCard({ text, id }: Props) {
  const url = id ? `/dashboard/${id}` : "/dashboard/addBike";

  return (
    <Link
      href={url}
      className="w-32 select-none cursor-pointer h-32 hover:bg-slate-200 transition-all p-4 shadow-md bg-slate-100 text-center flex justify-center items-center uppercase font-semibold text-slate-800 leading-5"
    >
      {text ? <span>{text}</span> : <span>Add new</span>}
    </Link>
  );
}
