import { GH } from '../config'
import type { ProgressData } from '../types'

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
