'use client'

import { ReactNode, useEffect, useRef } from 'react'

interface CanvasContainerProps {
  children: ReactNode
  className?: string
  onResize?: (width: number, height: number) => void
}

export function CanvasContainer({ 
  children, 
  className = '', 
  onResize 
}: CanvasContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !onResize) return

    const handleResize = () => {
      const { clientWidth, clientHeight } = containerRef.current!
      onResize(clientWidth, clientHeight)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [onResize])

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full ${className}`}
    >
      {children}
    </div>
  )
}
