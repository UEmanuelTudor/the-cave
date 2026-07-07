import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Cave | Cazare în Cluj-Napoca",
  description:
    "Două apartamente private în Cluj-Napoca, disponibile separat sau împreună.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${geist.variable} antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}