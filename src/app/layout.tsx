import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0907",
};
import {
  Cormorant_Garamond,
  EB_Garamond,
  Cinzel,
  Pinyon_Script,
  Special_Elite,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AppAuthProvider } from "@/components/auth/auth-provider";

const displaySerif = Cormorant_Garamond({
  weight: ["500", "600", "700"],
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const bodySerif = EB_Garamond({
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const archivalSerif = Cinzel({
  weight: ["500", "600", "700", "800"],
  variable: "--font-archival",
  subsets: ["latin"],
  display: "swap",
});

const calligraphy = Pinyon_Script({
  weight: "400",
  variable: "--font-script",
  subsets: ["latin"],
  display: "swap",
});

const typewriterMono = Special_Elite({
  weight: "400",
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ELECZZA 2.0 — 221B Baker Street Investigation",
  description:
    "A Sherlock Holmes themed forensic and cryptography quiz portal for Academy of Technology.",
  openGraph: {
    title: "ELECZZA 2.0 — 221B Baker Street Investigation",
    description:
      "A Sherlock Holmes themed forensic and cryptography quiz portal for Academy of Technology.",
    siteName: "ELECZZA 2.0",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ELECZZA 2.0 — 221B Baker Street Investigation",
    description:
      "A Sherlock Holmes themed forensic and cryptography quiz portal for Academy of Technology.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${displaySerif.variable} ${archivalSerif.variable} ${bodySerif.variable} ${calligraphy.variable} ${typewriterMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-serif bg-background text-foreground">
        <AppAuthProvider>{children}</AppAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
