import { experiments } from '@/data/experiments'
import Link from 'next/link'

export const metadata = {
  title: 'Experiments | Dev Portfolio',
  description: 'Esplora i miei esperimenti digitali con WebGL, Three.js e tecnologie interattive',
}

export default function ExperimentsPage() {
  return (
    <div className="flex flex-1 min-w-0 flex-col px-2 md:px-0 max-w-xl mx-auto">
      <h1 className="mb-8 text-4xl font-bold tracking-tighter">Experiments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experiments.map((experiment) => (
          <Link
            key={experiment.id}
            href={`/experiments/${experiment.slug}`}
            className="block p-6 border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
          >
            <div
              className="w-12 h-12 flex items-center justify-center rounded-full mb-4 text-2xl"
              style={{ backgroundColor: experiment.color }}
            >
              {experiment.icon}
            </div>
            <h2 className="text-xl font-semibold mb-2">{experiment.title}</h2>
            <p className="text-gray-600">{experiment.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}