import { useState, useEffect, useRef, useCallback } from 'react'
import { fetchCounter, writeCounter, ConflictError } from '../lib/github'

const POLL_MS = 8_000

export function useCounter() {
  const [value, setValue] = useState(0)

  const shaRef   = useRef('')
  const localRef = useRef(0)      // 最後にセットしたローカル値（書き込み用）
  const dirtyRef = useRef(false)  // 書き込み待ち中はポーリング上書きを防ぐ
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const poll = async () => {
      if (dirtyRef.current) return
      try {
        const result = await fetchCounter()
        if (dirtyRef.current) return
        if (!result.changed) return
        shaRef.current  = result.sha
        localRef.current = result.value
        setValue(result.value)
      } catch {}
    }

    poll()
    const interval = setInterval(poll, POLL_MS)
    return () => {
      clearInterval(interval)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // 連打でも最後の値だけ 400ms 後に書き込む
  const setCounter = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(50, next))
    localRef.current = clamped
    dirtyRef.current = true
    setValue(clamped)

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      try {
        const newSha = await writeCounter(localRef.current, shaRef.current)
        shaRef.current = newSha
      } catch (err) {
        if (err instanceof ConflictError) {
          try {
            const fresh = await fetchCounter()
            shaRef.current = fresh.sha
            const newSha = await writeCounter(localRef.current, fresh.sha)
            shaRef.current = newSha
          } catch {}
        }
      } finally {
        dirtyRef.current = false
        timerRef.current = null
      }
    }, 400)
  }, [])

  return { value, setCounter }
}
