import { useState, useEffect, useRef, useCallback } from 'react'
import { fetchMessages, writeMessage, clearMessages, ConflictError } from '../lib/github'
import type { MessageEntry } from '../types'

const POLL_MS = 4_000

export function useMessages() {
  const [messages, setMessages] = useState<MessageEntry[]>([])

  const shaRef     = useRef('')
  const entriesRef = useRef<MessageEntry[]>([])
  const writingRef = useRef(false)

  useEffect(() => {
    const poll = async () => {
      if (writingRef.current) return
      try {
        const result = await fetchMessages()
        if (writingRef.current) return
        if (!result.changed) return
        shaRef.current     = result.sha
        entriesRef.current = result.entries
        setMessages([...result.entries])
      } catch { /* ネットワークエラーは無視 */ }
    }

    poll()
    const timer = setInterval(poll, POLL_MS)
    return () => clearInterval(timer)
  }, [])

  const addMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const entry: MessageEntry = {
      id:   `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: trimmed,
      t:    new Date().toISOString(),
    }

    // 楽観的更新
    const next = [...entriesRef.current, entry]
    entriesRef.current = next
    setMessages(next)

    writingRef.current = true
    try {
      const prevEntries = entriesRef.current.filter(e => e.id !== entry.id)
      await writeMessage(entry, prevEntries, shaRef.current)
    } catch (err) {
      if (err instanceof ConflictError) {
        try {
          const fresh = await fetchMessages()
          shaRef.current     = fresh.sha
          entriesRef.current = fresh.entries
          await writeMessage(entry, fresh.entries, fresh.sha)
        } catch { /* 失敗しても楽観的更新は維持 */ }
      }
    } finally {
      writingRef.current = false
    }
  }, [])

  const resetMessages = useCallback(async () => {
    writingRef.current = true
    try {
      const sha = shaRef.current || (await fetchMessages()).sha
      await clearMessages(sha)
      entriesRef.current = []
      shaRef.current = ''
      setMessages([])
    } catch (err) {
      if (err instanceof ConflictError) {
        try {
          const fresh = await fetchMessages()
          await clearMessages(fresh.sha)
          entriesRef.current = []
          shaRef.current = ''
          setMessages([])
        } catch { /* 失敗しても無視 */ }
      }
    } finally {
      writingRef.current = false
    }
  }, [])

  return { messages, addMessage, resetMessages }
}
