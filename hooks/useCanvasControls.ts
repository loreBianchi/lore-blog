import { useState } from "react";

export function useCanvasControls() {
  const [showControls, setShowControls] = useState<boolean>(true);
  const [canvasExpanded, setCanvasExpanded] = useState<boolean>(false);

  const toggleControls = () => {
    setShowControls((prev) => !prev);
  };

  const toggleCanvasExpand = () => {
    setCanvasExpanded((prev) => !prev);
  };

  return {
    showControls,
    toggleControls,
    canvasExpanded,
    toggleCanvasExpand,
  };
}