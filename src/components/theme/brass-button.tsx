import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, LoaderCircle, Search } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface BrassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  withLoupe?: boolean;
  size?: "sm" | "md" | "lg";
}

export type LightBeamButtonStatus = "idle" | "loading" | "success" | "failure";

export interface LightBeamButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  status?: LightBeamButtonStatus;
}

export const LightBeamButton = React.forwardRef<
  HTMLButtonElement,
  LightBeamButtonProps
>(({ className, children, status = "idle", disabled, ...props }, ref) => {
  const reducedMotion = useReducedMotion();
  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isFailure = status === "failure";
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "group relative min-h-11 w-full select-none rounded overflow-hidden px-6 py-3",
        "bg-surface text-parchment font-archival text-xs font-bold tracking-[0.2em] uppercase",
        "border border-brass/70 shadow-[inset_0_1px_0_rgba(233,220,192,0.1),0_2px_8px_rgba(13,9,7,0.7)]",
        "transition-all duration-200 ease-out",
        "hover:border-brass hover:bg-[#22160f] hover:shadow-[inset_0_1px_0_rgba(233,220,192,0.15),0_0_12px_rgba(198,138,50,0.25),0_4px_12px_rgba(13,9,7,0.8)]",
        "active:translate-y-[1px] active:bg-[#180f0a]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isSuccess && "!border-brass !bg-surface text-parchment",
        isFailure && "!border-crimson !bg-crimson/30 text-parchment",
        className,
      )}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {/* Subtle brass sheen on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-brass/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
        {isLoading && (
          <LoaderCircle
            aria-hidden="true"
            className={cn(
              "h-4 w-4 shrink-0 text-brass",
              !reducedMotion && "animate-spin",
            )}
          />
        )}
        {isSuccess && (
          <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-brass" />
        )}
        {isFailure && (
          <AlertCircle
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-crimson-foreground"
          />
        )}
      </span>
      {isLoading && (
        <span className="sr-only" role="status">
          Loading
        </span>
      )}
      {status === "success" && (
        <span className="sr-only" role="status">
          Complete
        </span>
      )}
      {status === "failure" && (
        <span className="sr-only" role="status">
          Failed
        </span>
      )}
    </button>
  );
});

LightBeamButton.displayName = "LightBeamButton";

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
