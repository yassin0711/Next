import Todo from "@/components/Todo";

export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      <Todo
        owner="Saif"
        items={[
        "Répartition par statut et par catégorie (Recharts)",
        "Délai moyen de résolution",
        ]}
      />
    </section>
  );
}
