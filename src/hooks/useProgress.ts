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
  shaRef.current        = sha
  dataRef.current       = data
  syncStatusRef.current = syncStatus

  // ── ポーリング ──────────────────────────────────────────────────────────────
  // poll を安定した関数にするため syncStatus は ref 経由で参照し依存配列から外す。
  // これにより setSyncStatus のたびに useEffect が再実行されて即 poll() が
  // 呼ばれる問題を防ぐ。

  const poll = useCallback(async () => {
    if (writingRef.current) return
    try {
      const result = await fetchProgress()
      if (writingRef.current) return   // await 中にクリックされた場合も弾く
      if (!result.changed) return
      setData(result.data)
      setSha(result.sha)
      setLastSynced(new Date())
      if (syncStatusRef.current === 'error') setSyncStatus('idle')
    } catch {
      setSyncStatus('error')
    }
  }, [])   // 依存なし → 関数が再生成されず useEffect も再実行されない

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
    setData(optimistic)
    setSyncStatus('syncing')
    writingRef.current = true        // 書き込み開始

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
      writingRef.current = false     // 書き込み完了（成功・失敗問わず）
    }
  }, [])

  return { data, syncStatus, lastSynced, toggleArea }
}
