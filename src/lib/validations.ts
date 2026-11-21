import { z } from "zod";
import { CATEGORIES, STATUSES } from "@/lib/constants";

// Schémas partagés : utilisés côté client (formulaires) ET côté serveur (API)

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(60),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "6 caractères minimum"),
});

export const reportSchema = z.object({
  title: z.string().trim().min(5, "5 caractères minimum").max(100),
  description: z.string().trim().min(10, "10 caractères minimum").max(2000),
  category: z.enum(CATEGORIES, { message: "Catégorie invalide" }),
  location: z.string().trim().min(2, "Lieu requis").max(100),
  photoUrl: z.string().url().optional().or(z.literal("")),
});

export const commentSchema = z.object({
  content: z.string().trim().min(1, "Commentaire vide").max(1000),
});

export const assignSchema = z.object({
  assigneeId: z.string().min(1, "Responsable requis"),
});

export const statusSchema = z.object({
  status: z.enum(STATUSES, { message: "Statut invalide" }),
  note: z.string().trim().max(2000).optional(),
});
