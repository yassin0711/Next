import Link from "next/link";
import type { Status } from "@/lib/constants";
import StatusBadge from "@/components/StatusBadge";
import { IconPin, IconThumbUp, IconArrowRight } from "@/components/Icons";

type Props = {
  id: string;
  title: string;
  category: string;
  location: string;
  status: Status;
  supports?: number;
};

// Carte cliquable d'un signalement moderne et sobre
export default function ReportCard({ id, title, category, location, status, supports }: Props) {
  return (
    <Link
      href={`/signalements/${id}`}
      className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-sm"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900 transition group-hover:text-teal-800 line-clamp-2">
            {title}
          </h2>
          <div className="shrink-0">
            <StatusBadge status={status} />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <IconPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="line-clamp-1">{location}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <span className="rounded-md bg-slate-50 px-2 py-0.5 font-medium text-slate-700 border border-slate-200/70">
          {category}
        </span>

        <div className="flex items-center gap-2">
          {supports !== undefined && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 font-medium text-slate-600 border border-slate-200/70">
              <IconThumbUp className="h-3 w-3 text-teal-700" />
              <span>{supports}</span>
            </span>
          )}

          <IconArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition" />
        </div>
      </div>
    </Link>
  );
}
