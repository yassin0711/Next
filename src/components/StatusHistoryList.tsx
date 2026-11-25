import { STATUS_LABELS, type Status } from "@/lib/constants";

type HistoryItem = {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  note: string | null;
  createdAt: Date;
  author: { name: string };
};

// Texte principal d'une ligne d'historique
function describe(h: HistoryItem) {
  if (!h.fromStatus) return "Signalement créé"; // création
  if (h.fromStatus === h.toStatus) return "Attribution"; // statut inchangé : attribution
  return `${STATUS_LABELS[h.fromStatus as Status]} → ${STATUS_LABELS[h.toStatus as Status]}`;
}

// Historique des changements : création, attribution et statuts
export default function StatusHistoryList({ history }: { history: HistoryItem[] }) {
  return (
    <div className="card">
      <h2 className="mb-2 font-semibold">Historique</h2>
      {history.length === 0 && <p className="text-sm text-gray-500">Aucun changement.</p>}
      <ul className="space-y-2 text-sm">
        {history.map((h) => (
          <li key={h.id} className="border-l-2 border-teal-700 pl-3">
            <p>{describe(h)}</p>
            <p className="text-xs text-gray-500">
              {h.author.name}, le {h.createdAt.toLocaleString("fr-FR")}
            </p>
            {h.note && <p className="italic">{h.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
