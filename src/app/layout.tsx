import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import AtelierTexture from "@/components/shared/AtelierTexture";
import AtelierCursor from "@/components/shared/AtelierCursor";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "[COMPANY NAME] — Painting Atelier",
  description:
    "Interior & exterior house painting, cabinet refinishing, and color consultation. A craftsman's finish, free estimates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        {children}
        <AtelierCursor />
        <AtelierTexture />
      </body>
    </html>
  );
}
