import { NeonGridExperiment } from '@/components/experiments/neon-grid'
import { ExperimentNotFound } from '@/components/experiments/shared/experiment-not-found';
import { ExperimentPageLayout } from '@/components/experiments/shared/experiment-page-layout';
import { experiments } from "@/data/experiments";

export default function NeonGridPage() {
  const experiment = experiments.find((exp) => exp.slug === "neon-grid");

  if (!experiment) {
    return <ExperimentNotFound />;
  }

  return (
    <ExperimentPageLayout 
      title={experiment.title} 
      description={experiment.description}
      tags={experiment.tech}
    >
      <NeonGridExperiment />
    </ExperimentPageLayout>
  );
}