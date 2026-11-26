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

// Carte cliquable d'un signalement moderne et interactive
export default function ReportCard({ id, title, category, location, status, supports }: Props) {
  return (
    <Link
      href={`/signalements/${id}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-900/5"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900 transition-colors group-hover:text-teal-800 line-clamp-2">
            {title}
          </h2>
          <div className="shrink-0">
            <StatusBadge status={status} />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="line-clamp-1">{location}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <span className="rounded-lg bg-teal-50/80 px-2.5 py-1 font-semibold text-teal-800 border border-teal-100">
          {category}
        </span>

        <div className="flex items-center gap-2">
          {supports !== undefined && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 font-semibold text-slate-600 border border-slate-200/80 group-hover:border-teal-200 group-hover:bg-teal-50/50 group-hover:text-teal-800 transition">
              <svg className="h-3.5 w-3.5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              <span>{supports}</span>
            </span>
          )}

          <span className="text-slate-300 group-hover:text-teal-600 transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
