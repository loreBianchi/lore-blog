"use client";

import { useEffect, useState } from "react";

interface Stat {
  label: string;
  value: string | number;
  color?: string;
}

interface StatsPanelProps {
  title?: string;
  stats: Stat[];
  className?: string;
}

export function StatsPanel({ title, stats, className = "" }: StatsPanelProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Renderizza un placeholder durante SSR
  if (!isClient) {
    return (
      <div
        className={`
        absolute top-6 right-6 bg-black/50 backdrop-blur-sm 
        rounded-xl p-4 border border-white/10 z-10
        ${className}
      `}
      >
        {title && <div className="text-white/60 text-xs mb-2">{title}</div>}
        <div className="text-white/90 text-sm">
          {stats.map((stat, index) => (
            <div key={index} className="mb-2 last:mb-0">
              <div className="text-white/60 text-xs">{stat.label}</div>
              <div className="text-xl font-bold" style={{ color: stat.color || "#4CC9F0" }}>
                {/* Solo il valore numerico senza formattazione durante SSR */}
                {typeof stat.value === "number" ? stat.value.toString() : stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Renderizza normalmente sul client
  return (
    <div
      className={`
      absolute top-6 right-6 bg-black/50 backdrop-blur-sm 
      rounded-xl p-4 border border-white/10 z-10
      ${className}
    `}
    >
      {title && <div className="text-white/60 text-xs mb-2">{title}</div>}
      <div className="text-white/90 text-sm">
        {stats.map((stat, index) => (
          <div key={index} className="mb-2 last:mb-0">
            <div className="text-white/60 text-xs">{stat.label}</div>
            <div className="text-xl font-bold" style={{ color: stat.color || "#4CC9F0" }}>
              {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
