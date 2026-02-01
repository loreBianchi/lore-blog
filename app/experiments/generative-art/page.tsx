import { ExperimentNotFound } from '@/components/experiments/shared/experiment-not-found';
import { ExperimentPageLayout } from '@/components/experiments/shared/experiment-page-layout';
import { experiments } from "@/data/experiments";
import P5Canvas from './p5-canvas';

export default function GenerativeArtPage() {
  const experiment = experiments.find((exp) => exp.slug === "generative-art");

  if (!experiment) {
    return <ExperimentNotFound />;
  }

  return (
    <ExperimentPageLayout 
      title={experiment.title} 
      description={experiment.description}
      tags={experiment.tech}
    >
      <P5Canvas />
    </ExperimentPageLayout>
  );
}