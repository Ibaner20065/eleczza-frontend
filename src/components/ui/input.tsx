import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-fog bg-umber/90 px-3 py-1 text-sm text-parchment shadow-[inset_0_2px_5px_rgb(var(--umber-rgb)/0.6)] transition-[border-color,box-shadow] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/45 focus-visible:ring-offset-1 focus-visible:ring-offset-umber disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-wax-foreground aria-[invalid=true]:focus-visible:ring-wax-foreground/40",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
