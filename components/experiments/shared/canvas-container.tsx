'use client'

import { ReactNode } from 'react'

interface CanvasContainerProps {
  children: ReactNode;
  className?: string;
}

export function CanvasContainer({ children, className = '' }: CanvasContainerProps) {
  return (
    <div className={`relative w-full h-[600px] rounded-xl overflow-hidden shadow-2xl ${className}`}>
      <div className="w-full h-full bg-linear-to-br from-gray-900 via-black to-purple-900/20">
        {children}
      </div>
    </div>
  );
}

