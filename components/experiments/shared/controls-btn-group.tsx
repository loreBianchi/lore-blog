import { ControlsButton, ControlsButtonProps } from "./controls-button";

interface ControlsBtnGroupProps {
  buttons: ControlsButtonProps[];
  className?: string;
}

export function ControlsBtnGroup({ buttons, className = "" }: ControlsBtnGroupProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <span className="text-white/70 text-sm">Galaxy Type</span>
      <div className="flex flex-col gap-1">
        {buttons.map((btn, i) => (
          <ControlsButton
            key={btn.label}
            onClick={btn.onClick}
            className={btn.className}
            label={btn.label}
          />
        ))}
      </div>
    </div>
  );
}
