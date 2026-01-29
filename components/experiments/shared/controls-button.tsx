import { Size } from "@/types/ui";

const sizeClasses = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-3 text-base",
};

export interface ControlsButtonProps {
  onClick: () => void;
  className?: string;
  label: string;
  isActive?: boolean;
  size?: Size;
}

export function ControlsButton({
  onClick,
  className = "",
  label,
  isActive = false,
  size = "md",
}: ControlsButtonProps) {
  const appliedSizeClasses = sizeClasses[size] || sizeClasses.md;

  const activeClasses = isActive
    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
    : "bg-white/5 text-white/60 hover:bg-white/10 border-transparent";

  return (
    <button
      onClick={onClick}
      className={`rounded-lg capitalize transition-all border ${className} ${appliedSizeClasses} ${activeClasses}`}
    >
      {label}
    </button>
  );
}
