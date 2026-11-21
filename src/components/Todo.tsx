// Bloc temporaire indiquant qui doit réaliser une page (à supprimer une fois la page faite)
export default function Todo({ owner, items }: { owner: string; items: string[] }) {
  return (
    <div className="rounded border border-dashed border-amber-400 bg-amber-50 p-4 text-sm">
      <p className="font-semibold">À faire, responsable : {owner}</p>
      <ul className="ml-5 list-disc">{items.map((i) => <li key={i}>{i}</li>)}</ul>
    </div>
  );
}
