'use client'

import dynamic from 'next/dynamic'

const P5Canvas = dynamic(() => import('@/components/experiments/generative-art'), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] w-full rounded-3xl bg-black/5 animate-pulse" />
  ),
})

export default P5Canvas