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
        points: [[40,55],[180,55],[180,190],[40,190]],
      },
      {
        id: 'hikaeshitsu',
        name: '控え室',
        points: [[15,238],[165,238],[165,365],[15,365]],
      },
      {
        id: 'gakushushitsu',
        name: '学習室',
        points: [[50,425],[210,425],[210,537],[50,537]],
      },
      {
        id: 'renraku',
        name: '連絡通路東',
        points: [[138,148],[272,148],[272,240],[138,240]],
      },
      {
        id: 'chika',
        name: '地下',
        points: [[198,103],[314,103],[314,227],[198,227]],
      },
      {
        id: 'sojiyogu',
        name: '掃除用具',
        points: [[294,53],[442,53],[442,202],[294,202]],
      },
      {
        id: 'gaimon_north',
        name: '外門',
        points: [[426,128],[574,128],[574,253],[426,253]],
      },
      {
        id: 'shudoin01',
        name: '修道院 01',
        points: [[148,218],[298,218],[298,300],[148,300]],
      },
      {
        id: 'gaimon_center',
        name: '外門（中央）',
        points: [[294,216],[426,216],[426,300],[294,300]],
      },
      {
        id: 'shitsumushitsu',
        name: '執務室',
        points: [[146,294],[298,294],[298,390],[146,390]],
      },
      {
        id: 'wine',
        name: 'ワイン倉庫',
        points: [[290,280],[502,280],[502,393],[290,393]],
      },
      {
        id: 'kabocha',
        name: 'かぼちゃ倉庫',
        points: [[142,383],[370,383],[370,503],[142,503]],
      },
      {
        id: 'chuo',
        name: '中央',
        points: [[443,350],[607,350],[607,507],[443,507]],
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
