// ============================================================
//  GitHub 設定  ← ここだけ編集すれば動く
// ============================================================

export const GH = {
  /** GitHub Personal Access Token
   *  必要な権限: Contents → Read and Write（fine-grained PAT 推奨）
   *  取得: GitHub → Settings → Developer settings → Personal access tokens
   *  ⚠️  このファイルはビルド後に公開されます。
   *      PAT はこのリポジトリ専用の fine-grained token にしてください。
   *      最悪の場合でも他のリポジトリには影響しません。
   */
  TOKEN: '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',

  /** GitHub ユーザー名（または Organization 名） */
  OWNER: 'Beji-Ta',

  /** リポジトリ名 */
  REPO: 'singularity-the-nameless-island',

  /** 攻略状況を保存するファイルパス（リポジトリルートからの相対） */
  FILE: 'progress.json',

  /** ポーリング間隔 (ms)  ※ GitHub API 上限: 認証済み 5000回/時 */
  POLL_MS: 8_000,
} as const
