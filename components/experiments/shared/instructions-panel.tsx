"use client";

import { ControlsPosition } from "@/types/ui";
import { useState } from "react";
import { positionClasses } from "@/data/ui";
import { Info } from "lucide-react";

interface InstructionItem {
  icon: string;
  text: string;
  color: string;
}

interface InstructionsPanelProps {
  title: string;
  instructions: InstructionItem[];
  showControls?: boolean;
  position?: ControlsPosition;
}

export function InstructionsPanel({
  title,
  instructions,
  showControls = true,
  position = "top-left",
}: InstructionsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`absolute ${positionClasses[position]}
      bg-black/50 backdrop-blur-sm
      rounded-xl border border-white/10
      z-10 transition-all duration-500 ease-in-out
      ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {/* HEADER */}
      <div className={`${isOpen ? "min-w-[250px]" : "w-fit"}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-3 text-white/70 hover:text-white 
                   transition-colors duration-300 w-full"
        >
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 shrink-0" />
            {/* Title con animazione migliorata */}
            <span
              className={`font-semibold text-sm whitespace-nowrap 
                        transition-all duration-500 ease-in-out
                        ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2.5 w-0 overflow-hidden"}`}
            >
              {title}
            </span>
          </div>
        </button>
      </div>

      {/* CONTENT */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out
        ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-4 pb-4">
          <ul className="text-white/80 text-sm space-y-2">
            {instructions.map((item, idx) => (
              <li 
                key={idx} 
                className="flex items-center gap-2"
              >
                <div 
                  className="w-2 h-2 rounded-full shrink-0" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className={`transition-all duration-500 delay-${idx * 50}
                               ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
