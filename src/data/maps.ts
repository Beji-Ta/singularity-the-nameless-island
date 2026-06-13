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
      {
        id: 'shoko',
        name: '書庫',
        description: '左上エリア',
        points: [
          [62,  78],
          [200, 78],
          [200, 195],
          [62,  195],
        ],
      },
      {
        id: 'hikaeshitsu',
        name: '控え室',
        description: '左中央エリア',
        points: [
          [28,  252],
          [162, 252],
          [162, 350],
          [28,  350],
        ],
      },
      {
        id: 'sojiyogu',
        name: '掃除用具',
        description: '上中央エリア',
        points: [
          [303,  82],
          [432,  82],
          [432, 200],
          [303, 200],
        ],
      },
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
