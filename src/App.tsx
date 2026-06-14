import { useState } from 'react'
import { MAPS } from './data/maps'
import { useProgress } from './hooks/useProgress'
import { useClicks }   from './hooks/useClicks'
import { MapView }     from './components/MapView'
import { MapSelector } from './components/MapSelector'
import { StatusBar }   from './components/StatusBar'
import type { AreaStatus, AreaZone } from './types'

const ZONES: AreaZone[] = [
  'top-left',    'top-center',    'top-right',
  'middle-left', 'middle-center', 'middle-right',
  'bottom-left', 'bottom-center', 'bottom-right',
]

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

            {/* 攻略情報（マップごとに個別設定） */}
            {activeMap.infoLines && activeMap.infoLines.length > 0 && (
              <div className="mt-2 p-2 bg-gray-800 border border-gray-600 rounded text-xs text-gray-200 leading-relaxed space-y-0.5">
                {activeMap.infoLines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}

            {activeMap.areas.length > 0 ? (() => {
              const hasZones       = activeMap.areas.some(a => a.zone)
              const splitZoneLayout = activeMap.splitZoneLayout ?? false

              const renderBtn = (areaId: string, compact = false) => {
                const area = activeMap.areas.find(a => a.id === areaId)!
                const s = statusMap[area.id] ?? 'unexplored'
                const onStyle =
                  area.color === 'lightgreen' ? 'bg-green-200 border-green-400 text-green-900 hover:bg-green-300' :
                  area.color === 'cyan'       ? 'bg-cyan-200 border-cyan-400 text-cyan-900 hover:bg-cyan-300' :
                  area.color === 'green'      ? 'bg-green-600 border-green-800 text-white hover:bg-green-700' :
                                                'bg-yellow-200 border-yellow-400 text-yellow-900 hover:bg-yellow-300'
                return (
                  <button
                    key={area.id}
                    onClick={() => toggleArea(activeMapId, area.id)}
                    title={area.name}
                    className={[
                      `w-full ${compact ? 'px-1' : 'px-2'} py-1.5 rounded text-xs text-left border transition-all select-none truncate`,
                      s === 'cleared'
                        ? 'bg-gray-700/50 border-gray-600 text-gray-500 line-through hover:bg-gray-700'
                        : onStyle,
                    ].join(' ')}
                  >
                    {area.name}
                  </button>
                )
              }

              if (!hasZones) return (
                // ゾーンなし → 通常 4列グリッド
                <div className="grid grid-cols-4 gap-1 pt-2">
                  {activeMap.areas.map(a => renderBtn(a.id))}
                </div>
              )

              return (
                // ゾーン割り当てあり → 3×3 グリッド
                <div className="grid grid-cols-3 gap-1 pt-2">
                  {ZONES.map(zone => {
                    const areas  = activeMap.areas.filter(a => a.zone === zone)
                    const isLeft  = zone.endsWith('-left')
                    const isRight = zone.endsWith('-right')

                    // splitZoneLayout かつ左右ゾーンに両種混在 → 内部2列分割
                    if (splitZoneLayout && (isLeft || isRight) && areas.length > 0) {
                      const usedAreas   = areas.filter(a => a.name.endsWith('(使用)'))
                      const normalAreas = areas.filter(a => !a.name.endsWith('(使用)'))
                      // 左ゾーン: (使用)=左列 / 通常=右列
                      // 右ゾーン: 通常=左列 / (使用)=右列
                      const leftCol  = isLeft ? usedAreas   : normalAreas
                      const rightCol = isLeft ? normalAreas : usedAreas
                      return (
                        <div key={zone} className="grid grid-cols-2 gap-0.5">
                          <div className="flex flex-col gap-1">
                            {leftCol.map(a => renderBtn(a.id, true))}
                          </div>
                          <div className="flex flex-col gap-1">
                            {rightCol.map(a => renderBtn(a.id, true))}
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div key={zone} className="flex flex-col gap-1">
                        {areas.map(a => renderBtn(a.id))}
                      </div>
                    )
                  })}
                </div>
              )
            })() : (
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
