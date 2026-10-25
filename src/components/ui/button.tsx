import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:translate-y-[1px]",
  {
    variants: {
      variant: {
        default:
          "bg-[#DFB75A] text-[#0B0C10] shadow hover:bg-[#C59B27] border border-[#DFB75A]/60",
        brass:
          "bg-gradient-to-b from-[#F3D88C] via-[#DFB75A] to-[#9B7728] text-[#0B0C10] border border-[#F3D88C]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.6)] hover:brightness-110 active:brightness-95",
        oxblood:
          "bg-[#8B1E22] text-[#FBF8F1] border border-[#A8262B] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(61,11,14,0.6)] hover:bg-[#A8262B]",
        outline:
          "border border-[#2D3344] bg-[#12151C] text-[#F4EBD9] hover:bg-[#1C202B] hover:border-[#DFB75A]/50 hover:text-[#DFB75A]",
        secondary:
          "bg-[#1C202B] text-[#F4EBD9] border border-[#2D3344] hover:bg-[#2D3344]/70",
        ghost: "text-[#D9CEB8] hover:bg-[#1C202B] hover:text-[#DFB75A]",
        destructive:
          "bg-[#A8262B]/20 text-[#C93B41] border border-[#A8262B]/40 hover:bg-[#A8262B]/30",
        link: "text-[#DFB75A] underline-offset-4 hover:underline lowercase normal-case tracking-normal",
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
