import { STATUS_LABELS, type Status } from "@/lib/constants";

const COLORS: Record<Status, string> = {
  NOUVEAU: "bg-gray-100 text-gray-700 ring-gray-300",
  PRIS_EN_CHARGE: "bg-blue-50 text-blue-700 ring-blue-200",
  EN_COURS: "bg-amber-50 text-amber-700 ring-amber-200",
  RESOLU: "bg-green-50 text-green-700 ring-green-200",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${COLORS[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}
