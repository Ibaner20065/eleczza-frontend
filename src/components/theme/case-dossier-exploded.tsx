"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion as framerUseReducedMotion,
} from "framer-motion";
import { LightBeamButton } from "./brass-button";
import {
  ArrowRight,
  Search,
  Key,
  FileText,
  Newspaper,
  MapPin,
  Mail,
} from "lucide-react";

/* ------------------------------------------------------------------
   Victorian Forensic Evidence Artifacts Definition
------------------------------------------------------------------ */

interface EvidenceArtifactDef {
  id: string;
  type: "docket" | "newspaper" | "cipher" | "envelope" | "loupe" | "map";
  tag: string;
  tagColor: string;
  initialX: number;
  initialY: number;
  desktopX: number;
  desktopY: number;
  mobileX: number;
  mobileY: number;
  rotation: number;
  delay: number;
}

const ARTIFACTS: EvidenceArtifactDef[] = [
  {
    id: "suspect-docket",
    type: "docket",
    tag: "SCOTLAND YARD DOCKET",
    tagColor: "border-wax/50 text-wax-foreground",
    initialX: -150,
    initialY: -130,
    desktopX: -400,
    desktopY: -180,
    mobileX: -110,
    mobileY: -180,
    rotation: -7,
    delay: 0,
  },
  {
    id: "telegraph-paper",
    type: "newspaper",
    tag: "DAILY TELEGRAPH • 1895",
    tagColor: "border-amber/40 text-amber",
    initialX: 150,
    initialY: -130,
    desktopX: 400,
    desktopY: -190,
    mobileX: 110,
    mobileY: -190,
    rotation: 8,
    delay: 0.04,
  },
  {
    id: "cipher-wheel",
    type: "cipher",
    tag: "ROT-13 CIPHER DISC",
    tagColor: "border-amber/50 text-amber",
    initialX: -175,
    initialY: 30,
    desktopX: -440,
    desktopY: 35,
    mobileX: -125,
    mobileY: -30,
    rotation: 9,
    delay: 0.08,
  },
  {
    id: "courier-dispatch",
    type: "envelope",
    tag: "SEALED ROYAL DISPATCH",
    tagColor: "border-wax/60 text-wax-foreground",
    initialX: 175,
    initialY: 30,
    desktopX: 440,
    desktopY: 35,
    mobileX: 125,
    mobileY: -30,
    rotation: -8,
    delay: 0.12,
  },
  {
    id: "forensic-loupe",
    type: "loupe",
    tag: "MAGNIFYING LOUPE",
    tagColor: "border-amber/40 text-amber",
    initialX: -140,
    initialY: 150,
    desktopX: -370,
    desktopY: 235,
    mobileX: -110,
    mobileY: 140,
    rotation: -10,
    delay: 0.16,
  },
  {
    id: "survey-map",
    type: "map",
    tag: "BAKER ST SURVEY MAP",
    tagColor: "border-wax/50 text-wax-foreground",
    initialX: 140,
    initialY: 150,
    desktopX: 370,
    desktopY: 230,
    mobileX: 110,
    mobileY: 140,
    rotation: 7,
    delay: 0.2,
  },
];

/* ------------------------------------------------------------------
   Main Component: Scroll-Driven Exploded Dossier
------------------------------------------------------------------ */

const subscribeResize = (callback: () => void) => {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};
const getMobileSnapshot = () => window.innerWidth < 768;
const getServerSnapshot = () => false;

