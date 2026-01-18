"use client";

interface ToggleButtonProps {
  label: string;
  isActive: boolean;
  onChange: (active: boolean) => void;
  activeColor?: string;
  className?: string;
}

export function ToggleButton({
  label,
  isActive,
  onChange,
  activeColor = "green",
  className = "",
}: ToggleButtonProps) {
  const colorClasses = {
    green: "bg-green-500/20 text-green-300 border-green-500/30",
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  };

  const dotColors = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    cyan: "bg-cyan-500",
  };

  return (
    <button
      onClick={() => onChange(!isActive)}
      className={`
        px-4 py-2 rounded-lg flex items-center gap-2 transition-all
        ${
          isActive
            ? colorClasses[activeColor as keyof typeof colorClasses] + " border"
            : "bg-white/5 text-white/60 hover:bg-white/10"
        }
        ${className}
      `}
    >
      <div
        className={`
        w-2 h-2 rounded-full 
        ${isActive ? dotColors[activeColor as keyof typeof dotColors] : "bg-gray-500"}`}
      />
      <span className="text-sm">{label}</span>
    </button>
  );
}
