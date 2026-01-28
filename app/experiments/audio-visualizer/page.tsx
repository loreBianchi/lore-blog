import AudioVisualizerExperiment from '@/components/experiments/audio-visualizer';
import { ExperimentNotFound } from '@/components/experiments/shared/experiment-not-found';
import { ExperimentPageLayout } from '@/components/experiments/shared/experiment-page-layout';
import { experiments } from "@/data/experiments";

export default function AudioVisualizerPage() {
  const experiment = experiments.find((exp) => exp.slug === "audio-visualizer");

  if (!experiment) {
    return <ExperimentNotFound />;
  }

  return (
    <ExperimentPageLayout 
      title={experiment.title} 
      description={experiment.description}
      tags={experiment.tech}
    >
      <AudioVisualizerExperiment />
    </ExperimentPageLayout>
  );
}