import Todo from "@/components/Todo";

export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Signalements</h1>
      <Todo
        owner="Rayen"
        items={[
        "Liste des signalements (titre, catégorie, lieu, statut, nb de soutiens)",
        "Recherche par mot-clé + filtres catégorie, lieu, statut",
        "États chargement / erreur / liste vide",
        ]}
      />
    </section>
  );
}
