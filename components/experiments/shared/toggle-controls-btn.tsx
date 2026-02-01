import { Expand, EyeOff, Eye, Minimize2 } from "lucide-react";

interface ToggleControlsBtnProps {
  onToggleClick: () => void;
  isVisible: boolean;
  toggleLabel?: string;
  onExpandClick?: () => void;
  isExpanded?: boolean;
  hasExpand?: boolean;
}

export function ToggleControlsBtn({
  onToggleClick,
  toggleLabel,
  onExpandClick,
  isExpanded,
  isVisible,
  hasExpand,
}: ToggleControlsBtnProps) {
  return (
    <div className="absolute top-4 right-4 flex flex-row items-center justify-center">
      <button
        onClick={onToggleClick}
        aria-label="toggle controls"
        className="z-20 px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 hover:bg-black/50 transition-all text-white/80 hover:text-white text-sm hover:border-active"
      >
        {toggleLabel ?? (
          <>
            <span className="mr-2">{isVisible ? "Hide" : "Show"} Controls</span>
            {isVisible ? (
              <EyeOff className="inline w-4 h-4" />
            ) : (
              <Eye className="inline w-4 h-4" />
            )}
          </>
        )}
      </button>
      {hasExpand && (
        <button
          onClick={onExpandClick}
          aria-label="expand canvas"
          className="z-20 ml-2 w-8 h-8 flex items-center justify-center rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 hover:bg-black/50 transition-all text-white/80 hover:text-white hover:border-active"
        >
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
