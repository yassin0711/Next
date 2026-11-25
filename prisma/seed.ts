import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Date d'il y a n jours (pour avoir des dates variées)
function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

async function main() {
  // 1. Comptes de démonstration
  const password = await bcrypt.hash("demo1234", 10);
  const accounts = [
    { name: "Admin", email: "admin@demo.tn", role: "ADMIN" },
    { name: "Responsable", email: "responsable@demo.tn", role: "RESPONSABLE" },
    { name: "Utilisateur 1", email: "user@demo.tn", role: "USER" },
  ];
  for (const a of accounts) {
    await prisma.user.upsert({ where: { email: a.email }, update: { name: a.name }, create: { ...a, password } });
  }
  console.log("Comptes de démonstration créés (mot de passe : demo1234)");

  // 2. Signalements de démonstration (seulement si la base n'en contient pas encore)
  if ((await prisma.report.count()) > 0) {
    console.log("Des signalements existent déjà : rien n'est ajouté");
    return;
  }

  const admin = await prisma.user.findUniqueOrThrow({ where: { email: "admin@demo.tn" } });
  const resp = await prisma.user.findUniqueOrThrow({ where: { email: "responsable@demo.tn" } });
  const user = await prisma.user.findUniqueOrThrow({ where: { email: "user@demo.tn" } });

  // Nouveau, non assigné
  await prisma.report.create({
    data: {
      title: "Lampe cassée dans le couloir du bâtiment B",
      description: "La lampe au fond du couloir clignote puis s'éteint. Le couloir est très sombre le soir.",
      category: "Éclairage",
      location: "Bâtiment B, 1er étage",
      createdAt: daysAgo(1),
      authorId: user.id,
      supports: { create: [{ userId: admin.id }] },
    },
  });

  // Nouveau, non assigné
  await prisma.report.create({
    data: {
      title: "Poubelles pleines près de la cafétéria",
      description: "Les poubelles devant la cafétéria débordent depuis deux jours.",
      category: "Propreté",
      location: "Cafétéria",
      createdAt: daysAgo(2),
      authorId: user.id,
    },
  });

  // Pris en charge, assigné au responsable
  await prisma.report.create({
    data: {
      title: "Vidéoprojecteur en panne salle B12",
      description: "Le vidéoprojecteur ne s'allume plus. Impossible de faire les présentations.",
      category: "Matériel défectueux",
      location: "Bâtiment B, salle 12",
      status: "PRIS_EN_CHARGE",
      createdAt: daysAgo(4),
      authorId: user.id,
      assigneeId: resp.id,
      supports: { create: [{ userId: admin.id }, { userId: resp.id }] },
      history: {
        create: [{ fromStatus: "NOUVEAU", toStatus: "PRIS_EN_CHARGE", authorId: resp.id, createdAt: daysAgo(3) }],
      },
      comments: {
        create: [{ content: "Même problème la semaine dernière.", authorId: admin.id, createdAt: daysAgo(3) }],
      },
    },
  });

  // En cours, assigné au responsable
  await prisma.report.create({
    data: {
      title: "Rampe d'accès bloquée à l'entrée principale",
      description: "Des vélos sont garés devant la rampe, les fauteuils roulants ne peuvent pas passer.",
      category: "Accessibilité",
      location: "Entrée principale",
      status: "EN_COURS",
      createdAt: daysAgo(6),
      authorId: user.id,
      assigneeId: resp.id,
      supports: { create: [{ userId: admin.id }, { userId: resp.id }] },
      history: {
        create: [
          { fromStatus: "NOUVEAU", toStatus: "PRIS_EN_CHARGE", authorId: resp.id, createdAt: daysAgo(5) },
          { fromStatus: "PRIS_EN_CHARGE", toStatus: "EN_COURS", note: "Panneau d'interdiction commandé.", authorId: resp.id, createdAt: daysAgo(4) },
        ],
      },
    },
  });

  // Résolu en 3 jours
  await prisma.report.create({
    data: {
      title: "PC de la bibliothèque qui ne démarre pas",
      description: "Le troisième poste à gauche reste bloqué sur l'écran noir.",
      category: "Équipement informatique",
      location: "Bibliothèque",
      status: "RESOLU",
      resolution: "Disque dur remplacé et système réinstallé.",
      createdAt: daysAgo(10),
      resolvedAt: daysAgo(7),
      authorId: user.id,
      assigneeId: resp.id,
      supports: { create: [{ userId: admin.id }] },
      history: {
        create: [
          { fromStatus: "NOUVEAU", toStatus: "PRIS_EN_CHARGE", authorId: resp.id, createdAt: daysAgo(9) },
          { fromStatus: "PRIS_EN_CHARGE", toStatus: "EN_COURS", authorId: resp.id, createdAt: daysAgo(8) },
          { fromStatus: "EN_COURS", toStatus: "RESOLU", note: "Disque dur remplacé et système réinstallé.", authorId: resp.id, createdAt: daysAgo(7) },
        ],
      },
      comments: {
        create: [{ content: "Merci, le poste fonctionne de nouveau !", authorId: user.id, createdAt: daysAgo(6) }],
      },
    },
  });

  // Résolu en 1 jour
  await prisma.report.create({
    data: {
      title: "Fuite d'eau dans les toilettes du rez-de-chaussée",
      description: "Le robinet du lavabo de droite fuit en continu.",
      category: "Autre",
      location: "Bâtiment A, rez-de-chaussée",
      status: "RESOLU",
      resolution: "Joint du robinet changé.",
      createdAt: daysAgo(5),
      resolvedAt: daysAgo(4),
      authorId: user.id,
      assigneeId: resp.id,
      history: {
        create: [
          { fromStatus: "NOUVEAU", toStatus: "PRIS_EN_CHARGE", authorId: resp.id, createdAt: daysAgo(4.9) },
          { fromStatus: "PRIS_EN_CHARGE", toStatus: "EN_COURS", authorId: resp.id, createdAt: daysAgo(4.8) },
          { fromStatus: "EN_COURS", toStatus: "RESOLU", note: "Joint du robinet changé.", authorId: resp.id, createdAt: daysAgo(4) },
        ],
      },
    },
  });

  // 3. Historique : création de chaque signalement, puis attribution (1 minute après) s'il est assigné
  const reports = await prisma.report.findMany({ include: { assignee: true } });
  for (const r of reports) {
    await prisma.statusHistory.create({
      data: { reportId: r.id, fromStatus: null, toStatus: "NOUVEAU", authorId: r.authorId, createdAt: r.createdAt },
    });
    if (r.assignee) {
      await prisma.statusHistory.create({
        data: {
          reportId: r.id,
          fromStatus: "NOUVEAU",
          toStatus: "NOUVEAU",
          note: `Attribué à ${r.assignee.name}`,
          authorId: admin.id,
          createdAt: new Date(r.createdAt.getTime() + 60 * 1000),
        },
      });
    }
  }

  console.log("6 signalements de démonstration créés");
}

main().finally(() => prisma.$disconnect());
