import Todo from "@/components/Todo";
import AssignForm from "@/components/AssignForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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
      <AssignForm reportId={id} />
    </section>
  );
}
