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
    { id: "light", icon: Sun, color: "text-yellow-600" },
    { id: "dark", icon: Moon, color: "text-blue-500" },
    { id: "pastel", icon: Palette, color: "text-cyan-500" },
    { id: "cyber", icon: Sparkles, color: "text-purple-500" },
    { id: "water", icon: Droplet, color: "text-blue-500" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (resolvedTheme || theme || "light") : "light";
  const currentIndex = themes.findIndex(t => t.id === currentTheme);
  const nextIndex = (currentIndex + 1) % themes.length;
  const nextTheme = themes[nextIndex];
  const Icon = themes[currentIndex]?.icon || Sun;

  const handleClick = () => {
    if (!mounted) return;
    setTheme(nextTheme.id);
  };

  if (!mounted) {
    return (
      <button className={`px-3 py-1 border border-navbar hover:bg-green-400/10 transition-colors text-navbar hover:text-navbar-active text-sm ${className || ""}`} aria-label="Loading theme">
        <Sun className="w-4 h-4 text-gray-400" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-1 border border-navbar hover:bg-green-400/10 transition-colors text-navbar hover:text-navbar-active text-sm ${className || ""}`}
      aria-label={`Switch theme (current: ${currentTheme})`}
    >
      <Icon className={`w-4 h-4 ${themes[currentIndex]?.color || 'text-gray-700'}`} />
    </button>
  );
};
