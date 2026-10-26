"use client";

import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group font-sans"
      toastOptions={{
        classNames: {
          toast:
            "group toast wood-panel wood-toast text-parchment shadow-2xl rounded-lg p-4",
          description: "group-[.toast]:text-parchment/85 text-xs",
          actionButton:
            "group-[.toast]:bg-amber group-[.toast]:text-umber font-semibold text-xs",
          cancelButton:
            "group-[.toast]:bg-surface group-[.toast]:text-parchment border group-[.toast]:border-parchment/25 text-xs",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
