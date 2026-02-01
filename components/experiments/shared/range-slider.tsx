"use client";

interface RangeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  accentColor?: "cyan" | "purple" | "pink" | "green";
  className?: string;
}

export function RangeSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  accentColor = "cyan",
  className,
}: RangeSliderProps) {
  const accentColorMap = {
    cyan: "accent-cyan-500",
    purple: "accent-purple-500",
    pink: "accent-pink-500",
    green: "accent-green-500",
  };

  const textColorMap = {
    cyan: "text-cyan-400",
    purple: "text-purple-400",
    pink: "text-pink-400",
    green: "text-green-400",
  };

  return (
    <div className={`flex flex-col gap-2 ${className || ""}`}>
      <div className="flex justify-between items-center">
        <span className="text-white/70 text-sm">{label}</span>
        <span className={`${textColorMap[accentColor]} text-sm font-bold`}>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full ${accentColorMap[accentColor]}`}
      />
    </div>
  );
}
