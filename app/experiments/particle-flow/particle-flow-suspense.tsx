import { Suspense } from "react";
import CanvasLoader from "@/components/ui/canvas-loader";
import { ParticleGalaxyExperiment } from "@/components/experiments/particle-flow";

export default function ParticleFlowSuspense() {
  return (
    <Suspense fallback={<CanvasLoader />}>
      <ParticleGalaxyExperiment />
    </Suspense>
  );
}