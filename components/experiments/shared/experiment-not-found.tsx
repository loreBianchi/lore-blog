import Link from "next/link";

export function ExperimentNotFound() {
  return (
    <div className="flex flex-1 min-w-0 flex-col px-2 md:px-0 max-w-xl mx-auto">
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-400 mb-2">Experiment not found</h2>
        <Link href="/experiments" className="text-cyan-400 hover:text-cyan-300 transition-colors">
          Return to experiments
        </Link>
      </div>
    </div>
  );
}