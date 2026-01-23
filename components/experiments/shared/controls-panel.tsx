"use client";

import { ReactNode } from "react";

interface ControlsPanelProps {
  children: ReactNode;
  className?: string;
}

export function ControlsPanel({ children, className = "" }: ControlsPanelProps) {
  return (
    <div
      className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 
      bg-black/70 backdrop-blur-lg border border-white/10 rounded-2xl p-4
      flex flex-col gap-3 z-10 ${className}`}
    >
      {children}
    </div>
  );
}
