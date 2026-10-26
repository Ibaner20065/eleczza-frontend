import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md border border-parchment/10 bg-gradient-to-r from-surface via-fog/25 to-surface",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
