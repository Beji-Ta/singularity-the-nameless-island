import type { AreaData, AreaStatus } from '../types'

interface Props {
  area: AreaData
  status: AreaStatus
  onToggle: (id: string) => void
}

export function AreaPolygon({ area, status, onToggle }: Props) {
  const xs = area.points.map(([x]) => x)
  const ys = area.points.map(([, y]) => y)
  const x  = Math.min(...xs)
  const y  = Math.min(...ys)
  const w  = Math.max(...xs) - x
  const h  = Math.max(...ys) - y

  return (
    <rect
      x={x} y={y} width={w} height={h}
      fill={status === 'cleared' ? 'rgba(80,80,80,0.72)' : 'rgba(0,0,0,0.01)'}
      pointerEvents="all"
      style={{ cursor: 'pointer' }}
      onClick={() => onToggle(area.id)}
    />
  )
}
