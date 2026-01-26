'use client'

import dynamic from 'next/dynamic'

const Map = dynamic(() => import('./map.client'), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] w-full rounded-3xl bg-black/5 animate-pulse" />
  ),
})

export default Map