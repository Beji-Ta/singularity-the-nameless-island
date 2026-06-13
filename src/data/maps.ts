import type { MapData } from '../types'

/**
 * マップ・エリア定義
 *
 * points は画像ピクセル座標系 [x, y] の多角形頂点（画像実寸基準）。
 * SVG の viewBox が画像実寸に合っているため、
 * ブラウザの DevTools で画像上の座標を確認して書き換えるだけで反映される。
 *
 * 2@nls1.JPG の実寸: 811 × 585 px
 */
export const MAPS: MapData[] = [
  {
    id: '2@nls1',
    label: '地表',
    imagePath: './maps/2@nls1.JPG',
    imageWidth: 811,
    imageHeight: 585,
    areas: [
      // ● 入手場所（黄色）
      { id: 'shoko',        name: '書庫',     points: [[60,101],[148,101],[148,127],[60,127]] },
      { id: 'hikaeshitsu',  name: '控え室',   points: [[22,282],[148,282],[148,308],[22,308]] },
      { id: 'gakushushitsu',name: '学習室',   points: [[56,481],[208,481],[208,507],[56,507]] },
      { id: 'sojiyogu',     name: '掃除用具', points: [[284,77],[440,77],[440,103],[284,103]] },
      { id: 'gaimon_north', name: '外門',     points: [[436,162],[555,162],[555,188],[436,188]] },
      { id: 'chuo',         name: '中央',     points: [[444,417],[568,417],[568,443],[444,443]] },
      // ■ 使用場所（薄緑）
      { id: 'gaimon_center',name: '外門（使用）', points: [[302,250],[393,250],[393,272],[302,272]] },
    ],
  },
  {
    id: '2@nls2',
    label: '修道院01',
    imagePath: './maps/2@nls2.JPG',
    imageWidth: 458,
    imageHeight: 457,
    areas: [], // 後から追加
  },
  {
    id: '2@nls3',
    label: '修道院02',
    imagePath: './maps/2@nls3.JPG',
    imageWidth: 456,
    imageHeight: 454,
    areas: [], // 後から追加
  },
  {
    id: '2@nls4',
    label: '修道院03',
    imagePath: './maps/2@nls4.JPG',
    imageWidth: 453,
    imageHeight: 458,
    areas: [], // 後から追加
  },
]
