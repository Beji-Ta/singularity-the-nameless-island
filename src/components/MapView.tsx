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

    const spawn = (delay: number) => {
      setTimeout(() => {
        const id = _id++
        setRipples(prev => [...prev, { id, x, y }])
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 3000)
      }, delay)
    }

    spawn(0)     // 1発目
    spawn(100)   // 2発目 (0.1秒後)
    spawn(600)   // 3発目 (さらに0.5秒後)
    spawn(700)   // 4発目 (0.1秒後)
    spawn(1000)  // 5発目 (1秒後、繰り返し)
    spawn(1100)  // 6発目
    spawn(1600)  // 7発目
    spawn(1700)  // 8発目
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
            border: '3px solid rgba(255, 255, 255, 0.9)',
            animation: 'mapRipple 3s ease-out forwards',
          }}
        />
      ))}
    </div>
  )
}
