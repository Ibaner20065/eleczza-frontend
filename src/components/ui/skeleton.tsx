import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[#1C202B] border border-[#2D3344]/30",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
