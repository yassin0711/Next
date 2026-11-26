# Documentation technique de LocalImpact

Ce document explique comment l'application est construite : la structure des dossiers, la base de données, la sécurité, les routes API, les pages et les composants. Pour l'installation, voir le [README](README.md).

## Sommaire

1. [Vue d'ensemble](#1-vue-densemble)
2. [Technologies utilisées](#2-technologies-utilisées)
3. [Structure des dossiers](#3-structure-des-dossiers)
4. [Base de données (Prisma)](#4-base-de-données-prisma)
5. [Authentification et rôles](#5-authentification-et-rôles)
6. [Validation des données (Zod)](#6-validation-des-données-zod)
7. [Routes API](#7-routes-api)
8. [Pages](#8-pages)
9. [Composants](#9-composants)
10. [Fonctionnement des principales actions](#10-fonctionnement-des-principales-actions)
11. [Styles (Tailwind CSS)](#11-styles-tailwind-css)
12. [Données de démonstration](#12-données-de-démonstration)
13. [Ajouter une nouvelle fonctionnalité](#13-ajouter-une-nouvelle-fonctionnalité)

---

## 1. Vue d'ensemble

LocalImpact permet de **signaler un problème** dans un campus, une résidence ou un quartier (lampe cassée, PC en panne, rampe bloquée…), de le **soutenir**, de le **commenter** et de **suivre sa résolution**.

Le cycle de vie d'un signalement :

```
Un utilisateur crée le signalement          → statut « Nouveau »
L'administrateur l'assigne à un responsable
Le responsable le prend en charge           → « Pris en charge »
Le responsable commence l'intervention      → « En cours »
Le responsable décrit son intervention      → « Résolu »
```

Chaque changement est enregistré dans un **historique** (qui, quand, avec quelle note) : la création, l'attribution à un responsable et chaque changement de statut. Une attribution est enregistrée avec `fromStatus = toStatus` et la note « Attribué à … ».

---

## 2. Technologies utilisées

| Technologie | Rôle dans le projet |
|---|---|
| **Next.js 15** (App Router) | Framework React : pages, routes API et rendu côté serveur dans un seul projet |
| **React 19** | Construction de l'interface |
| **TypeScript** | JavaScript avec des types, pour détecter les erreurs avant l'exécution |
| **PostgreSQL** | Base de données |
| **Prisma** | Accès à la base en TypeScript, sans écrire de SQL |
| **NextAuth** | Connexion par email et mot de passe, gestion de la session |
| **bcryptjs** | Chiffrement (hachage) des mots de passe |
| **Zod** | Validation des données des formulaires et des API |
| **Tailwind CSS** | Mise en forme avec des classes CSS utilitaires |
| **Recharts** | Graphiques du tableau de bord |

---

## 3. Structure des dossiers

```
localimpact/
├── prisma/
│   ├── schema.prisma          Modèle de données (tables et relations)
│   ├── migrations/            Historique des modifications de la base (généré par Prisma)
│   └── seed.ts                Comptes et signalements de démonstration
│
├── src/
│   ├── middleware.ts          Protection des pages selon le rôle
│   │
│   ├── lib/                   Code partagé (pas d'interface)
│   │   ├── prisma.ts          Connexion unique à la base de données
│   │   ├── auth.ts            Configuration NextAuth, getCurrentUser, requireRole, HttpError
│   │   ├── api.ts             handleApiError : transforme une erreur en réponse JSON
│   │   ├── validations.ts     Schémas Zod (formulaires et API)
│   │   ├── text.ts            Comparaison de textes sans accents ni majuscules
│   │   └── constants.ts       Rôles, statuts, catégories, ordre des statuts
│   │
│   ├── types/
│   │   └── next-auth.d.ts     Ajoute id et role au type de la session
│   │
│   ├── components/            Composants React réutilisables
│   │
│   └── app/                   Pages et routes API (un dossier = une URL)
│       ├── layout.tsx         Structure commune : barre de navigation, contenu
│       ├── globals.css        Styles communs (btn, card, input…)
│       ├── page.tsx           Accueil  →  /
│       ├── login/             Connexion  →  /login
│       ├── register/          Inscription  →  /register
│       ├── signalements/      Liste, création et détail des signalements
│       ├── responsable/       Signalements assignés au responsable connecté
│       ├── dashboard/         Statistiques et graphiques
│       ├── admin/             Gestion des utilisateurs et des rôles
│       └── api/               Routes API (le « back-end »)
│
├── .env.example               Modèle des variables d'environnement
└── README.md                  Installation et comptes de démonstration
```

**Règle de Next.js à retenir :** dans `src/app`, chaque dossier correspond à une partie de l'URL.

- Un fichier `page.tsx` est une **page**. Par exemple, `src/app/signalements/nouveau/page.tsx` correspond à `/signalements/nouveau`.
- Un fichier `route.ts` est une **route API**. Par exemple, `src/app/api/reports/route.ts` correspond à `/api/reports`.
- Un dossier entre crochets est un **paramètre**. Par exemple, `signalements/[id]` correspond à `/signalements/abc123`, et la page reçoit `id = "abc123"`.

---

## 4. Base de données (Prisma)

Le fichier `prisma/schema.prisma` décrit les 5 tables :

| Table | Contenu | Champs importants |
|---|---|---|
| **User** | Utilisateurs | `name`, `email` (unique), `password` (haché), `role` |
| **Report** | Signalements | `title`, `description`, `category`, `location`, `photoUrl`, `status`, `resolution`, `resolvedAt`, `authorId`, `assigneeId` |
| **Support** | Soutiens | `userId`, `reportId` |
| **Comment** | Commentaires | `content`, `authorId`, `reportId` |
| **StatusHistory** | Historique des statuts | `fromStatus`, `toStatus`, `note`, `authorId`, `reportId` |

**Relations :**

```
User ──< Report (auteur)          un utilisateur crée plusieurs signalements
User ──< Report (responsable)     un responsable est assigné à plusieurs signalements
Report ──< Support >── User       un signalement a plusieurs soutiens
Report ──< Comment >── User       un signalement a plusieurs commentaires
Report ──< StatusHistory          un signalement a plusieurs changements de statut
```

**Points importants :**

- `@@unique([userId, reportId])` sur `Support` garantit, **dans la base elle-même**, qu'une personne ne peut soutenir un signalement qu'une seule fois.
- `onDelete: Cascade` : si un signalement est supprimé, ses soutiens, commentaires et son historique le sont aussi.
- Les rôles et les statuts sont stockés comme du texte. Les valeurs autorisées sont définies dans `src/lib/constants.ts`.

**Utiliser Prisma dans le code :**

```ts
import { prisma } from "@/lib/prisma";

const reports = await prisma.report.findMany({ where: { status: "NOUVEAU" } });
```

**Modifier la base :** changer `schema.prisma`, puis lancer `npm run db:migrate`. Prisma crée un nouveau fichier de migration et met la base à jour.

---

## 5. Authentification et rôles

### Les 3 rôles

| Rôle | Ce qu'il peut faire |
|---|---|
| `USER` (Utilisateur) | Créer, consulter, soutenir et commenter des signalements |
| `RESPONSABLE` | En plus : changer le statut des signalements **qui lui sont assignés** |
| `ADMIN` (Administrateur) | Tout : assigner les signalements, changer n'importe quel statut, gérer les rôles |

Une inscription crée toujours un compte `USER`. Seul un administrateur peut changer un rôle, depuis la page `/admin`.

### Connexion (`src/lib/auth.ts`)

1. L'utilisateur envoie son email et son mot de passe depuis `/login`.
2. NextAuth cherche l'utilisateur dans la base et compare le mot de passe avec `bcrypt.compare`.
3. Si c'est correct, NextAuth crée une **session** stockée dans un cookie chiffré (JWT). On y ajoute l'`id` et le `role` de l'utilisateur.

### Deux niveaux de protection

La sécurité est vérifiée **à deux endroits**, car protéger seulement l'interface ne suffit pas : n'importe qui peut appeler une API directement.

**1. Les pages, dans `src/middleware.ts`**

Avant d'afficher une page protégée, le middleware vérifie la session :

| Page | Accès |
|---|---|
| `/signalements/nouveau`, `/dashboard` | Utilisateur connecté |
| `/responsable` | Responsable ou administrateur |
| `/admin` | Administrateur |

Un visiteur non connecté est redirigé vers `/login`. Un utilisateur connecté sans le bon rôle est redirigé vers `/acces-refuse`.

**2. Les API, avec `requireRole` (`src/lib/auth.ts`)**

Chaque route API qui modifie des données commence par `requireRole`. Le rôle est **relu en base à chaque appel** (`getCurrentUser`) : un changement de rôle s'applique donc tout de suite aux API. Le middleware et le menu utilisent le rôle de la session, mis à jour à la reconnexion.

```ts
const user = await requireRole("ADMIN");               // seul un admin passe
const user = await requireRole("RESPONSABLE", "ADMIN"); // responsable ou admin
const user = await requireRole();                       // n'importe quel utilisateur connecté
```

Si l'utilisateur n'est pas connecté, la fonction lève une erreur **401**. S'il n'a pas le bon rôle, elle lève une erreur **403**.

### Gestion des erreurs (`src/lib/api.ts`)

Toutes les routes API suivent le même modèle :

```ts
export async function POST(req: Request) {
  try {
    const user = await requireRole();                   // 1. vérifier le rôle
    const data = monSchema.parse(await req.json());     // 2. valider les données
    // 3. vérifier les règles métier, sinon throw new HttpError(400, "message")
    // 4. modifier la base avec prisma
    return NextResponse.json(resultat);
  } catch (e) {
    return handleApiError(e);                           // 5. transformer l'erreur en réponse
  }
}
```

`handleApiError` renvoie la bonne réponse selon le type d'erreur :

| Erreur | Réponse |
|---|---|
| `HttpError` | Son code (401, 403, 404, 400…) et son message |
| Erreur Zod (données invalides) | 400 « Données invalides » |
| Base de données injoignable (`isDatabaseDown`, dans `auth.ts`) | 503 avec un message demandant de vérifier PostgreSQL |
| Prisma `P2002` (doublon) / `P2025` (introuvable) | 409 / 404 |
| Toute autre erreur | 500 « Erreur serveur » |

Si la base tombe, `getCurrentUser` transmet l'erreur au lieu de renvoyer `null` : une API répond 503 (et non 401 « Non connecté ») et une page serveur affiche `app/error.tsx`. Son bouton « Réessayer » appelle `router.refresh()` puis `reset()` pour recharger réellement les données.

---

## 6. Validation des données (Zod)

Les schémas de `src/lib/validations.ts` sont utilisés **deux fois** :

- **côté client**, dans le formulaire, pour afficher l'erreur tout de suite sans appeler le serveur ;
- **côté serveur**, dans l'API, parce qu'on ne peut jamais faire confiance aux données reçues.

| Schéma | Utilisé pour |
|---|---|
| `loginSchema` | Connexion |
| `registerSchema` | Inscription |
| `reportSchema` | Création d'un signalement |
| `commentSchema` | Ajout d'un commentaire |
| `assignSchema` | Attribution à un responsable |
| `statusSchema` | Changement de statut |

Exemple côté client :

```ts
const parsed = reportSchema.safeParse(donneesDuFormulaire);
if (!parsed.success) return setError(parsed.error.issues[0].message); // « Titre : 5 caractères minimum »
```

---

## 7. Routes API

| Méthode | URL | Accès | Rôle |
|---|---|---|---|
| `POST` | `/api/register` | Public | Créer un compte `USER` |
| `GET, POST` | `/api/auth/...` | Public | Connexion et déconnexion (gérées par NextAuth) |
| `GET` | `/api/reports` | Public | Liste des signalements, avec recherche et filtres |
| `POST` | `/api/reports` | Connecté | Créer un signalement |
| `GET` | `/api/reports/similar` | Public | Signalements similaires (détection de doublons) |
| `POST` | `/api/reports/[id]/support` | Connecté | Soutenir un signalement |
| `GET` | `/api/reports/[id]/comments` | Public | Liste des commentaires |
| `POST` | `/api/reports/[id]/comments` | Connecté | Ajouter un commentaire |
| `PATCH` | `/api/reports/[id]/assign` | Admin | Assigner à un responsable |
| `PATCH` | `/api/reports/[id]/status` | Responsable assigné ou admin | Passer au statut suivant |
| `GET` | `/api/users` | Admin | Liste des utilisateurs |
| `PATCH` | `/api/users/[id]/role` | Admin | Changer le rôle d'un utilisateur |

### Détails

**`GET /api/reports?q=lampe&category=Éclairage&location=B&status=NOUVEAU`**
Tous les paramètres sont facultatifs. Un paramètre vide est ignoré. La recherche `q` porte sur le titre et la description, sans tenir compte des accents ni des majuscules (`includesText` dans `src/lib/text.ts`). La réponse inclut le nombre de soutiens de chaque signalement (`_count.supports`).

**`POST /api/reports/[id]/support`**
Crée le soutien, puis renvoie le nouveau total. Si la personne a déjà soutenu ce signalement, la base refuse l'insertion à cause de la contrainte `@@unique`. Prisma renvoie alors l'erreur `P2002`, que la route transforme en **409** « Vous soutenez déjà ce signalement ».

**`PATCH /api/reports/[id]/assign`**
Vérifie que le signalement existe (sinon 404) et que l'utilisateur choisi a bien le rôle `RESPONSABLE` (sinon 400). Une transaction met à jour `assigneeId` et ajoute une ligne « Attribué à … » dans l'historique.

**`PATCH /api/reports/[id]/status`** : la route la plus importante. Elle vérifie, dans l'ordre :

1. que l'utilisateur est responsable ou administrateur (sinon 401 ou 403) ;
2. que le signalement existe (sinon 404) ;
3. que l'utilisateur est bien **le responsable assigné** à ce signalement (sinon 403 ; l'admin passe toujours) ;
4. qu'un **responsable est assigné** au signalement (sinon 400 « Assignez d'abord un responsable ») ;
5. que le nouveau statut est bien le **statut suivant**, d'après `NEXT_STATUS` dans `constants.ts` (sinon 400 « Transition non autorisée ») ;
6. que la **description de l'intervention** est fournie pour passer à « Résolu » (sinon 400).

Ensuite, une **transaction** fait deux opérations ensemble : mettre à jour le signalement (avec `resolution` et `resolvedAt` si résolu) et ajouter une ligne dans `StatusHistory`. Si l'une échoue, aucune n'est enregistrée.

**`GET /api/reports/similar?category=Éclairage&location=bâtiment b`**
Renvoie au maximum 5 signalements **non résolus** de la même catégorie, dont le lieu contient le texte saisi, sans tenir compte des accents ni des majuscules.

---

## 8. Pages

Il existe deux sortes de pages :

- **Composant serveur** (sans `"use client"`) : il lit la base directement avec Prisma, sur le serveur, et envoie du HTML déjà rempli. C'est simple et rapide, mais sans interactivité.
- **Composant client** (`"use client"` en haut du fichier) : il s'exécute dans le navigateur et peut utiliser `useState`, `useEffect` et les clics. Il récupère ses données avec `fetch` vers les API.

| URL | Fichier | Type | Contenu |
|---|---|---|---|
| `/` | `app/page.tsx` | Serveur | Accueil : bannière et 3 étapes |
| `/login` | `app/login/page.tsx` | Client | Formulaire de connexion |
| `/register` | `app/register/page.tsx` | Client | Formulaire d'inscription |
| `/acces-refuse` | `app/acces-refuse/page.tsx` | Serveur | Message affiché quand le rôle ne permet pas d'ouvrir la page |
| `/signalements` | `app/signalements/page.tsx` | Client | Liste, recherche et filtres (rechargée à chaque changement de filtre) |
| `/signalements/nouveau` | `app/signalements/nouveau/page.tsx` | Client | Formulaire de création, avec détection de doublons |
| `/signalements/[id]` | `app/signalements/[id]/page.tsx` | Serveur | Détail : charge le signalement, puis affiche les composants d'action |
| `/responsable` | `app/responsable/page.tsx` | Serveur | Signalements assignés au responsable connecté |
| `/dashboard` | `app/dashboard/page.tsx` | Serveur | Statistiques calculées avec Prisma, puis graphiques |
| `/admin` | `app/admin/page.tsx` | Client | Tableau des utilisateurs et changement de rôle |

**La page de détail** est organisée en deux colonnes :

- **à gauche** : les informations du signalement, le bouton Soutenir et les commentaires ;
- **à droite** : le responsable, le formulaire d'attribution (admin), le changement de statut (responsable assigné ou admin) et l'historique.

Chaque formulaire décide lui-même s'il doit s'afficher, selon le rôle de l'utilisateur connecté.

---

## 9. Composants

Tous les composants sont dans `src/components/`.

| Composant | Rôle | Affiché pour |
|---|---|---|
| `Navbar` | Barre de navigation. Les liens dépendent du rôle, et le lien de la page actuelle est mis en évidence | Tous |
| `Providers` | Rend la session (`useSession`) disponible dans toute l'application | — |
| `ReportCard` | Carte cliquable d'un signalement (titre, statut, catégorie, lieu, soutiens) | Tous |
| `StatusBadge` | Pastille colorée du statut | Tous |
| `States` | `Loading`, `ErrorMessage`, `EmptyState` : chargement, erreur, liste vide | Tous |
| `SupportButton` | Bouton « Soutenir (n) », qui devient « ✓ Soutenu » après un soutien | Tous (désactivé si non connecté ou déjà soutenu) |
| `CommentSection` | Liste des commentaires et formulaire d'ajout | Tous (formulaire si connecté) |
| `AssignForm` | Choix d'un responsable et bouton « Assigner » | Admin |
| `StatusForm` | Bouton « Passer à : statut suivant », avec un champ de note | Responsable assigné ou admin |
| `StatusHistoryList` | Historique : création, attribution et changements de statut | Tous |
| `SimilarReports` | Encadré « Ce problème a peut-être déjà été signalé » | Formulaire de création |
| `Chart` | Graphique en barres (Recharts), vertical ou horizontal | Dashboard |

**Exemple : comment `StatusForm` décide de s'afficher**

```ts
const next = NEXT_STATUS[status];                     // statut suivant, ou null si déjà résolu
const canChange = user && (user.role === "ADMIN" || user.id === assigneeId);
if (!next || !canChange) return null;                 // rien à afficher
```

Cette vérification sert seulement à **l'affichage**. La vraie sécurité reste dans l'API, qui refait toutes les vérifications.

---

## 10. Fonctionnement des principales actions

### Créer un signalement

```
Formulaire (/signalements/nouveau)
  → validation avec reportSchema (client)
  → POST /api/reports
       → requireRole()               utilisateur connecté ?
       → reportSchema.parse()         données valides ?
       → prisma.report.create()       enregistrement, avec l'auteur
  → redirection vers /signalements/[id]
```

### Détection de doublons (fonctionnalité originale)

Pendant que l'utilisateur remplit le formulaire, `SimilarReports` reçoit la catégorie et le lieu saisis. À chaque modification, il appelle `/api/reports/similar`. Si des signalements non résolus correspondent, il les affiche avec un lien. L'utilisateur peut alors aller soutenir le signalement existant au lieu d'en créer un nouveau.

### Changer un statut

```
Bouton « Passer à : En cours » (StatusForm)
  → PATCH /api/reports/[id]/status  { status: "EN_COURS", note: "..." }
       → vérifications (rôle, assignation, ordre des statuts, note si Résolu)
       → transaction : mise à jour du signalement + ligne d'historique
  → router.refresh() : la page de détail se recharge avec le nouveau statut et l'historique
```

### Tableau de bord

La page lit la base directement :

- `prisma.report.groupBy({ by: ["status"] })` compte les signalements par statut, et de même par catégorie ;
- le délai moyen est la moyenne de `resolvedAt - createdAt` sur les signalements résolus, convertie en jours.

Les données sont ensuite passées au composant client `Chart`, parce que Recharts a besoin du navigateur.

---

## 11. Styles (Tailwind CSS)

Les styles sont écrits avec des **classes Tailwind** directement dans le JSX :

```tsx
<h2 className="text-lg font-semibold text-teal-800">
```

Les éléments qui reviennent partout sont regroupés dans `src/app/globals.css` avec `@apply` :

| Classe | Utilisation |
|---|---|
| `card` | Bloc blanc avec bordure et ombre |
| `btn` | Bouton principal (vert) |
| `btn-outline` | Bouton secondaire (bordure) |
| `input` | Champ de formulaire |
| `label` | Libellé de champ |
| `page-title` | Titre de page |

Pour changer la couleur de tous les boutons, il suffit de modifier la classe `.btn` dans `globals.css`.

---

## 12. Données de démonstration

`npm run db:seed` exécute `prisma/seed.ts`, qui crée :

- **3 comptes**, tous avec le mot de passe `demo1234` :

  | Compte | Rôle |
  |---|---|
  | `admin@demo.tn` | Administrateur |
  | `responsable@demo.tn` | Responsable |
  | `user@demo.tn` | Utilisateur |

- **6 signalements** avec des statuts variés (2 nouveaux, 1 pris en charge, 1 en cours, 2 résolus), leur historique, des soutiens et des commentaires.

Les signalements ne sont ajoutés que si la base n'en contient aucun : relancer le seed ne crée pas de doublons.

Pour remettre la base à zéro : `npx prisma migrate reset`. Cette commande supprime toutes les données, recrée les tables et relance le seed.

---

## 13. Ajouter une nouvelle fonctionnalité

Démarche conseillée, par exemple pour ajouter la suppression d'un commentaire :

1. **Base de données** : si besoin, modifier `prisma/schema.prisma`, puis lancer `npm run db:migrate`.
2. **Validation** : ajouter un schéma dans `src/lib/validations.ts` si l'action reçoit des données.
3. **Route API** : créer le fichier `route.ts` en suivant le modèle de la [partie 5](#gestion-des-erreurs-srclibapits) : `requireRole`, validation, vérifications, Prisma, `handleApiError`.
4. **Composant** : créer un composant client qui appelle l'API avec `fetch` et affiche les erreurs.
5. **Page** : placer le composant dans la page concernée.
6. **Accès** : si c'est une nouvelle page protégée, l'ajouter dans `src/middleware.ts`.
7. **Vérifier** : `npm run lint`, puis tester avec les 3 comptes de démonstration.
