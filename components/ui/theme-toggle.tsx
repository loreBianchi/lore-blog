"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Palette, Sparkles, Droplet } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  const themes = [
    { id: "light", icon: Sun },
    { id: "dark", icon: Moon },
    { id: "pastel", icon: Palette },
    { id: "cyber", icon: Sparkles },
    { id: "water", icon: Droplet },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? resolvedTheme || theme || "light" : "light";
  const currentIndex = themes.findIndex((t) => t.id === currentTheme);
  const nextIndex = (currentIndex + 1) % themes.length;
  const nextTheme = themes[nextIndex];
  const Icon = themes[currentIndex]?.icon || Sun;

  const handleClick = () => {
    if (!mounted) return;
    setTheme(nextTheme.id);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-1 border border-navbar hover:bg-active/10 transition-colors text-navbar hover:text-active hover:border-active text-sm ${className || ""}`}
      aria-label={mounted ? `Switch theme (current: ${currentTheme})` : "Loading theme"}
    >
      {mounted ?<Icon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
};
