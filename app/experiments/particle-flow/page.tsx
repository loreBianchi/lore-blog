import { ParticleGalaxyExperiment } from "@/components/experiments/particle-flow";
import { experiments } from "@/data/experiments";
import { ExperimentNotFound } from "@/components/experiments/shared/experiment-not-found";
import { ExperimentPageLayout } from "@/components/experiments/shared/experiment-page-layout";

const ParticleGalaxyPage = () => {
  const experiment = experiments.find((exp) => exp.slug === "particle-flow");

  if (!experiment) {
    return <ExperimentNotFound />;
  }

  return (
    <ExperimentPageLayout
      title={experiment.title}
      description={experiment.description}
      tags={experiment.tech}
    >
      <ParticleGalaxyExperiment />
    </ExperimentPageLayout>
  );
};

export default ParticleGalaxyPage;
