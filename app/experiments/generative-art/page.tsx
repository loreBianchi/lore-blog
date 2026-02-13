import { ExperimentNotFound } from '@/components/experiments/shared/experiment-not-found';
import { ExperimentPageLayout } from '@/components/experiments/shared/experiment-page-layout';
import { experiments } from "@/data/experiments";
import GenerativeArtContent from './generative-art-content';

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
      <GenerativeArtContent />
    </ExperimentPageLayout>
  );
}