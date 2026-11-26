import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "LocalImpact — Plateforme participative d'amélioration du cadre de vie",
  description: "Signalez, soutenez et suivez la résolution des problèmes de votre campus ou quartier en toute transparence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="flex min-h-screen flex-col bg-slate-50/70 text-slate-900 antialiased selection:bg-teal-100 selection:text-teal-900" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="w-full flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
