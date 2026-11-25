import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// Protection des pages par rôle (les API vérifient AUSSI avec requireRole)
export default withAuth(
  // Exécuté seulement si l'utilisateur est connecté : vérifie son rôle
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const role = req.nextauth.token?.role;

    const adminOnly = path.startsWith("/admin") && role !== "ADMIN";
    const responsableOnly = path.startsWith("/responsable") && role !== "RESPONSABLE" && role !== "ADMIN";
    if (adminOnly || responsableOnly) {
      return NextResponse.redirect(new URL("/acces-refuse", req.url));
    }
  },
  {
    pages: { signIn: "/login" },
    callbacks: { authorized: ({ token }) => !!token }, // non connecté : page de connexion
  }
);

export const config = {
  matcher: ["/signalements/nouveau", "/responsable/:path*", "/admin/:path*", "/dashboard/:path*"],
};
