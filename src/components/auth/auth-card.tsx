import React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthCard({
  title,
  subtitle,
  children,
  className,
  ...props
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "parchment-border w-full max-w-md rounded-lg bg-[#12151C]/95 p-8 backdrop-blur-md",
        className,
      )}
      {...props}
    >
      <div className="mb-6 text-center">
        <div className="mb-2 inline-block rounded-full border border-[#DFB75A]/40 px-3 py-1 text-[11px] font-semibold tracking-wider text-[#DFB75A] uppercase">
          Scotland Yard Bureau
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#F7F2E7]">
          {title}
        </h1>
        <p className="mt-1 text-sm text-[#D9CEB8]">{subtitle}</p>
      </div>

      {children}
    </div>
  );
}
