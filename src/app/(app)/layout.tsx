import * as React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FogBackground } from "@/components/theme/fog-background";

export const metadata: Metadata = {
  title: {
    default: "Investigation Desk | ELECZZA 2.0",
    template: "%s | ELECZZA 2.0",
  },
  description:
    "Track your agency, solve the active case, and review the event standings.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell relative flex min-h-screen flex-col bg-[#0B0C10] text-[#F7F2E7]">
      <FogBackground density="medium" />
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
