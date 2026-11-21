import { STATUS_LABELS, type Status } from "@/lib/constants";

const COLORS: Record<Status, string> = {
  NOUVEAU: "bg-gray-200 text-gray-800",
  PRIS_EN_CHARGE: "bg-blue-100 text-blue-800",
  EN_COURS: "bg-amber-100 text-amber-800",
  RESOLU: "bg-green-100 text-green-800",
};

export default function StatusBadge({ status }: { status: Status }) {
  return <span className={`rounded px-2 py-0.5 text-xs font-medium ${COLORS[status]}`}>{STATUS_LABELS[status]}</span>;
}
