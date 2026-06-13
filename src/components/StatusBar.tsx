import type { SyncStatus } from '../hooks/useProgress'
import { GH } from '../config'

interface Props {
  status: SyncStatus
  lastSynced: Date | null
}

const STATUS_STYLE: Record<SyncStatus, { dot: string; text: string; label: string }> = {
  idle:     { dot: 'bg-green-400',  text: 'text-green-400',  label: '同期済み' },
  syncing:  { dot: 'bg-yellow-400 animate-pulse', text: 'text-yellow-400', label: '書き込み中...' },
  conflict: { dot: 'bg-orange-400 animate-pulse', text: 'text-orange-400', label: '競合解決中...' },
  error:    { dot: 'bg-red-500',    text: 'text-red-400',    label: 'エラー（自動再試行中）' },
}

export function StatusBar({ status, lastSynced }: Props) {
  const s = STATUS_STYLE[status]
  const timeStr = lastSynced
    ? lastSynced.toLocaleTimeString('ja-JP')
    : '---'

  return (
    <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-800/60 px-3 py-1.5 rounded border border-gray-700">
      <span className={`inline-block w-2 h-2 rounded-full ${s.dot}`} />
      <span className={s.text}>{s.label}</span>
      <span className="text-gray-600">最終同期: {timeStr}</span>
      <span className="ml-auto text-gray-600">
        ポーリング間隔: {GH.POLL_MS / 1000}秒
      </span>
    </div>
  )
}
