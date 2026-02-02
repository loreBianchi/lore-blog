import { positionClasses } from "@/data/ui";
import { ControlsDisplay, ControlsPosition } from "@/types/ui";

interface ControlsContainerProps {
  showControls?: boolean;
  children: React.ReactNode;
  position?: ControlsPosition;
  className?: string;
  display?: ControlsDisplay;
}

export function ControlsContainer({
  showControls = true,
  children,
  position = "top-left",
  className = "",
  display = "vertical",
}: ControlsContainerProps) {

  return (
    <div
      className={`absolute ${positionClasses[position || "bottom-right"]} 
          bg-black/70 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex 
          ${display === "vertical" ? "flex-col max-w-[280px]" : "flex-row"} gap-3 z-10 transition-all duration-300 ${className} ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
    >
      {children}
    </div>
  );
}
