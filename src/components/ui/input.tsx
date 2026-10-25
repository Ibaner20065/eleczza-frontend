import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-[#2D3344] bg-[#0B0C10] px-3 py-1 text-sm text-[#F4EBD9] shadow-inner transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#4E5569] focus-visible:border-[#DFB75A] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#DFB75A] disabled:cursor-not-allowed disabled:opacity-50",
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
