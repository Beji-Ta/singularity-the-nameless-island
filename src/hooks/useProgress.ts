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

  const shaRef        = useRef(sha)
  const dataRef       = useRef(data)
  const writingRef    = useRef(false)
  const syncStatusRef = useRef(syncStatus)
  // 最後にローカルで書いた lastUpdated タイムスタンプ。
  // これより古いポーリング結果は無視して楽観的更新を守る。
  const lastWriteRef  = useRef('')

  shaRef.current        = sha
  dataRef.current       = data
  syncStatusRef.current = syncStatus

  // ── ポーリング ──────────────────────────────────────────────────────────────

  const poll = useCallback(async () => {
    if (writingRef.current) return
    try {
      const result = await fetchProgress()
      if (writingRef.current) return
      if (!result.changed) return
      // ローカルの書き込みより古いデータは無視（書き込み完了直後の stale 取得を防ぐ）
      if (lastWriteRef.current && result.data.lastUpdated < lastWriteRef.current) return
      setData(result.data)
      setSha(result.sha)
      setLastSynced(new Date())
      if (syncStatusRef.current === 'error') setSyncStatus('idle')
    } catch {
      setSyncStatus('error')
    }
  }, [])

  useEffect(() => {
    poll()
    const timer = setInterval(poll, GH.POLL_MS)
    return () => clearInterval(timer)
  }, [poll])

  // ── エリアトグル ────────────────────────────────────────────────────────────

  const toggleArea = useCallback(async (mapId: string, areaId: string) => {
    const current: AreaStatus = dataRef.current.maps[mapId]?.[areaId] ?? 'unexplored'
    const next: AreaStatus    = current === 'unexplored' ? 'cleared' : 'unexplored'

    const optimistic = applyChange(dataRef.current, mapId, areaId, next)
    // write タイムスタンプを setData より先に記録（poll が古いデータを弾けるように）
    lastWriteRef.current = optimistic.lastUpdated
    setData(optimistic)
    setSyncStatus('syncing')
    writingRef.current = true

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
        setSyncStatus('conflict')
        try {
          const fresh = await fetchProgress()
          if (fresh.changed) {
            const merged = applyChange(fresh.data, mapId, areaId, next)
            lastWriteRef.current = merged.lastUpdated
            setData(merged)
            setSha(fresh.sha)
            await doWrite(merged, fresh.sha)
          } else {
            setSyncStatus('error')
          }
        } catch {
          setSyncStatus('error')
          const rollback = await fetchProgress().catch(() => null)
          if (rollback?.changed) { setData(rollback.data); setSha(rollback.sha) }
        }
      } else {
        setSyncStatus('error')
        const rollback = await fetchProgress().catch(() => null)
        if (rollback?.changed) { setData(rollback.data); setSha(rollback.sha) }
      }
    } finally {
      writingRef.current = false
    }
  }, [])

  return { data, syncStatus, lastSynced, toggleArea }
}
