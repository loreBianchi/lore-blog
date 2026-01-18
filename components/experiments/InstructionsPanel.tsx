'use client'

interface Instruction {
  icon: React.ReactNode
  text: string
  color: string
}

interface InstructionsPanelProps {
  title: string
  icon: React.ReactNode
  instructions: Instruction[]
  className?: string
}

export function InstructionsPanel({ 
  title, 
  icon, 
  instructions, 
  className = '' 
}: InstructionsPanelProps) {
  return (
    <div className={`
      absolute top-6 left-6 bg-black/50 backdrop-blur-sm 
      rounded-xl p-4 max-w-xs border border-white/10 z-10
      ${className}
    `}>
      <h3 className="text-white font-bold mb-2 flex items-center gap-2">
        {icon} {title}
      </h3>
      <ul className="text-white/80 text-sm space-y-1">
        {instructions.map((instruction, index) => (
          <li key={index} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: instruction.color }}
            ></div>
            <span>{instruction.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}