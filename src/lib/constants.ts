export const ROLES = ["USER", "RESPONSABLE", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const STATUSES = ["NOUVEAU", "PRIS_EN_CHARGE", "EN_COURS", "RESOLU"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  NOUVEAU: "Nouveau",
  PRIS_EN_CHARGE: "Pris en charge",
  EN_COURS: "En cours",
  RESOLU: "Résolu",
};

// Transition autorisée : uniquement vers le statut suivant
export const NEXT_STATUS: Record<Status, Status | null> = {
  NOUVEAU: "PRIS_EN_CHARGE",
  PRIS_EN_CHARGE: "EN_COURS",
  EN_COURS: "RESOLU",
  RESOLU: null,
};

export const CATEGORIES = [
  "Matériel défectueux",
  "Accessibilité",
  "Éclairage",
  "Propreté",
  "Équipement informatique",
  "Autre",
] as const;
