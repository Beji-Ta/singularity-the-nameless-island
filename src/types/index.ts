export type AreaStatus = 'unexplored' | 'cleared'

/** progress.json の構造 */
export interface ProgressData {
  lastUpdated: string
  /** mapId → areaId → status */
  maps: Record<string, Record<string, AreaStatus>>
}

export type Point = [number, number]

export type AreaColor = 'yellow' | 'lightgreen' | 'cyan' | 'green'
export type AreaZone  =
  'top-left'    | 'top-center'    | 'top-right'    |
  'middle-left' | 'middle-center' | 'middle-right' |
  'bottom-left' | 'bottom-center' | 'bottom-right'

export interface ClickEntry {
  id: string
  mapId: string
  x: number   // 0〜1（画像幅に対する比率）
  y: number   // 0〜1（画像高に対する比率）
  t: string   // ISO timestamp
}

export interface AreaData {
  id: string
  name: string
  points: Point[]
  color?: AreaColor
  zone?: AreaZone
  description?: string
}

export interface MapData {
  id: string
  label: string
  imagePath: string
  imageWidth: number
  imageHeight: number
  areas: AreaData[]
  /** true の場合、左右ゾーンを (使用)/非(使用) で2列分割して表示 */
  splitZoneLayout?: boolean
}
