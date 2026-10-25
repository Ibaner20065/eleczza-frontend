import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "See the current event standings and your agency's rank.",
};

export default function LeaderboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
