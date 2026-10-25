import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Review the active event, countdown, and agency status.",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
