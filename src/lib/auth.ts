import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import type { Role } from "@/lib/constants";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        try {
          const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
          if (!user || !(await bcrypt.compare(parsed.data.password, user.password))) return null;
          return { id: user.id, name: user.name, email: user.email, role: user.role as Role };
        } catch (error) {
          if (error instanceof Prisma.PrismaClientInitializationError) {
            throw new Error("Base de données inaccessible. Vérifiez que PostgreSQL est démarré.");
          }
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
};

/** Utilisateur connecté côté serveur (ou null). Relu en base pour avoir toujours son rôle actuel. */
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, role: true },
    });
    return user && { ...user, role: user.role as Role };
  } catch (error) {
    console.warn("[Auth] Impossible de récupérer l'utilisateur en base :", error);
    return null;
  }
}

/** À utiliser dans les routes API : lève une erreur si le rôle n'est pas autorisé. */
export async function requireRole(...roles: Role[]) {
  const user = await getCurrentUser();
  if (!user) throw new HttpError(401, "Non connecté");
  if (roles.length && !roles.includes(user.role)) throw new HttpError(403, "Accès refusé");
  return user;
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
