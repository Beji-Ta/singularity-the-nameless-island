import { useState } from 'react'
import { MAPS } from './data/maps'
import { useProgress } from './hooks/useProgress'
import { useClicks }   from './hooks/useClicks'
import { MapView }     from './components/MapView'
import { MapSelector } from './components/MapSelector'
import { StatusBar }   from './components/StatusBar'
import type { AreaStatus } from './types'

export default function App() {
  const [activeMapId, setActiveMapId] = useState(MAPS[0].id)
  const { data, syncStatus, lastSynced, toggleArea } = useProgress()
  const { remoteClicks, addClick } = useClicks()

  const activeMap = MAPS.find(m => m.id === activeMapId) ?? MAPS[0]
  const statusMap: Record<string, AreaStatus> = data.maps[activeMapId] ?? {}

  // タブ用 cleared/total カウント
  const clearedCounts: Record<string, number> = {}
  const totalCounts:   Record<string, number> = {}
  for (const m of MAPS) {
    totalCounts[m.id]   = m.areas.length
    clearedCounts[m.id] = m.areas.filter(
      a => (data.maps[m.id]?.[a.id] ?? 'unexplored') === 'cleared'
    ).length
  }

  const cleared = clearedCounts[activeMapId] ?? 0
  const total   = totalCounts[activeMapId]   ?? 0
  const pct     = total > 0 ? Math.round((cleared / total) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-5 py-3 flex items-center gap-4">
        <h1 className="text-base font-bold text-gray-100 whitespace-nowrap">
          RO 名無しMD 攻略マップ
        </h1>
        <p className="text-xs text-gray-500 hidden sm:block">
          エリアをクリックして攻略済み / 未攻略を切り替え（GitHub に自動保存）
        </p>
      </header>

      <main className="flex-1 p-4 overflow-auto space-y-3">
        {/* ステータスバー */}
        <StatusBar status={syncStatus} lastSynced={lastSynced} />

        {/* マップタブ */}
        <MapSelector
          maps={MAPS}
          activeId={activeMapId}
          clearedCounts={clearedCounts}
          totalCounts={totalCounts}
          onSelect={setActiveMapId}
        />

        {/* 進捗バー */}
        {total > 0 && (
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>
              攻略済: <span className="text-green-400 font-bold">{cleared}</span>
              {' / '}<span className="text-white">{total}</span>
              {'  '}<span className="text-indigo-400 font-mono">{pct}%</span>
            </span>
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden max-w-xs">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-green-400 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {/* マップ画像＋ボタン（同幅） */}
        <div className="overflow-x-auto">
          <div style={{ width: activeMap.imageWidth, maxWidth: '100%' }}>
            <MapView
              map={activeMap}
              remoteClicks={remoteClicks.filter(c => c.mapId === activeMapId)}
              onMapClick={(x, y) => addClick(activeMapId, x, y)}
            />

            {activeMap.areas.length > 0 ? (
              <div className="grid grid-cols-4 gap-1 pt-2">
                {activeMap.areas.map(area => {
                  const s = statusMap[area.id] ?? 'unexplored'
                  const onStyle =
                    area.color === 'lightgreen' ? 'bg-green-200 border-green-400 text-green-900 hover:bg-green-300' :
                    area.color === 'cyan'       ? 'bg-cyan-200 border-cyan-400 text-cyan-900 hover:bg-cyan-300' :
                    area.color === 'green'      ? 'bg-green-400 border-green-600 text-green-950 hover:bg-green-500' :
                                                  'bg-yellow-200 border-yellow-400 text-yellow-900 hover:bg-yellow-300'
                  return (
                    <button
                      key={area.id}
                      onClick={() => toggleArea(activeMapId, area.id)}
                      title={area.name}
                      className={[
                        'px-2 py-1.5 rounded text-xs text-left border transition-all select-none truncate',
                        s === 'cleared'
                          ? 'bg-gray-700/50 border-gray-600 text-gray-500 line-through hover:bg-gray-700'
                          : onStyle,
                      ].join(' ')}
                    >
                      {area.name}
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-xs pt-2">
                エリアデータ未設定（src/data/maps.ts に追加）
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
