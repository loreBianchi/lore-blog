interface ControlsContainerProps {
  showControls?: boolean;
  children: React.ReactNode;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
  display?: "vertical" | "horizontal";
}

export function ControlsContainer({
  showControls = true,
  children,
  position = "top-left",
  className = "",
  display = "vertical",
}: ControlsContainerProps) {
  const positionClasses = {
    "top-left": "left-4 top-4 -translate-y-0",
    "top-right": "right-4 top-4 -translate-y-0",
    "bottom-left": "left-4 bottom-4 translate-y-0",
    "bottom-right": "right-4 bottom-4 translate-y-0",
  };

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
