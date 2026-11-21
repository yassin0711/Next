import Todo from "@/components/Todo";

export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Nouveau signalement</h1>
      <Todo
        owner="Rayen"
        items={[
        "Formulaire titre, description, catégorie, lieu, photo facultative",
        "Validation client avec reportSchema + POST /api/reports",
        ]}
      />
    </section>
  );
}
