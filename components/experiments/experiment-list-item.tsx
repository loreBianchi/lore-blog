import { Experiment } from "@/types/experiment";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ExperimentListItemProps {
  item: Experiment;
}
export function ExperimentListItem({ item }: ExperimentListItemProps) {
  return (
    <Link
      key={item.slug}
      href={`/experiments/${item.slug}`}
      className="block py-4 border-b border-primary/20 hover:bg-primary/5 group px-4 -mx-4 cursor-pointer       
      text-primary/50 hover:text-active group-hover:text-primary/70 transition-colors"
    >
      <div className="flex items-baseline gap-4">
        <span className="text-sm font-mono min-w-[3ch]">{item.id}:</span>
        <div className="flex-1">
          <h2 className="font-medium">{item.title}</h2>
          <p className="text-sm mt-1">{item.description}</p>
        </div>
        <ArrowRight size={16} />
      </div>
    </Link>
  );
}
