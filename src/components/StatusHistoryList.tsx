import { STATUS_LABELS, type Status } from "@/lib/constants";

type HistoryItem = {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  note: string | null;
  createdAt: Date;
  author: { name: string };
};

// Historique des changements de statut
export default function StatusHistoryList({ history }: { history: HistoryItem[] }) {
  return (
    <div className="rounded bg-white p-4 shadow">
      <h2 className="mb-2 font-semibold">Historique</h2>
      {history.length === 0 && <p className="text-sm text-gray-500">Aucun changement de statut.</p>}
      <ul className="space-y-2 text-sm">
        {history.map((h) => (
          <li key={h.id} className="border-l-2 border-teal-700 pl-3">
            <p>
              {h.fromStatus ? STATUS_LABELS[h.fromStatus as Status] : "—"} → {STATUS_LABELS[h.toStatus as Status]}
            </p>
            <p className="text-gray-500">
              {h.author.name}, le {h.createdAt.toLocaleString("fr-FR")}
            </p>
            {h.note && <p className="italic">{h.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
