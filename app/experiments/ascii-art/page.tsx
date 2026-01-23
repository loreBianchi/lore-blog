import ASCIIArtExperiment from '@/components/experiments/ascii';
import { ExperimentNotFound } from '@/components/experiments/shared/experiment-not-found';
import { ExperimentPageLayout } from '@/components/experiments/shared/experiment-page-layout';
import { experiments } from "@/data/experiments";

export default function NeonGridPage() {
  const experiment = experiments.find((exp) => exp.slug === "ascii-art");

  if (!experiment) {
    return <ExperimentNotFound />;
  }

  return (
    <ExperimentPageLayout 
      title={experiment.title} 
      description={experiment.description}
    >
      <ASCIIArtExperiment />
    </ExperimentPageLayout>
  );
}