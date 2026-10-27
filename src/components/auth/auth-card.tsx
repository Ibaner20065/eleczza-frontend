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
        "w-full max-w-md rounded-sm border border-[#3a2e24] p-8 sm:p-9 shadow-[inset_0_1px_0_rgba(233,220,192,0.06),0_12px_40px_rgba(13,9,7,0.85)] backdrop-blur-md",
        className,
      )}
      style={{
        background:
          "linear-gradient(155deg, rgba(26,17,12,0.94) 0%, rgba(18,12,8,0.98) 100%)",
      }}
      {...props}
    >
      <div className="mb-6 text-center">
        <div className="mb-2.5 inline-block rounded-full border border-amber/35 bg-surface/80 px-3 py-1 font-archival text-[9px] font-bold tracking-[0.25em] text-amber/85 uppercase shadow-sm">
          Scotland Yard Bureau
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-parchment leading-tight">
          {title}
        </h1>
        <p className="mt-1.5 font-serif text-sm text-parchment/75 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {children}
    </div>
  );
}
