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
        "group relative inline-flex items-center justify-center gap-2 rounded-md font-semibold uppercase tracking-wider text-[#0B0C10] select-none cursor-pointer overflow-hidden transition-all duration-150",
        "bg-gradient-to-b from-[#F7E7B4] via-[#DFB75A] to-[#A07823]",
        "border border-[#FDF0CD] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_8px_rgba(0,0,0,0.6),0_0_12px_rgba(223,183,90,0.3)]",
        "hover:brightness-108 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_14px_rgba(0,0,0,0.7),0_0_18px_rgba(223,183,90,0.45)]",
        "active:translate-y-[1px] active:brightness-95 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]",
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

      {withLoupe && <Search className="h-3.5 w-3.5 text-[#0B0C10] shrink-0" />}
      <span className="relative z-10">{children}</span>
    </button>
  );
});

BrassButton.displayName = "BrassButton";
