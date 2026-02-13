import { Suspense } from "react";
import GenerativeArt from "@/components/experiments/generative-art";
import CanvasLoader from "@/components/ui/canvas-loader";

export default function GenerativeArtSuspense() {
  return (
    <Suspense fallback={<CanvasLoader />}>
      <GenerativeArt />
    </Suspense>
  );
}