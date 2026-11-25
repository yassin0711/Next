// États réutilisables : chargement, erreur, liste vide

export function Loading({ label = "Chargement..." }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 p-8 text-gray-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-teal-700" />
      {label}
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{message}</p>;
}

export function EmptyState({ message }: { message: string }) {
  return <p className="rounded-xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-500">{message}</p>;
}
