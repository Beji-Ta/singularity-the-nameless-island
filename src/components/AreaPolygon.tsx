import type { AreaData, AreaStatus } from '../types'

interface Props {
  area: AreaData
  status: AreaStatus
  onToggle: (id: string) => void
}

function centroid(points: [number, number][]): [number, number] {
  const n = points.length
  return [
    points.reduce((s, [x]) => s + x, 0) / n,
    points.reduce((s, [, y]) => s + y, 0) / n,
  ]
}

export function AreaPolygon({ area, status, onToggle }: Props) {
  const pts = area.points.map(([x, y]) => `${x},${y}`).join(' ')
  const [cx, cy] = centroid(area.points)
  const cleared  = status === 'cleared'

  return (
    <g onClick={() => onToggle(area.id)} className="cursor-pointer">
      <polygon
        points={pts}
        style={
          cleared
            ? { fill: 'rgba(34,197,94,0.45)', stroke: 'rgba(134,239,172,0.9)', strokeWidth: 2 }
            : {
                fill: 'rgba(239,68,68,0.55)',
                stroke: 'rgba(252,165,165,0.95)',
                strokeWidth: 2,
                animation: 'areaPulse 1.6s ease-in-out infinite',
              }
        }
      />

      {/* エリア名（stroke → fill の順で描くことでアウトライン付き文字を実現） */}
      <text
        x={cx} y={cy - 6}
        textAnchor="middle" dominantBaseline="middle"
        style={{
          fontSize: 11, fontWeight: 'bold',
          fill: cleared ? '#bbf7d0' : '#fecaca',
          stroke: '#000', strokeWidth: 2.5,
          paintOrder: 'stroke fill',
          pointerEvents: 'none', userSelect: 'none',
        }}
      >
        {area.name}
      </text>

      <text
        x={cx} y={cy + 9}
        textAnchor="middle" dominantBaseline="middle"
        style={{
          fontSize: 9,
          fill: cleared ? '#86efac' : '#fca5a5',
          stroke: '#000', strokeWidth: 2,
          paintOrder: 'stroke fill',
          pointerEvents: 'none', userSelect: 'none',
        }}
      >
        {cleared ? '✓ 攻略済' : '✗ 未攻略'}
      </text>
    </g>
  )
}
