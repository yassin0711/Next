# LocalImpact

Plateforme de signalement et de suivi des problèmes du quotidien : matériel défectueux, accessibilité, éclairage, propreté, équipement informatique…

**Stack :** Next.js 15 (App Router), React 19, Prisma (SQLite en local), NextAuth (connexion par identifiants), Zod, Tailwind CSS, Recharts.

## Installation

```bash
npm install
cp .env.example .env        # puis changer NEXTAUTH_SECRET
npm run db:migrate          # crée la base SQLite
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

## Répartition du travail

Voir [TACHES.md](TACHES.md).

## Limites connues

- SQLite est utilisé en local. Pour le déploiement, il faudra passer à PostgreSQL (changer `provider` dans `schema.prisma`).
- L'application est en cours de développement : les pages marquées « À faire » ne sont pas encore réalisées.
