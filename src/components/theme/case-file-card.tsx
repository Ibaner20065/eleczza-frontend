"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { FolderLock, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { stampIn } from "@/lib/motion";

export interface CaseFileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  caseNumber?: string;
  title: string;
  synopsis: string;
  points?: number;
  durationMinutes?: number;
  difficulty?: "Elementary" | "Puzzling" | "Labyrinthine" | "Moriarty";
  stampText?: string;
  action?: React.ReactNode;
}

export function CaseFileCard({
  caseNumber = "221B",
  title,
  synopsis,
  points = 500,
  durationMinutes = 45,
  difficulty = "Elementary",
  stampText = "CONFIDENTIAL",
  action,
  className,
  ...props
}: CaseFileCardProps) {
  return (
    <div
      className={cn(
        "paper-texture relative overflow-hidden rounded-lg p-6 shadow-xl transition-all duration-200 hover:border-[#DFB75A]/60",
        className,
      )}
      {...props}
    >
      {/* Brass Corner Rivets */}
      <span
        aria-hidden="true"
        className="absolute top-2 left-2 h-1.5 w-1.5 rounded-full bg-[#DFB75A]/60 shadow-[0_0_2px_#000]"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-[#DFB75A]/60 shadow-[0_0_2px_#000]"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-[#DFB75A]/60 shadow-[0_0_2px_#000]"
      />

      {/* Stamped Corner Badge */}
      {stampText && (
        <div className="absolute -top-1 -right-2 select-none pointer-events-none">
          <motion.div
            variants={stampIn}
            initial="initial"
            animate="animate"
            className="ink-stamp border-[#8B1E22] text-[#C93B41] text-[10px] tracking-widest bg-[#3D0B0E]/70 px-2.5 py-0.5 rounded shadow-sm"
          >
            {stampText}
          </motion.div>
        </div>
      )}

      {/* Header Metadata */}
      <div className="flex items-center gap-2 text-xs font-mono text-[#DFB75A]">
        <FolderLock className="h-4 w-4" />
        <span>DOSSIER #{caseNumber}</span>
        <span className="text-[#4E5569]">•</span>
        <span className="text-[#D9CEB8] uppercase">{difficulty}</span>
      </div>

      {/* Case Title */}
      <h3 className="mt-3 font-serif text-xl font-bold tracking-tight text-[#F7F2E7] hover:text-[#DFB75A] transition-colors">
        {title}
      </h3>

      {/* Synopsis */}
      <p className="mt-2 text-xs text-[#D9CEB8] leading-relaxed line-clamp-3">
        {synopsis}
      </p>

      {/* Footer Info */}
      <div className="mt-6 flex items-center justify-between border-t border-[#2D3344]/50 pt-4 text-xs text-[#D9CEB8]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-mono text-[#DFB75A]">
            <Award className="h-3.5 w-3.5" />
            {points} pts
          </span>
          <span className="flex items-center gap-1 font-mono">
            <Clock className="h-3.5 w-3.5 text-[#4E5569]" />
            {durationMinutes}m
          </span>
        </div>

        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
