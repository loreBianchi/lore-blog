import { Size } from "@/types/ui";
import { ControlsButton, ControlsButtonProps } from "./controls-button";

interface ControlsBtnGroupProps {
  buttons: ControlsButtonProps[];
  className?: string;
  label: string;
  size?: Size;
}

export function ControlsBtnGroup({ buttons, className = "", label, size = "md" }: ControlsBtnGroupProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <span className="text-white/70 text-sm">{label}</span>
      <div className="flex flex-col gap-1">
        {buttons.map((btn, i) => (
          <ControlsButton
            key={btn.label}
            onClick={btn.onClick}
            className={btn.className}
            label={btn.label}
            isActive={btn.isActive}
            size={size}
          />
        ))}
      </div>
    </div>
  );
}
