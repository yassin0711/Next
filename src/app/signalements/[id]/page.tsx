import Todo from "@/components/Todo";

export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Détail du signalement</h1>
      <Todo
        owner="Rayen (page) + Wiem (statut, historique) + Saif (soutien, commentaires)"
        items={[
        "Rayen : affichage des infos du signalement",
        "Wiem : bouton changer le statut + historique",
        "Saif : bouton Soutenir + commentaires",
        ]}
      />
    </section>
  );
}
