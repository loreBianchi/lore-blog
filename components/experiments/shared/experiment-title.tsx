import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ExperimentTitleProps {
  title: string;
  description?: string;
}

export function ExperimentTitle({ title, description }: ExperimentTitleProps) {
  return (
    <div className="mb-8 max-w-2xl mx-auto">
      <Link
        href="/experiments"
        className="inline-flex items-center gap-2 text-primary/70 hover:text-primary/70 transition-colors mb-2 group cursor-pointer"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        back to experiments
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{title}</h1>
      {description && <p className="text-primary/70 max-w-2xl">{description}</p>}
      <div className="mt-4 h-px bg-primary/30 w-full" />
    </div>
  );
}
