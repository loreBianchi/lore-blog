"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Palette, Sparkles } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  const themes = [
    { id: "light", icon: Sun, color: "text-yellow-600" },
    { id: "dark", icon: Moon, color: "text-blue-500" },
    { id: "pastel", icon: Palette, color: "text-pink-500" },
    { id: "custom", icon: Sparkles, color: "text-purple-500" },
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
      <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
        <Sun className="w-4 h-4 text-gray-400" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label={`Switch to ${nextTheme.id} theme`}
    >
      <Icon className={`w-4 h-4 ${themes[currentIndex]?.color || 'text-gray-700'}`} />
    </button>
  );
};
