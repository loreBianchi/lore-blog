import { Experiment } from "@/types/experiment";
import Link from "next/link";

interface ExperimentListItemProps {
  item: Experiment;
}
export function ExperimentListItem({ item }: ExperimentListItemProps) {
  return (
    <Link
      key={item.slug}
      href={`/experiments/${item.slug}`}
      className="block py-4 border-b border-primary/20 hover:bg-primary/5 transition-colors group px-4 -mx-4 cursor-pointer"
    >
      <div className="flex items-baseline gap-4">
        <span className="text-primary/50 text-sm font-mono min-w-[3ch]">{item.id}:</span>
        <div className="flex-1">
          <h2 className="text-primary group-hover:text-primary/70 transition-colors font-medium">
            {item.title}
          </h2>
          <p className="text-sm text-primary/50 mt-1">{item.description}</p>
        </div>
        <span className="text-primary/30 group-hover:text-primary/70 transition-colors">→</span>
      </div>
    </Link>
  );
}
