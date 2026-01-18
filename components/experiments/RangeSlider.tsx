"use client";

interface RangeSliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  className?: string
  accentColor?: 'purple' | 'cyan' | 'green' | 'pink' | 'blue'
}

export function RangeSlider({ 
  label, 
  value, 
  min, 
  max, 
  step = 1,
  onChange,
  className = '',
  accentColor = 'purple'
}: RangeSliderProps) {
  const accentClasses = {
    purple: 'accent-purple-500',
    cyan: 'accent-cyan-500',
    green: 'accent-green-500',
    pink: 'accent-pink-500',
    blue: 'accent-blue-500'
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-white/70 text-sm">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-32 ${accentClasses[accentColor]}`}
      />
    </div>
  )
}