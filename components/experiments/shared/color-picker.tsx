import { ColorKey } from "@/types/colors";

interface ColorOption {
  id: ColorKey;
  name: string;
  color: string;
}

interface ColorPickerProps {
  colors: ColorOption[];
  selected: ColorKey;
  onChange: (id: ColorKey) => void;
  className?: string;
  display?: "grid" | "flex";
}

export function ColorPicker({ colors, selected, onChange, className, display = "flex" }: ColorPickerProps) {
  const displayClass = display === "grid" ? "grid grid-cols-4 gap-2" : "flex flex-row gap-2";
  return (
    <div className="flex flex-col gap-2">
      <span className="text-white/70 text-sm">Color</span>
      <div className={`${displayClass} gap-2 ${className ?? ""}`}>
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onChange(color.id)}
            className={`w-6 h-6 rounded-full transition-all ${
              selected === color.id ? "ring-2 ring-white scale-110" : "opacity-50 hover:opacity-100"
            }`}
            style={{ backgroundColor: color.color }}
            aria-label={`${color.name} color`}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}
