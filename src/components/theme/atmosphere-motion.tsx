"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function AtmosphereMotion() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0">
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 34% 40% at 20% 54%, rgb(var(--amber-rgb) / 0.22), transparent 72%)",
        }}
        animate={{ opacity: [0.55, 0.85, 0.62], scale: [0.98, 1.03, 0.99] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -inset-x-1/4 inset-y-1/4"
        style={{
          background:
            "radial-gradient(ellipse 48% 28% at 46% 56%, rgb(var(--parchment-rgb) / 0.09), transparent 72%)",
        }}
        animate={{
          x: ["-1%", "2%", "-1%"],
          y: ["2%", "-3%", "2%"],
          opacity: [0.55, 0.85, 0.55],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -inset-x-1/4 inset-y-1/3"
        style={{
          background:
            "radial-gradient(ellipse 38% 22% at 68% 62%, rgb(var(--fog-rgb) / 0.2), transparent 74%)",
        }}
        animate={{
          x: ["2%", "-2%", "2%"],
          y: ["-2%", "3%", "-2%"],
          opacity: [0.45, 0.75, 0.45],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
