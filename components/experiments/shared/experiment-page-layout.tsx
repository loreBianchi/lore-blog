import { ExperimentTitle } from "./experiment-title";

interface ExperimentPageProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ExperimentPageLayout({ title, description, children }: ExperimentPageProps) {
  return (
    <>
      <ExperimentTitle title={title} description={description} />
      
      <div className="flex-1 max-w-6xl mx-auto w-full">
        <div className="relative">
          {/* Subtle glow effect behind the experiment */}
          <div className="absolute inset-0 bg-linear-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 blur-3xl -z-10" />     
          {children}
        </div>
      </div>
      
      {/* Footer info */}
      <div className="max-w-4xl mx-auto w-full mt-12 px-2 md:px-0">
        <div className="h-px bg-linear-to-r from-transparent via-gray-700 to-transparent mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>Interactive 3D experiment built with Three.js</p>
          <div className="flex gap-4">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium">
              WebGL
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium">
              Real-time
            </span>
          </div>
        </div>
      </div>
    </>
  );
}