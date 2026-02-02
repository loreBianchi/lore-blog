"use client";

import { positionClasses } from "@/data/ui";
import { StatItem } from "@/types/experiments";
import { ControlsPosition } from "@/types/ui";

interface StatsPanelProps {
  stats: StatItem[];
  showControls?: boolean;
  position?: ControlsPosition;
}

export function StatsPanel({ stats, showControls = true, position = "bottom-right" }: StatsPanelProps) {
  return (
    <div
      className={`absolute ${positionClasses[position]} bg-black/50 backdrop-blur-sm rounded-xl p-3 border border-white/10 z-10 transition-all duration-300 ${
        showControls ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="space-y-2">
        {stats.map((stat, idx) => (
          <div key={idx}>
            <div className="text-white/60 text-xs">
              {stat.label}
              {stat.inline ? ": " : ""}
              {stat.inline && <span style={{ color: stat.color }}>{stat.value}</span>}
            </div>
            {!stat.inline && (
              <div className="text-lg font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
