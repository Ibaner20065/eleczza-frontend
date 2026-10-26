import * as React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export interface BrassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  withLoupe?: boolean;
  size?: "sm" | "md" | "lg";
}

export const BrassButton = React.forwardRef<
  HTMLButtonElement,
  BrassButtonProps
>(({ className, children, withLoupe = false, size = "md", ...props }, ref) => {
  const sizeClasses = {
    sm: "h-8 px-3 text-[11px]",
    md: "h-9 px-4 text-xs",
    lg: "h-11 px-6 text-sm",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-md font-semibold uppercase tracking-wider text-umber select-none cursor-pointer overflow-hidden transition-all duration-150",
        "bg-gradient-to-b from-parchment via-amber to-copper",
        "border border-parchment/80 shadow-[inset_0_1px_1px_rgb(var(--parchment-rgb)/0.55),0_2px_8px_rgb(var(--umber-rgb)/0.6),0_0_10px_rgb(var(--amber-rgb)/0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/70 focus-visible:ring-offset-2 focus-visible:ring-offset-umber",
        "hover:brightness-108 hover:shadow-[inset_0_1px_1px_rgb(var(--parchment-rgb)/0.7),0_4px_14px_rgb(var(--umber-rgb)/0.7),0_0_14px_rgb(var(--amber-rgb)/0.32)]",
        "active:translate-y-[1px] active:brightness-95 active:shadow-[inset_0_2px_4px_rgb(var(--umber-rgb)/0.5)]",
        "disabled:opacity-50 disabled:pointer-events-none",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {/* Subtle metallic diagonal sheen line */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />

      {withLoupe && <Search className="h-3.5 w-3.5 text-umber shrink-0" />}
      <span className="relative z-10">{children}</span>
    </button>
  );
});

BrassButton.displayName = "BrassButton";
