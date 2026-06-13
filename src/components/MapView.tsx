import type { MapData } from '../types'

interface Props {
  map: MapData
}

export function MapView({ map }: Props) {
  return (
    <div
      className="inline-block max-w-full overflow-hidden rounded-lg border border-gray-600 shadow-2xl"
      style={{ lineHeight: 0 }}
    >
      <img
        src={map.imagePath}
        alt={map.label}
        draggable={false}
        className="block max-w-full select-none"
        style={{ width: map.imageWidth }}
      />
    </div>
  )
}
