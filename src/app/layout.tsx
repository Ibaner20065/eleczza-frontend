import type { Metadata } from "next";
import { Playfair_Display, Special_Elite, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const serifDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const typewriterMono = Special_Elite({
  weight: "400",
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const sansBody = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ELECZZA — 221B Baker Street Investigation",
  description:
    "A Sherlock Holmes themed forensic and cryptography quiz portal for Academy of Technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${serifDisplay.variable} ${typewriterMono.variable} ${sansBody.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
