"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/hooks/use-auth";

export function AppAuthProvider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
