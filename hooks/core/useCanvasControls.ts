import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

enum CanvasControlsParams {
  SHOW_CONTROLS = "show-controls",
  CANVAS_EXPANDED = "canvas-expanded",
}

export function useCanvasControls() {
  const searchParams = useSearchParams();
  const [showControls, setShowControls] = useState<boolean>(true);
  const [canvasExpanded, setCanvasExpanded] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize state from URL on first render
  useEffect(() => {
    const controlsParam = searchParams.get(CanvasControlsParams.SHOW_CONTROLS);
    if (controlsParam !== null) {
      setShowControls(controlsParam === 'true');
    }
    const expandedParam = searchParams.get(CanvasControlsParams.CANVAS_EXPANDED);
    if (expandedParam !== null) {
      setCanvasExpanded(expandedParam === 'true');
    }
    setIsInitialized(true);
  }, []);

  // Update URL only when state changes (after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    
    const params = new URLSearchParams();
    params.set(CanvasControlsParams.SHOW_CONTROLS, String(showControls));
    params.set(CanvasControlsParams.CANVAS_EXPANDED, String(canvasExpanded));
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [showControls, canvasExpanded, isInitialized]);

  const toggleControls = useCallback(() => {
    setShowControls(prev => !prev);
  }, []);

  const toggleCanvasExpand = useCallback(() => {
    setCanvasExpanded(prev => !prev);
  }, []);

  return {
    showControls,
    toggleControls,
    canvasExpanded,
    toggleCanvasExpand,
  };
}
