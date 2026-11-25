import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "LocalImpact",
  description: "Signalement et suivi des problèmes du quotidien",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col bg-gray-50 text-gray-900 antialiased" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
          <footer className="border-t bg-white py-4 text-center text-sm text-gray-500">
            LocalImpact · Signalez, soutenez, suivez la résolution
          </footer>
        </Providers>
      </body>
    </html>
  );
}
