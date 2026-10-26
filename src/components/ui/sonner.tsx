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
            "group toast group-[.toaster]:bg-surface group-[.toaster]:text-parchment group-[.toaster]:border-amber/40 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-lg group-[.toaster]:p-4",
          description: "group-[.toast]:text-parchment text-xs",
          actionButton:
            "group-[.toast]:bg-amber group-[.toast]:text-umber font-semibold text-xs",
          cancelButton:
            "group-[.toast]:bg-surface group-[.toast]:text-parchment text-xs",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
