import React from "react";
import { FogBackdrop } from "@/components/theme/fog-backdrop";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <FogBackdrop />
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
