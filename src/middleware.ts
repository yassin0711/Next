import { withAuth } from "next-auth/middleware";

// Protection des pages par rôle (les API vérifient AUSSI avec requireRole)
export default withAuth({
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ token, req }) {
      const path = req.nextUrl.pathname;
      if (!token) return false;
      if (path.startsWith("/admin")) return token.role === "ADMIN";
      if (path.startsWith("/responsable")) return token.role === "RESPONSABLE" || token.role === "ADMIN";
      return true;
    },
  },
});

export const config = {
  matcher: ["/signalements/nouveau", "/responsable/:path*", "/admin/:path*", "/dashboard/:path*"],
};
