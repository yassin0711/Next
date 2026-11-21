// États réutilisables : chargement, erreur, liste vide

export function Loading({ label = "Chargement..." }: { label?: string }) {
  return <p role="status" className="p-6 text-center text-gray-500">{label}</p>;
}

export function ErrorMessage({ message }: { message: string }) {
  return <p role="alert" className="rounded border border-red-300 bg-red-50 p-4 text-red-700">{message}</p>;
}

export function EmptyState({ message }: { message: string }) {
  return <p className="rounded border border-dashed p-8 text-center text-gray-500">{message}</p>;
}
