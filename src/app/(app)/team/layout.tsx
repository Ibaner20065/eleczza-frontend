import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agency",
  description: "Create or join an agency and coordinate your investigators.",
};

export default function TeamLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
