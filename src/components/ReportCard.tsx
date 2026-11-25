import Link from "next/link";
import type { Status } from "@/lib/constants";
import StatusBadge from "@/components/StatusBadge";

type Props = {
  id: string;
  title: string;
  category: string;
  location: string;
  status: Status;
  supports?: number;
};

// Carte cliquable d'un signalement (utilisée dans les listes)
export default function ReportCard({ id, title, category, location, status, supports }: Props) {
  return (
    <Link href={`/signalements/${id}`} className="card block transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <StatusBadge status={status} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <span className="rounded-md bg-teal-50 px-2 py-0.5 text-teal-800">{category}</span>
        <span>📍 {location}</span>
        {supports !== undefined && <span className="ml-auto">👍 {supports}</span>}
      </div>
    </Link>
  );
}
