'use client'

import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const position: [number, number] = [45.5741, 9.7681] // Martinengo (BG)

const markerIcon = new L.Icon({
  iconUrl: '/marker.svg',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})

export default function ContactMap() {
  return (
    <div
      className="
        relative overflow-hidden rounded-3xl
        border border-black/10
        shadow-[0_20px_40px_rgba(0,0,0,0.12)]
      "
    >
      <MapContainer
        center={position}
        zoom={8}
        scrollWheelZoom={false}
        className="h-[360px] w-full"
      >
        <TileLayer
          attribution="© OpenStreetMap © CARTO"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <Marker position={position} icon={markerIcon} />
      </MapContainer>

      <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-green-500/5 via-transparent to-transparent" />
    </div>
  )
}
