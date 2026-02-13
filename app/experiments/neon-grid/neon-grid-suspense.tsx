import { Suspense } from "react";
import CanvasLoader from "@/components/ui/canvas-loader";
import { NeonGridExperiment } from "@/components/experiments/neon-grid";

export default function NeonGridSuspense() {
  return (
    <Suspense fallback={<CanvasLoader />}>
      <NeonGridExperiment />
    </Suspense>
  );
}