"use client";

import * as React from "react";
import { FogBackground } from "@/components/theme/fog-background";
import { CaseFileCard } from "@/components/theme/case-file-card";
import { BrassButton } from "@/components/theme/brass-button";
import { MagnifierLoader } from "@/components/theme/magnifier-loader";
import { TypewriterText } from "@/components/theme/typewriter-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, stampIn, stagger } from "@/lib/motion";
import {
  ShieldAlert,
  Send,
  Bell,
  RefreshCw,
  CheckCircle2,
  FileQuestion,
  Sparkles,
} from "lucide-react";

export default function StyleguidePage() {
  const [typewriterKey, setTypewriterKey] = React.useState(0);
  const [stampKey, setStampKey] = React.useState(0);

  return (
    <div className="relative min-h-screen text-[#F4EBD9] pb-24">
      <FogBackground density="medium" />

      {/* Styleguide Header */}
      <header className="sticky top-0 z-40 border-b border-[#2D3344] bg-[#0B0C10]/90 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded border border-[#DFB75A] bg-[#12151C] text-[#DFB75A] font-bold font-serif">
              §
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold tracking-wider text-[#F7F2E7]">
                ELECZZA 2.0 Styleguide
              </h1>
              <p className="text-[10px] uppercase font-mono tracking-widest text-[#DFB75A]">
                Sherlock Holmes & Scotland Yard Design System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <BrassButton
              size="sm"
              onClick={() => {
                toast("Scotland Yard Wire Despatch", {
                  description:
                    "All operatives: Telegram alert received from 221B Baker St.",
                });
              }}
            >
              Test Telegram Wire
            </BrassButton>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pt-10 space-y-16">
        {/* Section 1: Color Tokens */}
        <section className="space-y-6">
          <div className="border-b border-[#2D3344] pb-3">
            <span className="font-mono text-xs text-[#DFB75A] uppercase tracking-widest">
              01 // Palette & Tokens
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#F7F2E7]">
              Victorian Noir Palette
            </h2>
          </div>

          {/* Charcoal */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#D9CEB8] mb-3">
              Deep Charcoal & Base Surfaces
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded border border-[#2D3344] bg-[#0B0C10] p-4">
                <div className="h-10 rounded bg-[#0B0C10] border border-white/10" />
                <div className="mt-2 font-mono text-xs font-bold text-[#F7F2E7]">
                  charcoal-950
                </div>
                <div className="text-[10px] text-[#4E5569]">
                  #0B0C10 • Base Night
                </div>
              </div>
              <div className="rounded border border-[#2D3344] bg-[#0B0C10] p-4">
                <div className="h-10 rounded bg-[#12151C] border border-white/10" />
                <div className="mt-2 font-mono text-xs font-bold text-[#F7F2E7]">
                  charcoal-900
                </div>
                <div className="text-[10px] text-[#4E5569]">
                  #12151C • Dossier Panel
                </div>
              </div>
              <div className="rounded border border-[#2D3344] bg-[#0B0C10] p-4">
                <div className="h-10 rounded bg-[#161922] border border-white/10" />
                <div className="mt-2 font-mono text-xs font-bold text-[#F7F2E7]">
                  charcoal-850
                </div>
                <div className="text-[10px] text-[#4E5569]">
                  #161922 • Inset Container
                </div>
              </div>
              <div className="rounded border border-[#2D3344] bg-[#0B0C10] p-4">
                <div className="h-10 rounded bg-[#1C202B] border border-white/10" />
                <div className="mt-2 font-mono text-xs font-bold text-[#F7F2E7]">
                  charcoal-800
                </div>
                <div className="text-[10px] text-[#4E5569]">
                  #1C202B • Hovered Surface
                </div>
              </div>
            </div>
          </div>

          {/* Oxblood & Brass */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#D9CEB8] mb-3">
                Oxblood & Sealing Wax
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded border border-[#2D3344] bg-[#0B0C10] p-3 text-center">
                  <div className="h-8 rounded bg-[#3D0B0E]" />
                  <div className="mt-1 text-[11px] font-mono text-[#F7F2E7]">
                    #3D0B0E
                  </div>
                  <div className="text-[9px] text-[#4E5569]">Oxblood 900</div>
                </div>
                <div className="rounded border border-[#2D3344] bg-[#0B0C10] p-3 text-center">
                  <div className="h-8 rounded bg-[#8B1E22]" />
                  <div className="mt-1 text-[11px] font-mono text-[#F7F2E7]">
                    #8B1E22
                  </div>
                  <div className="text-[9px] text-[#4E5569]">Oxblood 600</div>
                </div>
                <div className="rounded border border-[#2D3344] bg-[#0B0C10] p-3 text-center">
                  <div className="h-8 rounded bg-[#A8262B]" />
                  <div className="mt-1 text-[11px] font-mono text-[#F7F2E7]">
                    #A8262B
                  </div>
                  <div className="text-[9px] text-[#4E5569]">Wax 500</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#D9CEB8] mb-3">
                Gaslamp Brass & Gold
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded border border-[#2D3344] bg-[#0B0C10] p-3 text-center">
                  <div className="h-8 rounded bg-[#F3D88C]" />
                  <div className="mt-1 text-[11px] font-mono text-[#F7F2E7]">
                    #F3D88C
                  </div>
                  <div className="text-[9px] text-[#4E5569]">Glow 300</div>
                </div>
                <div className="rounded border border-[#2D3344] bg-[#0B0C10] p-3 text-center">
                  <div className="h-8 rounded bg-[#DFB75A]" />
                  <div className="mt-1 text-[11px] font-mono text-[#F7F2E7]">
                    #DFB75A
                  </div>
                  <div className="text-[9px] text-[#4E5569]">Brass 400</div>
                </div>
                <div className="rounded border border-[#2D3344] bg-[#0B0C10] p-3 text-center">
                  <div className="h-8 rounded bg-[#9B7728]" />
                  <div className="mt-1 text-[11px] font-mono text-[#F7F2E7]">
                    #9B7728
                  </div>
                  <div className="text-[9px] text-[#4E5569]">Antique 600</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Typography */}
        <section className="space-y-6">
          <div className="border-b border-[#2D3344] pb-3">
            <span className="font-mono text-xs text-[#DFB75A] uppercase tracking-widest">
              02 // Typography Hierarchy
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#F7F2E7]">
              Playfair Display, Inter & Special Elite
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="parchment-border rounded-lg bg-[#12151C] p-6 space-y-3">
              <span className="text-[10px] font-mono text-[#DFB75A] uppercase tracking-widest">
                Display Serif • Playfair Display
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#F7F2E7]">
                Case File #042: The Copper Beeches
              </h3>
              <p className="font-serif text-sm italic text-[#D9CEB8]">
                &ldquo;It is a capital mistake to theorize before one has
                data.&rdquo;
              </p>
            </div>

            <div className="parchment-border rounded-lg bg-[#12151C] p-6 space-y-3">
              <span className="text-[10px] font-mono text-[#DFB75A] uppercase tracking-widest">
                Body Sans • Inter
              </span>
              <p className="text-sm text-[#F4EBD9] leading-relaxed">
                The Academy of Technology investigation portal ensures maximum
                clarity, fast navigation, and precise question rendering during
                high-speed competitive deduction rounds.
              </p>
            </div>

            <div className="parchment-border rounded-lg bg-[#12151C] p-6 space-y-3">
              <span className="text-[10px] font-mono text-[#DFB75A] uppercase tracking-widest">
                Typewriter Mono • Special Elite
              </span>
              <div className="font-mono text-xs text-[#DFB75A] space-y-1">
                <div>[TELEGRAM WIRE #1892]</div>
                <div>CIPHER: AES-GCM-256</div>
                <div>ORIGIN: 221B BAKER ST</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Re-skinned Shadcn Component Inventory */}
        <section className="space-y-6">
          <div className="border-b border-[#2D3344] pb-3">
            <span className="font-mono text-xs text-[#DFB75A] uppercase tracking-widest">
              03 // Shadcn Re-Skinning
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#F7F2E7]">
              Core Component Inventory
            </h2>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#D9CEB8]">
              Button Variants & States
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="default">Default Brass</Button>
              <Button variant="brass">Burnished Brass</Button>
              <Button variant="oxblood">Oxblood Wax</Button>
              <Button variant="outline">Parchment Outline</Button>
              <Button variant="secondary">Secondary Charcoal</Button>
              <Button variant="ghost">Ghost State</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Detective Link</Button>
            </div>
          </div>

          {/* Inputs & Labels */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="parchment-border rounded-lg bg-[#12151C] p-6 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#DFB75A]">
                Input Fields & Labels
              </h3>
              <div className="space-y-1">
                <Label htmlFor="inspector-id">Inspector Identity Badge</Label>
                <Input
                  id="inspector-id"
                  placeholder="inspector@aot.edu.in"
                  defaultValue="sherlock@aot.edu.in"
                />
                <span className="text-[11px] text-[#4E5569]">
                  Must be verified under @aot.edu.in domain
                </span>
              </div>

              <div className="space-y-1">
                <Label htmlFor="cipher-input">Cipher Extraction Key</Label>
                <Input
                  id="cipher-input"
                  className="font-mono"
                  placeholder="Enter decrypted string..."
                />
              </div>
            </div>

            {/* Alerts */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#DFB75A]">
                Alerts & Dispatches
              </h3>
              <Alert variant="default">
                <Bell className="h-4 w-4" />
                <AlertTitle>Scotland Yard Bulletin</AlertTitle>
                <AlertDescription>
                  Case Zero is scheduled to unlock in 14 minutes. Synchronize
                  watches.
                </AlertDescription>
              </Alert>

              <Alert variant="oxblood">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Critical Evidence Tamper Warning</AlertTitle>
                <AlertDescription>
                  Incorrect deduction files result in a -50 pt penalty to your
                  agency score.
                </AlertDescription>
              </Alert>

              <Alert variant="solved">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Deduction Verified</AlertTitle>
                <AlertDescription>
                  Elementary! The cipher matches the North Wing laboratory log.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Cards, Skeletons & Dialogs */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Standard Card */}
            <Card>
              <CardHeader>
                <CardTitle>Case File Summary</CardTitle>
                <CardDescription>
                  Archived at Scotland Yard Bureau
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-[#D9CEB8]">
                Examine physical evidence including muddy footprint casts,
                encrypted telegrams, and spectrographic data.
              </CardContent>
              <CardFooter className="justify-between">
                <span className="font-mono text-xs text-[#DFB75A]">
                  300 pts
                </span>
                <Button size="sm" variant="outline">
                  Inspect
                </Button>
              </CardFooter>
            </Card>

            {/* Skeleton Loaders */}
            <div className="parchment-border rounded-lg bg-[#12151C] p-6 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#DFB75A]">
                Gaslamp Skeleton Pulse
              </h3>
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
              <div className="pt-2 flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 flex-1" />
              </div>
            </div>

            {/* Dialog Trigger */}
            <div className="parchment-border rounded-lg bg-[#12151C] p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#DFB75A]">
                  Scotland Yard Interrogation Modal
                </h3>
                <p className="mt-2 text-xs text-[#D9CEB8] leading-relaxed">
                  Modal dialog equipped with backdrop fog mist, accessible focus
                  trapping, and brass accents.
                </p>
              </div>

              <Dialog>
                <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:translate-y-[1px] bg-gradient-to-b from-[#F3D88C] via-[#DFB75A] to-[#9B7728] text-[#0B0C10] border border-[#F3D88C]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.6)] hover:brightness-110 active:brightness-95 h-9 px-4 py-2 mt-4 w-full">
                  Summon Interrogation Dialog
                </DialogTrigger>
                <DialogPopup>
                  <DialogHeader>
                    <DialogTitle>Interrogate Suspect Statement</DialogTitle>
                    <DialogDescription>
                      Document #S-418 • Recorded at 221B Baker St. Study
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-2 text-xs text-[#D9CEB8] leading-relaxed space-y-2">
                    <p>
                      &ldquo;I was in the observatory until midnight. If there
                      was a broadcast, it could only have originated from the
                      telegraph annex.&rdquo;
                    </p>
                    <div className="p-3 bg-[#0B0C10] border border-[#2D3344] font-mono text-[11px] text-[#DFB75A] rounded">
                      SPECTROGRAPH_SIGNATURE: 0x4A1F82B
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[11px] font-semibold uppercase tracking-wider transition-all select-none cursor-pointer bg-[#1C202B] text-[#F4EBD9] border border-[#2D3344] hover:bg-[#2D3344]/70 h-8 px-3">
                      Dismiss
                    </DialogClose>
                    <Button variant="default" size="sm">
                      Cross-Examine
                    </Button>
                  </DialogFooter>
                </DialogPopup>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Section 4: Bespoke Themed Pieces */}
        <section className="space-y-6">
          <div className="border-b border-[#2D3344] pb-3">
            <span className="font-mono text-xs text-[#DFB75A] uppercase tracking-widest">
              04 // Bespoke Themed Elements
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#F7F2E7]">
              Sherlock Holmes & 221B Themed Pieces
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* CaseFileCard */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#D9CEB8]">
                  CaseFileCard
                </span>
                <button
                  type="button"
                  onClick={() => setStampKey((prev) => prev + 1)}
                  className="text-[10px] text-[#DFB75A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" /> Re-stamp
                </button>
              </div>
              <AnimatePresence mode="wait">
                <CaseFileCard
                  key={stampKey}
                  caseNumber="402"
                  title="The Adventure of the Red Circle"
                  synopsis="A mysterious lodger in Bloomsbury signals through high-frequency candle oscillations and encrypted teletype bursts."
                  difficulty="Puzzling"
                  points={750}
                  durationMinutes={60}
                  action={
                    <BrassButton size="sm" withLoupe>
                      Examine
                    </BrassButton>
                  }
                />
              </AnimatePresence>
            </div>

            {/* Brass Buttons & Wax Seals */}
            <div className="parchment-border rounded-lg bg-[#12151C] p-6 space-y-5">
              <span className="text-xs font-mono text-[#D9CEB8]">
                BrassButton & Wax Seals
              </span>
              <div className="flex flex-col gap-3">
                <BrassButton size="lg" withLoupe>
                  Inspect Case Dossier
                </BrassButton>
                <BrassButton size="md">Submit Forensic Deduction</BrassButton>
                <div className="flex items-center gap-3 pt-2">
                  <div className="wax-seal flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-[#FBF8F1]">
                    221B
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-[#F7F2E7]">
                      Crimson Wax Seal
                    </div>
                    <div className="text-[10px] text-[#D9CEB8]">
                      Authentic Scotland Yard Mark
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Magnifier Loader & Typewriter Text */}
            <div className="parchment-border rounded-lg bg-[#12151C] p-6 space-y-4">
              <span className="text-xs font-mono text-[#D9CEB8]">
                MagnifierLoader & TypewriterText
              </span>

              <div className="border border-[#2D3344] bg-[#0B0C10] rounded-md p-4 flex flex-col items-center">
                <MagnifierLoader label="Sifting London Archives..." size="md" />
              </div>

              <div className="border border-[#2D3344] bg-[#0B0C10] rounded-md p-4 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#DFB75A]">
                    TELEX BROADCAST:
                  </span>
                  <button
                    type="button"
                    onClick={() => setTypewriterKey((prev) => prev + 1)}
                    className="text-[10px] text-[#DFB75A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Replay
                  </button>
                </div>
                <TypewriterText
                  key={typewriterKey}
                  text="When you have eliminated the impossible, whatever remains, however improbable, must be the truth."
                  speedMs={30}
                  className="text-[#D9CEB8] text-xs"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Motion Presets Lab */}
        <section className="space-y-6">
          <div className="border-b border-[#2D3344] pb-3">
            <span className="font-mono text-xs text-[#DFB75A] uppercase tracking-widest">
              05 // Motion Presets Laboratory
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#F7F2E7]">
              Framer Motion Animation Presets
            </h2>
          </div>

          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid gap-4 sm:grid-cols-3"
          >
            <motion.div
              variants={fadeUp}
              className="parchment-border rounded-lg bg-[#12151C] p-5 space-y-2"
            >
              <div className="flex items-center gap-2 text-[#DFB75A]">
                <Sparkles className="h-4 w-4" />
                <span className="font-mono text-xs font-bold uppercase">
                  Preset: fadeUp
                </span>
              </div>
              <p className="text-xs text-[#D9CEB8]">
                Smooth vertical ascent (+14px $\rightarrow$ 0) with snappy
                cubic-bezier curve.
              </p>
            </motion.div>

            <motion.div
              variants={stampIn}
              className="parchment-border rounded-lg bg-[#12151C] p-5 space-y-2"
            >
              <div className="flex items-center gap-2 text-[#FF9B9F]">
                <FileQuestion className="h-4 w-4" />
                <span className="font-mono text-xs font-bold uppercase">
                  Preset: stampIn
                </span>
              </div>
              <p className="text-xs text-[#D9CEB8]">
                Recoil spring simulation: scale 1.8 $\rightarrow$ 1.0 with -6
                deg rotational lock.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="parchment-border rounded-lg bg-[#12151C] p-5 space-y-2"
            >
              <div className="flex items-center gap-2 text-[#DFB75A]">
                <Send className="h-4 w-4" />
                <span className="font-mono text-xs font-bold uppercase">
                  Preset: stagger
                </span>
              </div>
              <p className="text-xs text-[#D9CEB8]">
                Cascading stagger sequence across child nodes with 0.08s
                interval spacing.
              </p>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
