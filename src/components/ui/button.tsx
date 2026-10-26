import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:translate-y-[1px]",
  {
    variants: {
      variant: {
        default:
          "bg-amber text-umber shadow hover:bg-copper border border-amber/60",
        amber:
          "bg-gradient-to-b from-parchment via-amber to-copper text-umber border border-parchment/80 shadow-[inset_0_1px_1px_rgb(var(--parchment-rgb)/0.4),0_2px_8px_rgb(var(--umber-rgb)/0.6)] hover:brightness-110 active:brightness-95",
        wax: "bg-wax text-parchment border border-wax shadow-[inset_0_1px_1px_rgb(var(--parchment-rgb)/0.2),0_2px_8px_rgb(var(--wax-rgb)/0.6)] hover:bg-wax",
        outline:
          "border border-fog bg-surface text-parchment hover:bg-surface hover:border-amber/50 hover:text-amber",
        secondary:
          "bg-surface text-parchment border border-fog hover:bg-fog/70",
        ghost: "text-parchment hover:bg-surface hover:text-amber",
        destructive:
          "bg-wax/20 text-wax-foreground border border-wax/40 hover:bg-wax/30",
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
