"use client";

interface ColorScheme {
  id: string
  name: string
  color: string
}

interface ColorSchemeSelectorProps {
  schemes: ColorScheme[]
  selectedId: string
  onChange: (id: string) => void
  className?: string
}

export function ColorSchemeSelector({ 
  schemes, 
  selectedId, 
  onChange,
  className = ''
}: ColorSchemeSelectorProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {schemes.map((scheme) => (
        <button
          key={scheme.id}
          onClick={() => onChange(scheme.id)}
          className={`
            w-8 h-8 rounded-full transition-all
            ${selectedId === scheme.id 
              ? 'ring-2 ring-white scale-110' 
              : 'opacity-50 hover:opacity-100'
            }
          `}
          style={{ backgroundColor: scheme.color }}
          aria-label={`${scheme.name} color scheme`}
          title={scheme.name}
        />
      ))}
    </div>
  )
}