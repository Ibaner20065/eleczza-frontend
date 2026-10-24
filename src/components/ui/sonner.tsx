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
            "group toast group-[.toaster]:bg-[#12151C] group-[.toaster]:text-[#F4EBD9] group-[.toaster]:border-[#DFB75A]/40 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-lg group-[.toaster]:p-4",
          description: "group-[.toast]:text-[#D9CEB8] text-xs",
          actionButton:
            "group-[.toast]:bg-[#DFB75A] group-[.toast]:text-[#0B0C10] font-semibold text-xs",
          cancelButton:
            "group-[.toast]:bg-[#1C202B] group-[.toast]:text-[#D9CEB8] text-xs",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
