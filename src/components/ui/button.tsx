import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/70 focus-visible:ring-offset-2 focus-visible:ring-offset-umber disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:translate-y-[1px]",
  {
    variants: {
      variant: {
        default:
          "border border-amber/70 bg-gradient-to-b from-amber to-copper text-umber shadow-[0_0_14px_rgb(var(--amber-rgb)/0.16)] hover:brightness-110 hover:shadow-[0_0_18px_rgb(var(--amber-rgb)/0.25)]",
        amber:
          "bg-gradient-to-b from-parchment via-amber to-copper text-umber border border-parchment/80 shadow-[inset_0_1px_1px_rgb(var(--parchment-rgb)/0.4),0_2px_8px_rgb(var(--umber-rgb)/0.6)] hover:brightness-110 active:brightness-95",
        wax: "wax-seal border-wax text-parchment shadow-[inset_0_1px_2px_rgb(var(--parchment-rgb)/0.2),0_2px_8px_rgb(var(--umber-rgb)/0.5)] hover:brightness-110",
        outline:
          "border border-parchment/35 bg-transparent text-parchment hover:border-parchment/70 hover:bg-parchment/5",
        secondary:
          "wood-panel text-parchment hover:border-amber/45 hover:text-amber",
        ghost: "text-parchment hover:bg-parchment/5 hover:text-amber",
        destructive:
          "border border-wax bg-wax text-parchment shadow-[0_2px_10px_rgb(var(--wax-rgb)/0.28)] hover:brightness-110",
        link: "text-amber underline-offset-4 hover:underline lowercase normal-case tracking-normal",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-[11px]",
        lg: "h-11 rounded-md px-8 text-sm",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
