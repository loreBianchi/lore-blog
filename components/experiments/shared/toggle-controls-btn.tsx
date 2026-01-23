interface ToggleControlsBtnProps {
  onClick: () => void;
  label?: string; 
}
export function ToggleControlsBtn({ onClick, label }: ToggleControlsBtnProps) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 z-20 px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 hover:bg-black/80 transition-all text-white/80 hover:text-white text-sm"
    >
      {label || "Toggle Controls"}
    </button>
    
  );
} 