"use client";

import { StatItem } from "@/types/experiment";

interface StatsPanelProps {
  stats: StatItem[];
  showControls?: boolean;
}

export function StatsPanel({ stats, showControls = true }: StatsPanelProps) {
  return (
    <div
      className={`absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl p-3 border border-white/10 z-10 transition-all duration-300 ${
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
