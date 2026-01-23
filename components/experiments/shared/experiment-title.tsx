import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ExperimentTitleProps {
  title: string;
  description?: string;
}

export function ExperimentTitle({ title, description }: ExperimentTitleProps) {
  return (
      <div className="min-w-0 px-2 md:px-0 max-w-xl mx-auto mb-4">
        <Link
          href="/experiments"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Experiments
        </Link>
        <h1 className="mb-0 text-4xl font-bold tracking-tighter">{title}</h1>
        {description && <p className="mt-2 text-gray-400">{description}</p>}
      </div>
  );
}