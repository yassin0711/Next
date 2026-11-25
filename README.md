# LocalImpact

Plateforme de signalement et de suivi des problèmes du quotidien : matériel défectueux, accessibilité, éclairage, propreté, équipement informatique…

**Stack :** Next.js 15 (App Router), React 19, Prisma, PostgreSQL, NextAuth (connexion par identifiants), Zod, Tailwind CSS, Recharts.

## Installation

Prérequis : Node.js et PostgreSQL installés.

1. Créer la base de données (une seule fois) :
   ```bash
   psql -U postgres -c "CREATE DATABASE localimpact;"
   ```
2. Installer et lancer le projet :
   ```bash
   npm install
   cp .env.example .env        # puis mettre votre mot de passe PostgreSQL et changer NEXTAUTH_SECRET
   npm run db:migrate          # crée les tables
   npm run db:seed             # crée les comptes de démonstration
   npm run dev                 # http://localhost:3000
   ```

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | admin@demo.tn | demo1234 |
| Responsable | responsable@demo.tn | demo1234 |
| Utilisateur | user@demo.tn | demo1234 |

## Organisation du code

```
prisma/schema.prisma     modèle de données (User, Report, Support, Comment, StatusHistory)
src/lib/                 prisma, auth (requireRole), validations Zod, constantes, gestion d'erreurs API
src/middleware.ts        protection des pages selon le rôle
src/app/api/             routes API (toujours vérifier le rôle côté serveur)
src/app/                 pages
src/components/          composants réutilisables
```

## Rôles

- **Utilisateur** : crée, consulte, soutient et commente des signalements.
- **Responsable** : traite les signalements qui lui sont assignés (changement de statut).
- **Administrateur** : gère les rôles, assigne les signalements, peut tout modifier.

Une inscription crée toujours un compte « Utilisateur ». Seul un administrateur peut changer un rôle.

## Règles métier (vérifiées côté serveur)

- Un utilisateur ne peut soutenir un signalement qu'une seule fois.
- Le statut suit l'ordre nouveau → pris en charge → en cours → résolu, sans sauter d'étape.
- Le statut ne peut avancer qu'après l'attribution d'un responsable.
- Seuls le responsable assigné ou un administrateur peuvent changer le statut.
- Passer à « Résolu » exige une description de l'intervention.
- L'historique enregistre la création, l'attribution et chaque changement de statut, avec la date et l'auteur.

## Répartition du travail

Voir [TACHES.md](TACHES.md).

## Limites connues

- La photo d'un signalement est un lien vers une image (pas d'envoi de fichier).
- La recherche par texte et par lieu est faite en JavaScript après la lecture en base : adaptée à un petit nombre de signalements.
- Après un changement de rôle, les API appliquent le nouveau rôle tout de suite, mais le menu et l'accès aux pages changent à la reconnexion.
