import { useState, useCallback } from 'react'
import type { MapData } from '../types'

interface Ripple { id: number; x: number; y: number }

interface Props {
  map: MapData
}

let _id = 0

export function MapView({ map }: Props) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = _id++
    setRipples(prev => [...prev, { id, x, y }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 3000)
  }, [])

  return (
    <div
      className="relative inline-block max-w-full overflow-hidden rounded-lg border border-gray-600 shadow-2xl cursor-crosshair"
      style={{ lineHeight: 0 }}
      onClick={handleClick}
    >
      <img
        src={map.imagePath}
        alt={map.label}
        draggable={false}
        className="block max-w-full select-none"
        style={{ width: map.imageWidth }}
      />
      {ripples.map(r => (
        <div
          key={r.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: r.x,
            top: r.y,
            width: 48,
            height: 48,
            border: '3px solid rgba(255, 220, 30, 0.9)',
            animation: 'mapRipple 3s ease-out forwards',
          }}
        />
      ))}
    </div>
  )
}
