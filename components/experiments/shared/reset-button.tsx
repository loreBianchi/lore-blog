"use client";

interface ResetButtonProps {
  onReset: () => void;
  className?: string;
}

export function ResetButton({ onReset, className = "" }: ResetButtonProps) {
  return (
    <button
      onClick={onReset}
      className={`
        px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 
        transition-colors text-sm
        ${className}
      `}
    >
      Reset
    </button>
  );
}
