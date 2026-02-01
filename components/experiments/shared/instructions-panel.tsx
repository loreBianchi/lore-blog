"use client";

import { ReactNode } from "react";

interface InstructionItem {
  icon: string;
  text: string;
  color: string;
}

interface InstructionsPanelProps {
  title: string;
  icon?: ReactNode;
  instructions: InstructionItem[];
  showControls?: boolean;
}

export function InstructionsPanel({
  title,
  icon,
  instructions,
  showControls = true,
}: InstructionsPanelProps) {
  return (
    <div
      className={`absolute top-6 left-6 bg-black/50 backdrop-blur-sm rounded-xl p-4 max-w-xs border border-white/10 z-10 transition-all duration-300 ${
        showControls ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <h3 className="text-white font-bold mb-3 flex items-center gap-2">
        {icon && <span>{icon} </span>}
        {title}
      </h3>
      <ul className="text-white/80 text-sm space-y-2">
        {instructions.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
