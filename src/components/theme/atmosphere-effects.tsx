"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const AtmosphereMotion = lazy(() => import("./atmosphere-motion"));

export function AtmosphereEffects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion || isVisible) return;

    if (typeof IntersectionObserver === "undefined") {
      const timeout = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [isVisible, reducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {isVisible && !reducedMotion && (
        <Suspense fallback={null}>
          <AtmosphereMotion />
        </Suspense>
      )}
    </div>
  );
}
