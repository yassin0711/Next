import Todo from "@/components/Todo";

export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Mes affectations</h1>
      <Todo
        owner="Wiem"
        items={[
        "Liste des signalements assignés au responsable connecté",
        ]}
      />
    </section>
  );
}
