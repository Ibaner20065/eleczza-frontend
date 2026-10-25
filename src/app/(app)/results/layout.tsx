import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Results",
  description: "Review the score and accuracy from your completed case.",
};

export default function ResultsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