export function CaseDossierExploded() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = framerUseReducedMotion();
  const isMobile = useSyncExternalStore(
    subscribeResize,
    getMobileSnapshot,
    getServerSnapshot,
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [testStage] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("stage");
    }
    return null;
  });

  const manualProgress = useMotionValue(
    testStage === "exploded" ? 0.42 : testStage === "challenge" ? 0.95 : 0,
  );

  const sourceProgress = testStage ? manualProgress : scrollYProgress;

  const smoothProgress = useSpring(sourceProgress, {
    stiffness: 75,
    damping: 24,
    mass: 0.8,
  });

  // Central dossier scaling: starts at 1, breathes slightly during explosion, locks at 0.95
  const dossierScale = useTransform(
    smoothProgress,
    [0, 0.2, 0.45, 0.72, 1],
    [1, 0.92, 0.88, 0.94, 0.96],
  );

  // Challenge text opacity and translation
  const dossierContentOpacity = useTransform(
    smoothProgress,
    [0.68, 0.8],
    [1, 0],
  );

  const challengeOpacity = useTransform(
    smoothProgress,
    [0.68, 0.82, 0.95, 1],
    [0, 1, 1, 1],
  );
  const challengeY = useTransform(
    smoothProgress,
    [0.68, 0.82],
    ["40px", "0px"],
  );

  const ctaOpacity = useTransform(smoothProgress, [0.76, 0.88, 1], [0, 1, 1]);

  const accentWidth = useTransform(smoothProgress, [0.7, 0.88], ["0%", "100%"]);

  // Scroll indicator fades out early as user starts scrolling
  const scrollIndicatorOpacity = useTransform(
    smoothProgress,
    [0, 0.08],
    [1, 0],
  );

  if (prefersReducedMotion) {
    return <ReducedMotionFallback />;
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: "350vh" }}
      aria-label="Victorian forensic investigation sequence"
    >
      {/* Sticky Fullscreen Investigation Viewport */}
      <div className="sticky top-0 relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-umber select-none">
        {/* Atmospheric ambient lighting & gaslamp glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 85% at 50% 50%, rgba(26,17,12,0.6) 0%, rgba(13,9,7,0.96) 100%)",
          }}
        />

        {/* Gaslamp beam centered above desk */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 z-0 h-96 w-96 -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(242,163,58,0.16) 0%, rgba(163,32,26,0.06) 45%, transparent 75%)",
            filter: "blur(50px)",
          }}
        />

        {/* SVG Dynamic Red Evidence Yarn Threads */}
        <EvidenceYarnBoard
          artifacts={ARTIFACTS}
          progress={smoothProgress}
          isMobile={isMobile}
        />

        {/* Central Investigation Dossier (Centered at 50%, 50%) */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <motion.div
            className="relative flex flex-col items-center justify-center pointer-events-none"
            style={{ scale: dossierScale }}
          >
            {/* Victorian Case Dossier Folder */}
            <div
              className="pointer-events-auto relative z-20 flex w-[285px] sm:w-[350px] md:w-[410px] flex-col justify-between rounded-sm border border-amber/35 p-5 sm:p-7 md:p-8"
              style={{
                minHeight: isMobile ? "400px" : "480px",
                background:
                  "linear-gradient(145deg, #22150e 0%, #160d08 45%, #0e0805 100%)",
                boxShadow:
                  "0 20px 60px rgba(13,9,7,0.85), 0 0 45px rgba(163,32,26,0.2), inset 0 1px 0 rgba(242,163,58,0.22), inset 0 0 20px rgba(13,9,7,0.8)",
              }}
            >
              {/* Brass Corner Protectors */}
              <div className="pointer-events-none absolute top-1.5 left-1.5 h-4 w-4 border-t-2 border-l-2 border-amber/60" />
              <div className="pointer-events-none absolute top-1.5 right-1.5 h-4 w-4 border-t-2 border-r-2 border-amber/60" />
              <div className="pointer-events-none absolute bottom-1.5 left-1.5 h-4 w-4 border-b-2 border-l-2 border-amber/60" />
              <div className="pointer-events-none absolute bottom-1.5 right-1.5 h-4 w-4 border-b-2 border-r-2 border-amber/60" />

              {/* Prominent Crimson Wax Seal at Top */}
              <div
                className="absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full font-serif text-lg font-bold text-parchment shadow-xl"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, #b31335 0%, #781329 55%, #0d0907 100%)",
                  border: "2px solid #a3201a",
                  boxShadow:
                    "inset 0 2px 5px rgba(233,220,192,0.3), 0 6px 16px rgba(13,9,7,0.8), 0 0 14px rgba(179,19,53,0.4)",
                }}
              >
                §
              </div>

              {/* Initial Dossier Classification & Synopsis (Dissolves cleanly during final challenge) */}
              <motion.div
                className="flex h-full flex-col justify-between"
                style={{ opacity: dossierContentOpacity }}
              >
                {/* Header: Folder Tab & Classification */}
                <div className="pt-3 text-center border-b border-amber/20 pb-4">
                  <div className="font-archival text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-amber/80 font-bold">
                    Scotland Yard Special Branch
                  </div>
                  <div className="mt-1.5 font-display text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide text-parchment">
                    THE FINAL TRUTH
                  </div>
                  <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-parchment/45">
                    DOSSIER ARCHIVE REF: 221B-ELECZZA-005
                  </div>
                </div>

                {/* Center: Detective Insignia & Synopsis */}
                <div className="my-auto py-5 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-amber/30 bg-surface/80 shadow-inner">
                    <Search className="h-7 w-7 text-amber" strokeWidth={1.5} />
                  </div>
                  <div className="font-archival text-[10px] font-bold uppercase tracking-[0.22em] text-amber/70">
                    Primary Investigation File
                  </div>
                  <p className="mt-2 font-serif text-xs sm:text-sm leading-relaxed text-parchment/75 px-3">
                    Professor Moriarty&apos;s encrypted cipher network has been
                    breached. Six forensic evidence packets are locked within
                    this registry.
                  </p>
                </div>

                {/* Bottom: Classified Rubber Stamp & Signature */}
                <div className="border-t border-amber/20 pt-4 text-center">
                  <div
                    className="inline-block rounded px-3 py-1 font-mono text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-wax-foreground"
                    style={{
                      border: "2px solid #a3201a",
                      transform: "rotate(-3deg)",
                      background: "rgba(163,32,26,0.2)",
                      boxShadow: "0 0 10px rgba(163,32,26,0.25)",
                    }}
                  >
                    RESTRICTED • CONFIDENTIAL DISPATCH
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[8px] sm:text-[9px] font-archival uppercase tracking-wider text-parchment/40 px-2">
                    <span>Examiner: S. Holmes</span>
                    <span>Date: 17 Nov 1895</span>
                  </div>
                </div>
              </motion.div>

              {/* Final Challenge Overlay inside the Case Binder */}
              <motion.div
                className="pointer-events-auto absolute inset-0 z-30 flex flex-col items-center justify-center p-6 sm:p-8 text-center"
                style={{
                  opacity: challengeOpacity,
                  y: challengeY,
                }}
              >
                {/* Animated Crimson Divider */}
                <div className="relative mb-3 h-0.5 w-40 sm:w-48 overflow-hidden bg-wax/20 rounded-full">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber via-wax to-crimson"
                    style={{ width: accentWidth }}
                  />
                </div>

                <div className="font-archival text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-amber/80 font-bold">
                  The Final Deduction
                </div>

                <h2
                  className="mt-2 font-display text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight text-parchment"
                  style={{ textShadow: "0 0 35px rgba(163,32,26,0.4)" }}
                >
                  DO YOU HAVE
                  <br />
                  <span className="text-wax-foreground">WHAT IT TAKES?</span>
                </h2>

                <p className="mt-3 max-w-xs font-serif text-xs sm:text-sm leading-relaxed text-parchment/80">
                  Every clue has a purpose. Every deduction has a consequence.
                </p>

                {/* Enter the Case LightBeamButton */}
                <motion.div
                  className="mt-6 w-full max-w-xs"
                  style={{ opacity: ctaOpacity }}
                >
                  <Link href="/dashboard" className="block w-full">
                    <LightBeamButton className="w-full shadow-2xl">
                      <span className="flex items-center justify-center gap-2">
                        Enter The Case
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </LightBeamButton>
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* 6 Forensic Evidence Cards flying outward (Anchored to true center) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              {ARTIFACTS.map((artifact) => (
                <EvidenceArtifactCard
                  key={artifact.id}
                  artifact={artifact}
                  progress={smoothProgress}
                  isMobile={isMobile}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll To Unseal Indicator (visible at start) */}
        <motion.div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <span className="font-archival text-[9px] uppercase tracking-[0.25em] text-parchment/50 font-semibold">
            Scroll to unseal the archives
          </span>
          <div className="h-6 w-px animate-pulse bg-gradient-to-b from-amber to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Individual Evidence Artifact Component (Pixel-Positioned)
------------------------------------------------------------------ */

function EvidenceArtifactCard({
  artifact,
  progress,
  isMobile,
}: {
  artifact: EvidenceArtifactDef;
  progress: ReturnType<typeof useSpring>;
  isMobile: boolean;
}) {
  const explodeStart = 0.12 + artifact.delay;
  const explodePeak = 0.42 + artifact.delay * 0.2;
  const reassembleEnd = 0.76;

  const initX = isMobile ? artifact.mobileX * 0.12 : artifact.initialX;
  const initY = isMobile ? artifact.mobileY * 0.12 : artifact.initialY;
  const targetX = isMobile ? artifact.mobileX : artifact.desktopX;
  const targetY = isMobile ? artifact.mobileY : artifact.desktopY;

  // Real pixel translations from initial tucked positions to exploded layout and back
  const x = useTransform(
    progress,
    [0, explodeStart, explodePeak, reassembleEnd],
    [initX, targetX, targetX, initX],
  );
  const y = useTransform(
    progress,
    [0, explodeStart, explodePeak, reassembleEnd],
    [initY, targetY, targetY, initY],
  );
  const rotate = useTransform(
    progress,
    [0, explodeStart, explodePeak, reassembleEnd],
    [
      artifact.rotation * 0.5,
      artifact.rotation,
      artifact.rotation,
      artifact.rotation * 0.5,
    ],
  );

  // When assembled at progress 0, artifacts are visible behind the folder edges
  // During explosion, they scale up to 1 and full opacity
  // During final challenge (progress > 0.85), they smoothly dim for the challenge CTA
  const opacity = useTransform(
    progress,
    [0, 0.08, explodeStart, explodePeak, reassembleEnd, 0.88],
    [0.9, 0.95, 1, 1, 0.9, 0.05],
  );

  const scale = useTransform(
    progress,
    [0, explodeStart, explodePeak * 0.7, reassembleEnd, 0.92],
    [0.82, 1, 1, 0.82, 0.4],
  );

  return (
    <motion.div
      className="pointer-events-none absolute z-10 flex flex-col items-center"
      style={{
        x,
        y,
        rotate,
        opacity,
        scale,
      }}
      aria-hidden="true"
    >
      {/* Authentic Victorian Forensic Evidence Card */}
      <div
        className="w-[170px] sm:w-[220px] md:w-[260px] rounded-sm border border-amber/30 p-2.5 sm:p-4 backdrop-blur-md transition-shadow"
        style={{
          background:
            "linear-gradient(145deg, rgba(26,17,12,0.96) 0%, rgba(13,9,7,0.94) 100%)",
          boxShadow:
            "0 12px 32px rgba(13,9,7,0.8), 0 0 20px rgba(163,32,26,0.15), inset 0 1px 0 rgba(242,163,58,0.18)",
        }}
      >
        {/* Card Header with Tack Pin & Tag */}
        <div className="flex items-center justify-between border-b border-parchment/15 pb-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber/80 shadow-sm" />
            <span
              className={`font-archival text-[8px] sm:text-[9px] uppercase tracking-wider font-bold ${artifact.tagColor}`}
            >
              {artifact.tag}
            </span>
          </div>
          <span className="font-mono text-[7px] text-parchment/40">
            REF-{artifact.id.slice(0, 4).toUpperCase()}
          </span>
        </div>

        {/* Card Forensic Content according to artifact type */}
        {artifact.type === "docket" && (
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs sm:text-sm font-bold text-parchment">
                Moriarty Syndicate
              </span>
              <FileText className="h-3.5 w-3.5 text-amber/70" />
            </div>
            <p className="font-mono text-[8px] leading-relaxed text-parchment/70">
              Primary antagonist docket. Cryptographic keys seized from
              Whitechapel telegraph exchange.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="rounded bg-wax/25 px-1.5 py-0.5 font-mono text-[7px] font-bold text-wax-foreground border border-wax/40">
                ACTIVE WARRANT
              </span>
              <span className="font-archival text-[7px] text-amber/60">
                YARD FILE #005
              </span>
            </div>
          </div>
        )}

        {artifact.type === "newspaper" && (
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs sm:text-sm font-bold text-parchment">
                The Royal Exchange Heist
              </span>
              <Newspaper className="h-3.5 w-3.5 text-amber/70" />
            </div>
            <p className="font-serif text-[9px] leading-relaxed text-parchment/75 italic">
              &ldquo;Cryptographic wires tampered across the City. Scotland Yard
              appeals to Baker Street for counsel.&rdquo;
            </p>
            <div className="font-archival text-[7px] uppercase tracking-widest text-amber/60 pt-0.5">
              LONDON • 17 NOVEMBER 1895
            </div>
          </div>
        )}

        {artifact.type === "cipher" && (
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs sm:text-sm font-bold text-amber">
                Mechanical Decoder
              </span>
              <Key className="h-3.5 w-3.5 text-amber" />
            </div>
            <div className="rounded bg-surface/80 p-1.5 border border-amber/20 font-mono text-[8px] text-parchment/90">
              ROT-13: REICHENBACH
              <div className="text-[7px] text-amber/70">
                GRID: 4E 6F 72 74 68
              </div>
            </div>
            <div className="font-archival text-[7px] uppercase tracking-wider text-parchment/50">
              ALGORITHM CONFIRMED ACTIVE
            </div>
          </div>
        )}

        {artifact.type === "envelope" && (
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs sm:text-sm font-bold text-wax-foreground">
                Courier Dispatch
              </span>
              <Mail className="h-3.5 w-3.5 text-wax-foreground" />
            </div>
            <p className="font-script text-sm sm:text-base text-amber/90 leading-none">
              To Mr. Sherlock Holmes, 221B Baker St.
            </p>
            <div className="flex items-center justify-between pt-1 font-mono text-[7px] text-parchment/50">
              <span>WAX SEAL INTACT</span>
              <span className="text-wax-foreground font-bold">URGENT</span>
            </div>
          </div>
        )}

        {artifact.type === "loupe" && (
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs sm:text-sm font-bold text-amber">
                Forensic Loupe
              </span>
              <Search className="h-3.5 w-3.5 text-amber" />
            </div>
            <div className="flex items-center gap-2 rounded bg-surface/70 p-1.5 border border-amber/20">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber/50 bg-amber/10 font-mono text-[9px] text-amber font-bold">
                §
              </div>
              <div className="font-mono text-[8px] text-parchment/90">
                LAT 51.5237° N
                <div className="text-[7px] text-amber/60">LON 0.1585° W</div>
              </div>
            </div>
          </div>
        )}

        {artifact.type === "map" && (
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs sm:text-sm font-bold text-parchment">
                London Sector 4
              </span>
              <MapPin className="h-3.5 w-3.5 text-wax-foreground" />
            </div>
            <div className="h-1.5 w-full rounded-full bg-wax/20 overflow-hidden">
              <div className="h-full w-3/4 bg-wax" />
            </div>
            <div className="flex items-center justify-between font-mono text-[7px] text-parchment/50">
              <span>221B Baker St Marker</span>
              <span className="text-amber">Pinpoint Locked</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------
   SVG Evidence Red Yarn Connecting Thread Board
------------------------------------------------------------------ */

function EvidenceYarnBoard({
  artifacts,
  progress,
  isMobile,
}: {
  artifacts: EvidenceArtifactDef[];
  progress: ReturnType<typeof useSpring>;
  isMobile: boolean;
}) {
  const explodeStart = 0.12;
  const reassembleEnd = 0.76;

  // Red yarn lines expand as evidence separates outward
  const lineProgress = useTransform(
    progress,
    [0, explodeStart, 0.42, reassembleEnd],
    [0, 0, 1, 0],
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 z-15 -translate-x-1/2 -translate-y-1/2 overflow-visible"
    >
      <svg className="overflow-visible" style={{ width: "1px", height: "1px" }}>
        {artifacts.map((art) => (
          <YarnLine
            key={art.id}
            artifact={art}
            lineProgress={lineProgress}
            isMobile={isMobile}
          />
        ))}
      </svg>
    </div>
  );
}

function YarnLine({
  artifact,
  lineProgress,
  isMobile,
}: {
  artifact: EvidenceArtifactDef;
  lineProgress: import("framer-motion").MotionValue<number>;
  isMobile: boolean;
}) {
  const targetX = isMobile ? artifact.mobileX : artifact.desktopX;
  const targetY = isMobile ? artifact.mobileY : artifact.desktopY;

  const pathD = useTransform(
    lineProgress,
    [0, 1],
    ["M 0 0 L 0 0", `M 0 0 L ${targetX} ${targetY}`],
  );
  const opacity = useTransform(
    lineProgress,
    [0, 0.15, 0.85, 1],
    [0, 0.85, 0.85, 0.85],
  );

  return (
    <g>
      <motion.path
        d={pathD}
        stroke="rgba(179, 19, 53, 0.75)"
        strokeWidth={1.5}
        strokeDasharray="4 3"
        style={{ opacity }}
      />
      <motion.circle
        cx={targetX}
        cy={targetY}
        r={2.5}
        fill="#f2a33a"
        style={{ opacity }}
      />
    </g>
  );
}

/* ------------------------------------------------------------------
   Reduced Motion Fallback (Accessible non-scroll experience)
------------------------------------------------------------------ */

function ReducedMotionFallback() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-umber px-6 py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-amber/35 bg-surface shadow-2xl">
        <Search className="h-10 w-10 text-amber" strokeWidth={1.5} />
      </div>
      <div className="font-archival text-xs uppercase tracking-[0.28em] text-amber/80 font-bold">
        Baker Street Archives • Case Dossier #005
      </div>
      <h2 className="mt-2 font-display text-4xl sm:text-5xl font-black text-parchment leading-tight">
        DO YOU HAVE <span className="text-wax-foreground">WHAT IT TAKES?</span>
      </h2>
      <p className="mt-3 font-serif text-lg text-parchment/80 max-w-md">
        Every clue has a purpose. Every deduction has a consequence.
      </p>
      <div className="mt-8">
        <Link href="/dashboard">
          <LightBeamButton className="min-w-[240px]">
            <span className="flex items-center justify-center gap-2">
              Enter The Case
              <ArrowRight className="h-4 w-4" />
            </span>
          </LightBeamButton>
        </Link>
      </div>
    </section>
  );
}
