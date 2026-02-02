import { experiments } from "@/data/experiments";

export const getExperimentBySlug = (slug: string) => {
  return experiments.find((exp) => exp.slug === slug);
};

export const getExperimentsByCategory = (category: string) => {
  return experiments.filter((exp) => exp.category === category);
};

export const getExperimentsByTech = (tech: string) => {
  return experiments.filter((exp) => exp.tech.includes(tech));
};
