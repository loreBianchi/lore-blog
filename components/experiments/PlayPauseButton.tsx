"use client";

interface PlayPauseButtonProps {
  isPlaying: boolean
  onToggle: () => void
  className?: string
}

export function PlayPauseButton({ 
  isPlaying, 
  onToggle, 
  className = '' 
}: PlayPauseButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 
        transition-colors flex items-center gap-2
        ${className}
      `}
      aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
    >
      {isPlaying ? (
        <>
          <div className="w-2 h-6 bg-white"></div>
          <div className="w-2 h-6 bg-white"></div>
          <span className="ml-1">Pause</span>
        </>
      ) : (
        <>
          <div className="
            w-0 h-0 border-t-4 border-b-4 border-l-8 
            border-t-transparent border-b-transparent border-l-white ml-1
          "></div>
          <span className="ml-2">Play</span>
        </>
      )}
    </button>
  )
}