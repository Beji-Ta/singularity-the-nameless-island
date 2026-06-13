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
      { id: 'shoko',         name: '書庫',       points: [[65,104],[145,104],[145,132],[65,132]] },
      { id: 'hikaeshitsu',   name: '控え室',     points: [[18,258],[150,258],[150,284],[18,284]] },
      { id: 'gakushushitsu', name: '学習室',     points: [[60,480],[205,480],[205,510],[60,510]] },
      { id: 'sojiyogu',      name: '掃除用具',   points: [[300,152],[425,152],[425,178],[300,178]] },
      { id: 'gaimon_north',  name: '外門',       points: [[393,168],[512,168],[512,195],[393,195]] },
      { id: 'chuo',          name: '中央',       points: [[391,421],[527,421],[527,448],[391,448]] },
      { id: 'renraku',       name: '連絡通路東', points: [[155,208],[272,208],[272,228],[155,228]] },
      { id: 'chika',         name: '地下',       points: [[242,188],[283,188],[283,207],[242,207]] },
      { id: 'shitsumushitsu',name: '執務室',     points: [[200,325],[295,325],[295,343],[200,343]] },
      { id: 'wine',          name: 'ワイン倉庫', points: [[307,322],[415,322],[415,342],[307,342]] },
      { id: 'kabocha',       name: 'かぼちゃ倉庫', points: [[213,449],[352,449],[352,467],[213,467]] },
      // ■ 使用場所（薄緑）
      { id: 'gaimon_center', name: '外門（使用）', points: [[302,250],[393,250],[393,272],[302,272]] },
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
