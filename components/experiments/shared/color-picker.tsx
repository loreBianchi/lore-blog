interface ColorOption {
  id: string;
  name: string;
  color: string;
}

interface ColorPickerProps {
  colors: ColorOption[];
  selected: string;
  onChange: (id: string) => void;
  className?: string;
}

export function ColorPicker({ colors, selected, onChange, className }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-white/70 text-sm">Color</span>
      <div className={`flex gap-2 ${className ?? ""}`}>
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onChange(color.id)}
            className={`w-8 h-8 rounded-full transition-all ${
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
