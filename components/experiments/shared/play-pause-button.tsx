"use client";

interface PlayPauseButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function PlayPauseButton({ isPlaying, onToggle }: PlayPauseButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2"
    >
      {isPlaying ? (
        <>
          <div className="w-1.5 h-5 bg-white rounded-sm" />
          <div className="w-1.5 h-5 bg-white rounded-sm" />
          <span className="ml-1 text-white text-sm">Pause</span>
        </>
      ) : (
        <>
          <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-10 border-t-transparent border-b-transparent border-l-white ml-1" />
          <span className="ml-2 text-white text-sm">Play</span>
        </>
      )}
    </button>
  );
}
