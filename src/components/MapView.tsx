import type { MapData, AreaStatus } from '../types'
import { AreaPolygon } from './AreaPolygon'

interface Props {
  map: MapData
  statusMap: Record<string, AreaStatus>
  onToggle: (areaId: string) => void
}

export function MapView({ map, statusMap, onToggle }: Props) {
  return (
    <div
      className="relative inline-block max-w-full overflow-hidden rounded-lg border border-gray-600 shadow-2xl"
      style={{ lineHeight: 0 }}
    >
      <img
        src={map.imagePath}
        alt={map.label}
        draggable={false}
        className="block max-w-full select-none"
        style={{ width: map.imageWidth }}
      />

      {/* SVG オーバーレイ: viewBox = 画像実寸 → CSS で自動スケール */}
      <svg
        viewBox={`0 0 ${map.imageWidth} ${map.imageHeight}`}
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {map.areas.map(area => (
          <AreaPolygon
            key={area.id}
            area={area}
            status={statusMap[area.id] ?? 'unexplored'}
            onToggle={onToggle}
          />
        ))}
      </svg>

      {map.areas.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <p className="text-gray-300 text-sm bg-black/60 px-4 py-2 rounded">
            エリアデータ未設定（src/data/maps.ts に追加）
          </p>
        </div>
      )}
    </div>
  )
}
