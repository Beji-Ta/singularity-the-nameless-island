import { useState, useEffect, useRef, useCallback } from 'react'
import { fetchClicks, writeClick, ConflictError } from '../lib/github'
import type { ClickEntry } from '../types'

const POLL_MS  = 4_000
const SHOWN_MS = 20_000   // この時間より古いクリックは表示しない

export function useClicks() {
  const [remoteClicks, setRemoteClicks] = useState<ClickEntry[]>([])

  const shownIds   = useRef(new Set<string>())
  const shaRef     = useRef('')
  const entriesRef = useRef<ClickEntry[]>([])
  const writingRef = useRef(false)

  // ── ポーリング ────────────────────────────────────────────────────────────
  useEffect(() => {
    const poll = async () => {
      if (writingRef.current) return
      try {
        const result = await fetchClicks()
        if (writingRef.current) return
        if (!result.changed) return

        shaRef.current     = result.sha
        entriesRef.current = result.entries

        const now = Date.now()
        const next = result.entries.filter(e =>
          !shownIds.current.has(e.id) &&
          now - new Date(e.t).getTime() < SHOWN_MS,
        )
        next.forEach(e => shownIds.current.add(e.id))
        if (next.length > 0) setRemoteClicks(next)
      } catch { /* ネットワークエラーは無視 */ }
    }

    poll()
    const timer = setInterval(poll, POLL_MS)
    return () => clearInterval(timer)
  }, [])

  // ── クリック書き込み ──────────────────────────────────────────────────────
  const addClick = useCallback(async (mapId: string, x: number, y: number) => {
    const entry: ClickEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      mapId, x, y,
      t: new Date().toISOString(),
    }
    shownIds.current.add(entry.id)   // 自分のクリックは表示しない

    writingRef.current = true
    try {
      await writeClick(entry, entriesRef.current, shaRef.current)
    } catch (err) {
      if (err instanceof ConflictError) {
        try {
          const fresh = await fetchClicks()
          shaRef.current     = fresh.sha
          entriesRef.current = fresh.entries
          await writeClick(entry, fresh.entries, fresh.sha)
        } catch { /* クリック書き込み失敗は無視 */ }
      }
    } finally {
      writingRef.current = false
    }
  }, [])

  return { remoteClicks, addClick }
}
