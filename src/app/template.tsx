"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className="flex min-h-screen w-full flex-col">{children}</div>;
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex min-h-screen w-full flex-col"
    >
      {children}
    </motion.div>
  );
}
