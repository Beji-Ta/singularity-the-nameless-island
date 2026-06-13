import type { MapData } from '../types'

interface Props {
  maps: MapData[]
  activeId: string
  clearedCounts: Record<string, number>
  totalCounts: Record<string, number>
  onSelect: (id: string) => void
}

export function MapSelector({ maps, activeId, clearedCounts, totalCounts, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-700 mb-4">
      {maps.map(m => {
        const cleared = clearedCounts[m.id] ?? 0
        const total   = totalCounts[m.id]   ?? 0
        const active  = m.id === activeId
        const done    = total > 0 && cleared === total

        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={[
              'px-4 py-2 text-sm font-medium rounded-t-md transition-all',
              active
                ? 'bg-indigo-600 text-white border-b-2 border-indigo-300'
                : 'text-gray-400 hover:text-white hover:bg-gray-700',
            ].join(' ')}
          >
            {m.label}
            {total > 0 && (
              <span className={`ml-2 text-xs font-mono ${done ? 'text-green-400' : active ? 'text-indigo-200' : 'text-gray-500'}`}>
                {cleared}/{total}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
