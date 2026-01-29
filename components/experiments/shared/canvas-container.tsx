'use client'

import { ReactNode } from 'react'

interface CanvasContainerProps {
  children: ReactNode;
  className?: string;
  theme?: 'light' | 'dark' | 'unset';
}

export function CanvasContainer({ children, className = '', theme = 'dark' }: CanvasContainerProps) {
  const bgClass = theme === 'dark' 
    ? 'bg-linear-to-br from-gray-900 via-black to-purple-900/20' 
    : theme === 'light'
      ? 'bg-linear-to-br from-white/10 via-gray-100/5 to-purple-100/10'
      : '';
  return (
    <div className={`relative w-full h-[600px] rounded-xl overflow-hidden shadow-2xl ${className}`}>
      <div className={`w-full h-full ${bgClass}`}>
        {children}
      </div>
    </div>
  );
}

