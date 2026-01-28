export interface ControlsButtonProps {
  onClick: () => void;
  className?: string;
  label: string;
}

export function ControlsButton({ onClick, className = "", label }: ControlsButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm capitalize transition-all border ${className}`}
    >
      {label}
    </button>
  );
}
