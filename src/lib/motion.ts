import type { Variants, Transition } from "framer-motion";

/**
 * Standard Victorian Noir transition curves
 */
export const transitions = {
  snappy: {
    duration: 0.2,
    ease: [0.16, 1, 0.3, 1],
  } as Transition,
  dossierUnfold: {
    duration: 0.35,
    ease: [0.16, 1, 0.3, 1],
  } as Transition,
  stampSlam: {
    type: "spring",
    stiffness: 400,
    damping: 22,
    mass: 1,
  } as Transition,
  fogDrift: {
    duration: 25,
    repeat: Infinity,
    ease: "linear",
  } as Transition,
};

/**
 * fadeUp - standard subtle entrance for cards and panels
 */
export const fadeUp: Variants = {
  initial: {
    opacity: 0,
    y: 14,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.dossierUnfold,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: transitions.snappy,
  },
};

/**
 * stagger - parent container staggered reveal for children
 */
export const stagger: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

/**
 * stampIn - dramatic ink stamp impact (slams down with rotation and recoil)
 */
export const stampIn: Variants = {
  initial: {
    opacity: 0,
    scale: 1.8,
    rotate: -15,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 0.9,
    scale: 1,
    rotate: -6,
    filter: "blur(0px)",
    transition: transitions.stampSlam,
  },
};

/**
 * pageTransition - layout crossfade
 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 6,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: 0.15,
    },
  },
};
