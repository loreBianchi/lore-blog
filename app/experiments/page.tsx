import { ExperimentListItem } from '@/components/experiments/experiment-list-item';
import { experiments } from '@/data/experiments'
import Link from 'next/link'

export const metadata = {
  title: 'Experiments',
  description: 'A collection of fun experiments built with Three.js, WebGL, and other technologies.',
}

export default function ExperimentsListPage() {

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">experiments</h1>
        <p className="text-primary/70">A collection of fun experiments built with Three.js, WebGL, and other technologies.</p>
        <div className="mt-4 h-px bg-primary/30 w-full" />
      </div>

      {/* Experiments List */}
      <div className="space-y-0">
        {experiments.map((exp) => (
          <ExperimentListItem key={exp.slug} item={exp} />
        ))}
      </div>
    </div>
  );
}
