import { z } from "zod";
import { CATEGORIES, STATUSES } from "@/lib/constants";

// Schémas partagés : utilisés côté client (formulaires) ET côté serveur (API)

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nom : 2 caractères minimum").max(60, "Nom : 60 caractères maximum"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe : 6 caractères minimum"),
});

export const reportSchema = z.object({
  title: z.string().trim().min(5, "Titre : 5 caractères minimum").max(100, "Titre : 100 caractères maximum"),
  description: z
    .string()
    .trim()
    .min(10, "Description : 10 caractères minimum")
    .max(2000, "Description : 2000 caractères maximum"),
  category: z.enum(CATEGORIES, { message: "Choisissez une catégorie" }),
  location: z.string().trim().min(2, "Lieu : 2 caractères minimum").max(100, "Lieu : 100 caractères maximum"),
  photoUrl: z.url({ protocol: /^https?$/, message: "Photo : lien http(s) invalide" }).optional().or(z.literal("")),
});

export const commentSchema = z.object({
  content: z.string().trim().min(1, "Commentaire vide").max(1000, "Commentaire : 1000 caractères maximum"),
});

export const assignSchema = z.object({
  assigneeId: z.string().min(1, "Responsable requis"),
});

export const statusSchema = z.object({
  status: z.enum(STATUSES, { message: "Statut invalide" }),
  note: z.string().trim().max(2000).optional(),
});
