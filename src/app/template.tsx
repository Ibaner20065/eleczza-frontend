"use client";

import * as React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-enter flex min-h-screen w-full flex-col">
      {children}
    </div>
  );
}
