import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "CRYPTICX — Digital Services, Marketplace, Hosting & Cybersecurity Platform",
  description: "Enterprise portal combining digital services, marketplace products, domain registration, cloud hosting, encryption utilities, and lawful cybersecurity solutions.",
  keywords: ["CrypticX", "Digital Services", "Cybersecurity", "Hosting", "Domains", "Encryption Tools", "Marketplace"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-slate-100 flex flex-col min-h-screen">
        <LanguageProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
