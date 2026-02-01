import { ExperimentTitle } from "./experiment-title";

interface ExperimentPageProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  tags?: string[];
}

export function ExperimentPageLayout({ title, description, children, tags = [] }: ExperimentPageProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <ExperimentTitle title={title} description={description} />
      {/* Experiment Content */}
      <div className="mb-12">
        {children}
      </div>

      {/* Footer Info */}
      <div className="border-t border-PRIMARY/30 pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm">
          <p className="text-PRIMARY/50">
            Interactive experiment
          </p>
          <div className="flex gap-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 border border-PRIMARY/30 text-PRIMARY/70 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
