import { useState, useEffect, useRef, useCallback } from 'react'
import type { MapData, ClickEntry } from '../types'

interface Ripple { id: number; x: number; y: number }

interface Props {
  map: MapData
  remoteClicks: ClickEntry[]
  onMapClick: (xRatio: number, yRatio: number) => void
}

let _id = 0

function spawnWaves(
  x: number,
  y: number,
  setRipples: React.Dispatch<React.SetStateAction<Ripple[]>>,
) {
  const delays = [0, 100, 600, 700, 1000, 1100, 1600, 1700]
  delays.forEach(delay => {
    setTimeout(() => {
      const id = _id++
      setRipples(prev => [...prev, { id, x, y }])
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 3000)
    }, delay)
  })
}

export function MapView({ map, remoteClicks, onMapClick }: Props) {
  const [ripples, setRipples]   = useState<Ripple[]>([])
  const [showHelp, setShowHelp] = useState(false)
  const containerRef            = useRef<HTMLDivElement>(null)
  const shownRemoteIds          = useRef(new Set<string>())

  // リモートクリックを波紋に変換
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    remoteClicks.forEach(c => {
      if (shownRemoteIds.current.has(c.id)) return
      shownRemoteIds.current.add(c.id)
      const x = c.x * el.offsetWidth
      const y = c.y * el.offsetHeight
      spawnWaves(x, y, setRipples)
    })
  }, [remoteClicks])

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    spawnWaves(x, y, setRipples)

    // 比率に変換して親へ通知（GitHub 書き込み）
    const el = containerRef.current
    if (el) onMapClick(x / el.offsetWidth, y / el.offsetHeight)
  }, [onMapClick])

  return (
    <div
      ref={containerRef}
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

      {/* ヘルプボタン（右下） */}
      <button
        className="absolute bottom-2 right-2 z-10 bg-gray-900/85 border border-gray-400 text-gray-100 text-xs font-bold px-3 py-1 rounded select-none hover:bg-gray-700/90"
        onMouseDown={e => { e.stopPropagation(); setShowHelp(true) }}
        onMouseUp={e => { e.stopPropagation(); setShowHelp(false) }}
        onMouseLeave={() => setShowHelp(false)}
        onTouchStart={e => { e.stopPropagation(); setShowHelp(true) }}
        onTouchEnd={e => { e.stopPropagation(); setShowHelp(false) }}
        onClick={e => e.stopPropagation()}
      >
        HELP
      </button>

      {/* ヘルプ画像オーバーレイ */}
      {showHelp && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 pointer-events-none">
          <img
            src="./maps/help_hellfly.JPG"
            alt="ヘルフライについて"
            className="max-w-[92%] max-h-[92%] rounded shadow-2xl"
          />
        </div>
      )}

      {/* 波紋エフェクト */}
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
