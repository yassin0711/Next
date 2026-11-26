import { STATUS_LABELS, type Status } from "@/lib/constants";

const CONFIG: Record<Status, { bg: string; dot: string; pulse?: boolean }> = {
  NOUVEAU: {
    bg: "bg-slate-100 text-slate-700 ring-slate-200/80",
    dot: "bg-slate-500",
  },
  PRIS_EN_CHARGE: {
    bg: "bg-blue-50 text-blue-700 ring-blue-200/80",
    dot: "bg-blue-500",
  },
  EN_COURS: {
    bg: "bg-amber-50 text-amber-800 ring-amber-200/80",
    dot: "bg-amber-500",
    pulse: true,
  },
  RESOLU: {
    bg: "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
    dot: "bg-emerald-500",
  },
};

export default function StatusBadge({ status }: { status: Status }) {
  const conf = CONFIG[status] ?? CONFIG.NOUVEAU;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 shadow-2xs ${conf.bg}`}>
      <span className="relative flex h-2 w-2">
        {conf.pulse && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${conf.dot}`} />
      </span>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
