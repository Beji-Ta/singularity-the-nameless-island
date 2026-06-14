import { GH } from '../config'
import type { ProgressData, ClickEntry, MessageEntry } from '../types'

const API = 'https://api.github.com'
const URL = `${API}/repos/${GH.OWNER}/${GH.REPO}/contents/${GH.FILE}`

const HEADERS = {
  Authorization: `token ${GH.TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
}

// ETag キャッシュ（304 Not Modified でポーリングのデータ転送量を削減）
let cachedEtag = ''

export interface FetchResult {
  data: ProgressData
  sha: string
  changed: boolean   // false = 304 Not Modified（前回と同じ）
}

/** progress.json を取得する */
export async function fetchProgress(): Promise<FetchResult> {
  const headers: Record<string, string> = { ...HEADERS }
  if (cachedEtag) headers['If-None-Match'] = cachedEtag

  const res = await fetch(URL, { headers })

  if (res.status === 304) {
    // 内容変化なし: 呼び出し元のキャッシュをそのまま使う
    return { data: {} as ProgressData, sha: '', changed: false }
  }
  if (!res.ok) {
    throw new GitHubError(res.status, await res.text())
  }

  cachedEtag = res.headers.get('ETag') ?? ''
  const file = await res.json() as { content: string; sha: string }
  const json = atob(file.content.replace(/\n/g, ''))
  return { data: JSON.parse(json) as ProgressData, sha: file.sha, changed: true }
}

export interface WriteResult {
  sha: string   // 新しい blob SHA（次の PUT に使う）
}

/** progress.json を上書きコミットする */
export async function writeProgress(
  data: ProgressData,
  currentSha: string,
): Promise<WriteResult> {
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))))

  const res = await fetch(URL, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify({
      message: `chore: update progress [${new Date().toISOString()}]`,
      content: encoded,
      sha: currentSha,
    }),
  })

  if (res.status === 409) {
    // 競合: 別のメンバーが先に書き込んだ
    throw new ConflictError()
  }
  if (!res.ok) {
    throw new GitHubError(res.status, await res.text())
  }

  const result = await res.json() as { content: { sha: string } }
  cachedEtag = '' // キャッシュ無効化（次回は必ず再取得）
  return { sha: result.content.sha }
}

// ── クリック同期 ─────────────────────────────────────────────────────────────

const CLICKS_URL = `${API}/repos/${GH.OWNER}/${GH.REPO}/contents/clicks.json`
const KEEP_MS    = 20_000   // 20秒より古いクリックは破棄
let clicksEtag = ''
let clicksSha  = ''

export interface FetchClicksResult {
  entries: ClickEntry[]
  sha: string
  changed: boolean
}

export async function fetchClicks(): Promise<FetchClicksResult> {
  const headers: Record<string, string> = { ...HEADERS }
  if (clicksEtag) headers['If-None-Match'] = clicksEtag

  const res = await fetch(CLICKS_URL, { headers })

  if (res.status === 304) return { entries: [], sha: clicksSha, changed: false }
  if (res.status === 404) return { entries: [], sha: '',        changed: false }
  if (!res.ok) throw new GitHubError(res.status, await res.text())

  clicksEtag = res.headers.get('ETag') ?? ''
  const file  = await res.json() as { content: string; sha: string }
  clicksSha   = file.sha
  const json  = atob(file.content.replace(/\n/g, ''))
  return { entries: JSON.parse(json) as ClickEntry[], sha: file.sha, changed: true }
}

export async function writeClick(
  entry: ClickEntry,
  currentEntries: ClickEntry[],
  currentSha: string,
): Promise<string> {
  const now   = Date.now()
  const fresh = [
    ...currentEntries.filter(e => now - new Date(e.t).getTime() < KEEP_MS),
    entry,
  ]
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(fresh))))

  const res = await fetch(CLICKS_URL, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify({
      message: `click [${entry.t}]`,
      content: encoded,
      sha: currentSha,
    }),
  })

  if (res.status === 409) throw new ConflictError()
  if (!res.ok) throw new GitHubError(res.status, await res.text())

  const result = await res.json() as { content: { sha: string } }
  clicksEtag = ''
  clicksSha  = result.content.sha
  return result.content.sha
}

// ── 伝言板 ───────────────────────────────────────────────────────────────────

const MESSAGES_URL = `${API}/repos/${GH.OWNER}/${GH.REPO}/contents/messages.json`
const KEEP_MSG_MS  = 86_400_000   // 24時間保持
let messagesEtag = ''
let messagesSha  = ''

export interface FetchMessagesResult {
  entries: MessageEntry[]
  sha: string
  changed: boolean
}

export async function fetchMessages(): Promise<FetchMessagesResult> {
  const headers: Record<string, string> = { ...HEADERS }
  if (messagesEtag) headers['If-None-Match'] = messagesEtag

  const res = await fetch(MESSAGES_URL, { headers })

  if (res.status === 304) return { entries: [], sha: messagesSha, changed: false }
  if (res.status === 404) return { entries: [], sha: '',          changed: false }
  if (!res.ok) throw new GitHubError(res.status, await res.text())

  messagesEtag = res.headers.get('ETag') ?? ''
  const file   = await res.json() as { content: string; sha: string }
  messagesSha  = file.sha
  const json   = atob(file.content.replace(/\n/g, ''))
  return { entries: JSON.parse(json) as MessageEntry[], sha: file.sha, changed: true }
}

export async function writeMessage(
  entry: MessageEntry,
  currentEntries: MessageEntry[],
  currentSha: string,
): Promise<string> {
  const now   = Date.now()
  const fresh = [
    ...currentEntries.filter(e => now - new Date(e.t).getTime() < KEEP_MSG_MS),
    entry,
  ]
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(fresh))))

  const body: Record<string, string> = {
    message: `msg [${entry.t}]`,
    content: encoded,
  }
  if (currentSha) body.sha = currentSha   // 新規作成時は sha なし

  const res = await fetch(MESSAGES_URL, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(body),
  })

  if (res.status === 409) throw new ConflictError()
  if (!res.ok) throw new GitHubError(res.status, await res.text())

  const result = await res.json() as { content: { sha: string } }
  messagesEtag = ''
  messagesSha  = result.content.sha
  return result.content.sha
}

// ── エラークラス ──────────────────────────────────────────────────────────────

export class ConflictError extends Error {
  constructor() { super('409 Conflict'); this.name = 'ConflictError' }
}

export class GitHubError extends Error {
  constructor(public status: number, message: string) {
    super(`GitHub API ${status}: ${message}`)
    this.name = 'GitHubError'
  }
}
