import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investigation",
  description: "Work through the timed investigation with your agency.",
};

export default function QuizLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
