import { useState, useEffect, useRef, useCallback } from 'react'
import { fetchProgress, writeProgress, ConflictError } from '../lib/github'
import { GH } from '../config'
import type { ProgressData, AreaStatus } from '../types'

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'conflict'

const EMPTY: ProgressData = { lastUpdated: '', maps: {} }

function applyChange(
  base: ProgressData,
  mapId: string,
  areaId: string,
  next: AreaStatus,
): ProgressData {
  return {
    ...base,
    lastUpdated: new Date().toISOString(),
    maps: {
      ...base.maps,
      [mapId]: { ...base.maps[mapId], [areaId]: next },
    },
  }
}

export function useProgress() {
  const [data, setData]             = useState<ProgressData>(EMPTY)
  const [sha, setSha]               = useState('')
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')
  const [lastSynced, setLastSynced] = useState<Date | null>(null)

  // ref で最新の sha を常に参照できるようにする
  const shaRef  = useRef(sha)
  const dataRef = useRef(data)
  shaRef.current  = sha
  dataRef.current = data

  // ── ポーリング ──────────────────────────────────────────────────────────────

  const poll = useCallback(async () => {
    try {
      const result = await fetchProgress()
      if (!result.changed) return   // 304: 変化なし
      setData(result.data)
      setSha(result.sha)
      setLastSynced(new Date())
      if (syncStatus === 'error') setSyncStatus('idle')
    } catch {
      setSyncStatus('error')
    }
  }, [syncStatus])

  useEffect(() => {
    poll()
    const timer = setInterval(poll, GH.POLL_MS)
    return () => clearInterval(timer)
  }, [poll])

  // ── エリアトグル ────────────────────────────────────────────────────────────

  const toggleArea = useCallback(async (mapId: string, areaId: string) => {
    const current: AreaStatus = dataRef.current.maps[mapId]?.[areaId] ?? 'unexplored'
    const next: AreaStatus    = current === 'unexplored' ? 'cleared' : 'unexplored'

    // オプティミスティック更新（即時 UI 反映）
    const optimistic = applyChange(dataRef.current, mapId, areaId, next)
    setData(optimistic)
    setSyncStatus('syncing')

    const doWrite = async (payload: ProgressData, currentSha: string) => {
      const { sha: newSha } = await writeProgress(payload, currentSha)
      setSha(newSha)
      setLastSynced(new Date())
      setSyncStatus('idle')
    }

    try {
      await doWrite(optimistic, shaRef.current)
    } catch (err) {
      if (err instanceof ConflictError) {
        // 競合: 最新を取得して自分の変更をマージして再試行
        setSyncStatus('conflict')
        try {
          const fresh = await fetchProgress()
          if (fresh.changed) {
            const merged = applyChange(fresh.data, mapId, areaId, next)
            setData(merged)
            setSha(fresh.sha)
            await doWrite(merged, fresh.sha)
          } else {
            setSyncStatus('error')
          }
        } catch {
          setSyncStatus('error')
          // ロールバック: サーバーから再取得
          const rollback = await fetchProgress().catch(() => null)
          if (rollback?.changed) { setData(rollback.data); setSha(rollback.sha) }
        }
      } else {
        setSyncStatus('error')
        const rollback = await fetchProgress().catch(() => null)
        if (rollback?.changed) { setData(rollback.data); setSha(rollback.sha) }
      }
    }
  }, [])

  return { data, syncStatus, lastSynced, toggleArea }
}
