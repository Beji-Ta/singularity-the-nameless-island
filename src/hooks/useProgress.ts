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

// 保留中のローカル変更をサーバーデータに上書きマージ
function mergePending(
  base: ProgressData,
  pending: Map<string, AreaStatus>,
): ProgressData {
  if (pending.size === 0) return base
  const maps = { ...base.maps }
  for (const [key, val] of pending) {
    const sep    = key.indexOf('|')
    const mapId  = key.slice(0, sep)
    const areaId = key.slice(sep + 1)
    maps[mapId] = { ...(maps[mapId] ?? {}), [areaId]: val }
  }
  return { ...base, maps }
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
  const lastWriteRef  = useRef('')
  // 書き込み確定待ちの変更: "mapId|areaId" → 期待値
  // ポーリングがサーバーで確定を確認するまで保持し、poll によるリバートを防ぐ
  const pendingRef    = useRef<Map<string, AreaStatus>>(new Map())

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
      if (lastWriteRef.current && result.data.lastUpdated < lastWriteRef.current) return

      // サーバーで確定済みの保留変更を削除
      for (const [key, expected] of pendingRef.current) {
        const sep    = key.indexOf('|')
        const mapId  = key.slice(0, sep)
        const areaId = key.slice(sep + 1)
        if ((result.data.maps[mapId]?.[areaId] ?? 'unexplored') === expected) {
          pendingRef.current.delete(key)
        }
      }
      // 残った保留変更を必ずマージ（ポーリングによるリバート防止）
      setData(mergePending(result.data, pendingRef.current))
      setSha(result.sha)
      setLastSynced(new Date())
      if (syncStatusRef.current === 'error') setSyncStatus('idle')
    } catch { setSyncStatus('error') }
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

    const key        = `${mapId}|${areaId}`
    const optimistic = applyChange(dataRef.current, mapId, areaId, next)

    lastWriteRef.current = optimistic.lastUpdated
    pendingRef.current.set(key, next)   // 確定待ちとして登録
    setData(optimistic)
    setSyncStatus('syncing')
    writingRef.current = true

    const doWrite = async (payload: ProgressData, currentSha: string) => {
      const { sha: newSha } = await writeProgress(payload, currentSha)
      setSha(newSha)
      setLastSynced(new Date())
      setSyncStatus('idle')
      // pending は poll がサーバー確定を確認した時に削除するため、ここでは削除しない
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
            setSha(fresh.sha)
            setData(mergePending(merged, pendingRef.current))
            await doWrite(merged, fresh.sha)
          } else {
            // 304 = SHA 不一致のまま解決不能 → エラー表示のみ（リバートしない）
            setSyncStatus('error')
          }
        } catch {
          setSyncStatus('error')
          // リバートしない: pending を保持して楽観的表示を維持
        }
      } else {
        // ネットワークエラー等 → エラー表示のみ（リバートしない）
        setSyncStatus('error')
      }
    } finally {
      writingRef.current = false
    }
  }, [])

  return { data, syncStatus, lastSynced, toggleArea }
}
