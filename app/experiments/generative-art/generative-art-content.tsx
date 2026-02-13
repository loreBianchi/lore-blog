'use client'

import CanvasLoader from '@/components/ui/canvas-loader'
import dynamic from 'next/dynamic'

const GenerativeArtContent = dynamic(() => import('./generative-art-suspense'), {
  ssr: false,
  loading: () => (
    <CanvasLoader />
  ),
})

export default GenerativeArtContent