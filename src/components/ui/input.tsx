import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-[#2D3344] bg-[#0B0C10] px-3 py-1 text-sm text-[#F4EBD9] shadow-inner transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#8892B0] focus-visible:border-[#F3D88C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3D88C] disabled:cursor-not-allowed disabled:opacity-50",
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
