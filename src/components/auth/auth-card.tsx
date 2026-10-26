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
        "parchment-border w-full max-w-md rounded-lg bg-surface/95 p-8 backdrop-blur-md",
        className,
      )}
      {...props}
    >
      <div className="mb-6 text-center">
        <div className="mb-2 inline-block rounded-full border border-amber/40 px-3 py-1 text-[11px] font-semibold tracking-wider text-amber uppercase">
          Scotland Yard Bureau
        </div>
        <h1 className="font-script text-3xl leading-tight text-parchment">
          {title}
        </h1>
        <p className="mt-1 text-sm text-parchment">{subtitle}</p>
      </div>

      {children}
    </div>
  );
}
