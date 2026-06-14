import type { MapData } from '../types'

export const MAPS: MapData[] = [
  {
    id: '2@nls1',
    label: '地表',
    imagePath: './maps/2@nls1.JPG',
    imageWidth: 811,
    imageHeight: 585,
    areas: [
      // ● 入手場所（黄色）
      { id: 'shoko',         name: '書庫',         color: 'yellow',     zone: 'top-left',     points: [[65,104],[145,104],[145,132],[65,132]] },
      { id: 'hikaeshitsu',   name: '控え室',       color: 'yellow',     zone: 'middle-left',  points: [[18,258],[150,258],[150,284],[18,284]] },
      { id: 'gakushushitsu', name: '学習室',       color: 'yellow',     zone: 'bottom-left',  points: [[60,480],[205,480],[205,510],[60,510]] },
      { id: 'sojiyogu',      name: '掃除用具',     color: 'yellow',     zone: 'top-right',    points: [[300,152],[425,152],[425,178],[300,178]] },
      { id: 'gaimon_north',  name: '外門',         color: 'yellow',     zone: 'top-right',    points: [[393,168],[512,168],[512,195],[393,195]] },
      { id: 'chuo',          name: '中央',         color: 'yellow',     zone: 'bottom-right', points: [[391,421],[527,421],[527,448],[391,448]] },
      { id: 'renraku',       name: '連絡通路東',   color: 'yellow',     zone: 'top-center',   points: [[155,208],[272,208],[272,228],[155,228]] },
      { id: 'chika',         name: '地下',         color: 'yellow',     zone: 'top-center',   points: [[242,188],[283,188],[283,207],[242,207]] },
      { id: 'kabocha',       name: 'かぼちゃ倉庫', color: 'yellow',     zone: 'bottom-center',points: [[213,449],[352,449],[352,467],[213,467]] },
      // ■ 使用場所（水色）
      { id: 'gaimon_center', name: '外門（使用）', color: 'cyan',       zone: 'middle-right', points: [[302,250],[393,250],[393,272],[302,272]] },
      // ★ 中段右: 外門(使用) → ワイン倉庫
      { id: 'wine',          name: 'ワイン倉庫',   color: 'yellow',     zone: 'middle-right', points: [[307,322],[415,322],[415,342],[307,342]] },
      // Boss（緑）- 中段中央: Boss①→Boss②→執務室
      { id: 'boss1',         name: 'Boss①（物）', color: 'green',      zone: 'middle-center',points: [] },
      { id: 'boss2',         name: 'Boss②（魔）', color: 'green',      zone: 'middle-center',points: [] },
      { id: 'shitsumushitsu',name: '執務室',       color: 'yellow',     zone: 'middle-center',points: [[200,325],[295,325],[295,343],[200,343]] },
    ],
  },
  {
    id: '2@nls2',
    label: '修道院01',
    imagePath: './maps/2@nls2.JPG',
    imageWidth: 817,
    imageHeight: 589,
    areas: [
      // ★ Boss（緑）
      { id: 'boss1',           name: 'Boss①',          color: 'green',      zone: 'top-left',      points: [] },
      { id: 'boss2',           name: 'Boss②',          color: 'green',      zone: 'middle-right',  points: [] },
      // ● 入手場所（黄色）
      { id: 'wine',            name: 'ワイン',          color: 'yellow',     zone: 'top-center',    points: [] },
      { id: 'kabocha_1',       name: 'かぼちゃ',        color: 'yellow',     zone: 'top-center',    points: [] },
      { id: 'higashi_hiro',    name: '東広間',          color: 'yellow',     zone: 'bottom-center', points: [] },
      { id: 'shukubo_1_shita', name: '宿泊室①',        color: 'yellow',     zone: 'bottom-left',   points: [] },
      // ■ 使用場所（薄緑）
      { id: 'wine_soko',       name: 'ワイン倉庫(使用)',      color: 'lightgreen', zone: 'top-center',    points: [] },
      { id: 'kabocha_soko',    name: 'かぼちゃ倉庫(使用)',   color: 'lightgreen', zone: 'top-center',    points: [] },
      { id: 'hikaeshitsu',     name: '控え室(使用)',          color: 'lightgreen', zone: 'middle-left',   points: [] },
      { id: 'shukubo_2_ue',    name: '宿泊室②',              color: 'lightgreen', zone: 'middle-center', points: [] },
      { id: 'shoko',           name: '書庫(使用)',            color: 'lightgreen', zone: 'middle-right',  points: [] },
      { id: 'shukubo_1',       name: '宿泊室①(使用)',        color: 'lightgreen', zone: 'middle-center', points: [] },
      { id: 'chika',           name: '地下(使用)',            color: 'lightgreen', zone: 'middle-right',  points: [] },
      { id: 'sojiyogu',        name: '掃除用具(使用)',        color: 'lightgreen', zone: 'bottom-left',   points: [] },
      { id: 'shukubo_2_shita', name: '宿泊室②(使用)',        color: 'lightgreen', zone: 'bottom-center', points: [] },
      { id: 'kabocha_2',       name: 'かぼちゃ(使用)',       color: 'lightgreen', zone: 'bottom-right',  points: [] },
      // ゾーンなし（3×3グリッドに表示しない）
      { id: 'tensogen',        name: '転送元(使用)',          color: 'lightgreen', points: [] },
      { id: 'tensosaki',       name: '転送先(使用)',          color: 'lightgreen', points: [] },
    ],
  },
  {
    id: '2@nls3',
    label: '修道院02',
    imagePath: './maps/2@nls3.JPG',
    imageWidth: 810,
    imageHeight: 586,
    splitZoneLayout: true,
    infoLines: [
      'チーム速攻：根源→叡知→修道院03→左下で監獄鍵→右下で監獄東鍵→右上で暴食魔王分身',
    ],
    areas: [
      // ★ Boss（緑）
      { id: 'boss1',                  name: 'Boss①',              color: 'green',      zone: 'middle-center', points: [] },
      // 上段左: 北西小部屋①(使用)、②(使用)、③(使用)、北広間東、祭祀場広間、炊事場
      { id: 'nw_kobeya_1_soko',       name: '北西小部屋①(使用)', color: 'lightgreen', zone: 'top-left',      points: [] },
      { id: 'nw_kobeya_2_soko',       name: '北西小部屋②(使用)', color: 'lightgreen', zone: 'top-left',      points: [] },
      { id: 'nw_kobeya_3_soko',       name: '北西小部屋③(使用)', color: 'lightgreen', zone: 'top-left',      points: [] },
      { id: 'kita_hiro_higashi',       name: '北広間東',            color: 'yellow',     zone: 'top-left',      points: [] },
      { id: 'saishi_hiroba',           name: '祭祀場広間',          color: 'yellow',     zone: 'top-left',      points: [] },
      { id: 'suijoba',                 name: '炊事場',              color: 'yellow',     zone: 'top-left',      points: [] },
      // 上段中央: ワイン(使用)、北広間東(使用)、北広間西(使用)
      { id: 'wine',                    name: 'ワイン(使用)',        color: 'lightgreen', zone: 'top-center',    points: [] },
      { id: 'kita_hiro_higashi_soko',  name: '北広間東(使用)',      color: 'lightgreen', zone: 'top-center',    points: [] },
      { id: 'kita_hiro_nishi_soko',    name: '北広間西(使用)',      color: 'lightgreen', zone: 'top-center',    points: [] },
      // 上段右: 連絡通路北西、祭祀場壇上、北広間西、北東小部屋①(使用)、②(使用)、③(使用)
      { id: 'renraku_nw',              name: '連絡通路北西',        color: 'yellow',     zone: 'top-right',     points: [] },
      { id: 'saishi_danju',            name: '祭祀場壇上',          color: 'yellow',     zone: 'top-right',     points: [] },
      { id: 'kita_hiro_nishi',         name: '北広間西',            color: 'yellow',     zone: 'top-right',     points: [] },
      { id: 'ne_kobeya_1_soko',        name: '北東小部屋①(使用)', color: 'lightgreen', zone: 'top-right',     points: [] },
      { id: 'ne_kobeya_2_soko',        name: '北東小部屋②(使用)', color: 'lightgreen', zone: 'top-right',     points: [] },
      { id: 'ne_kobeya_3_soko',        name: '北東小部屋③(使用)', color: 'lightgreen', zone: 'top-right',     points: [] },
      // 下段左: 北西小部屋①②③、学習室(使用)
      { id: 'nw_kobeya_1',             name: '北西小部屋①',        color: 'yellow',     zone: 'bottom-left',   points: [] },
      { id: 'nw_kobeya_2',             name: '北西小部屋②',        color: 'yellow',     zone: 'bottom-left',   points: [] },
      { id: 'nw_kobeya_3',             name: '北西小部屋③',        color: 'yellow',     zone: 'bottom-left',   points: [] },
      { id: 'gakushushitsu_soko',      name: '学習室(使用)',        color: 'lightgreen', zone: 'bottom-left',   points: [] },
      // 下段右: 北東小部屋①②③、執務室(使用)
      { id: 'ne_kobeya_1',             name: '北東小部屋①',        color: 'yellow',     zone: 'bottom-right',  points: [] },
      { id: 'ne_kobeya_2',             name: '北東小部屋②',        color: 'yellow',     zone: 'bottom-right',  points: [] },
      { id: 'ne_kobeya_3',             name: '北東小部屋③',        color: 'yellow',     zone: 'bottom-right',  points: [] },
      { id: 'shitsumushitsu_soko',     name: '執務室(使用)',        color: 'lightgreen', zone: 'bottom-right',  points: [] },
      // ゾーンなし（3×3グリッドに表示しない）
      { id: 'kita_hiro',               name: '北広間',              color: 'yellow',     points: [] },
      { id: 'gakushushitsu',           name: '学習室',              color: 'yellow',     points: [] },
      { id: 'shitsumushitsu',          name: '執務室',              color: 'yellow',     points: [] },
      { id: 'ne_kobeya_ue',            name: '北東小部屋(上)',      color: 'yellow',     points: [] },
      { id: 'ne_kobeya_shita',         name: '北東小部屋(下)',      color: 'yellow',     points: [] },
      { id: 'tensosaki',               name: '転送先',              color: 'lightgreen', points: [] },
      { id: 'chuo',                    name: '中央',                color: 'lightgreen', points: [] },
    ],
  },
  {
    id: '2@nls4',
    label: '修道院03',
    imagePath: './maps/2@nls4.JPG',
    imageWidth: 821,
    imageHeight: 591,
    areas: [
      // 上段左: 独房①②(使用)、踊り場
      { id: 'dokuso_soko_tl',        name: '独房①②(使用)',    color: 'lightgreen', zone: 'top-left',      points: [] },
      { id: 'odori',                 name: '踊り場',            color: 'yellow',     zone: 'top-left',      points: [] },
      // 上段中央: 独房①②(使用)
      { id: 'dokuso_soko_tc',        name: '独房①②(使用)',    color: 'lightgreen', zone: 'top-center',    points: [] },
      // 上段右: 独房①②(使用)、牢獄西、Boss③、MVP④
      { id: 'dokuso_soko_tr',        name: '独房①②(使用)',    color: 'lightgreen', zone: 'top-right',     points: [] },
      { id: 'gokoku_nishi',          name: '牢獄西',            color: 'yellow',     zone: 'top-right',     points: [] },
      { id: 'boss3',                 name: 'Boss③',             color: 'green',      zone: 'top-right',     points: [] },
      { id: 'mvp4',                  name: 'MVP④',              color: 'green',      zone: 'top-right',     points: [] },
      // 中段左: 牢獄西(使用)、連絡通路北西(使用)、踊り場(使用)
      { id: 'gokoku_nishi_soko',     name: '牢獄西(使用)',      color: 'lightgreen', zone: 'middle-left',   points: [] },
      { id: 'renraku_nw_soko',       name: '連絡通路北西(使用)',color: 'lightgreen', zone: 'middle-left',   points: [] },
      { id: 'odori_soko',            name: '踊り場(使用)',       color: 'lightgreen', zone: 'middle-left',   points: [] },
      // 中段中央: 中央通路西、中央通路西(使用)、Boss①
      { id: 'chuo_tsuro_nishi',      name: '中央通路西',        color: 'yellow',     zone: 'middle-center', points: [] },
      { id: 'chuo_tsuro_nishi_soko', name: '中央通路西(使用)',  color: 'lightgreen', zone: 'middle-center', points: [] },
      { id: 'boss1',                 name: 'Boss①',             color: 'green',      zone: 'middle-center', points: [] },
      // 中段右: 牢獄東(使用)、東広間(使用)、連絡通路東(使用)
      { id: 'gokoku_higashi_soko',   name: '牢獄東(使用)',      color: 'lightgreen', zone: 'middle-right',  points: [] },
      { id: 'higashi_hiro_soko',     name: '東広間(使用)',      color: 'lightgreen', zone: 'middle-right',  points: [] },
      { id: 'renraku_higashi_soko',  name: '連絡通路東(使用)',  color: 'lightgreen', zone: 'middle-right',  points: [] },
      // 下段左: 祭祀場広間(使用)、祭祀場壇上(使用)、独房①②
      { id: 'saishi_hiroba_soko',    name: '祭祀場広間(使用)',  color: 'lightgreen', zone: 'bottom-left',   points: [] },
      { id: 'saishi_danju_soko',     name: '祭祀場壇上(使用)',  color: 'lightgreen', zone: 'bottom-left',   points: [] },
      { id: 'dokuso_bl',             name: '独房①②',           color: 'yellow',     zone: 'bottom-left',   points: [] },
      // 下段右: 炊事場(使用)、牢獄東、Boss②
      { id: 'suijoba',               name: '炊事場(使用)',      color: 'lightgreen', zone: 'bottom-right',  points: [] },
      { id: 'gokoku_higashi',        name: '牢獄東',            color: 'yellow',     zone: 'bottom-right',  points: [] },
      { id: 'boss2',                 name: 'Boss②',             color: 'green',      zone: 'bottom-right',  points: [] },
      // ゾーンなし（旧IDをprogress.json互換のために保持）
      { id: 'dokuso_1',              name: '独房①②-1',         color: 'yellow',     points: [] },
      { id: 'dokuso_2',              name: '独房①②-2',         color: 'yellow',     points: [] },
      { id: 'dokuso_3',              name: '独房①②-3',         color: 'yellow',     points: [] },
      { id: 'dokuso_4',              name: '独房①②-4',         color: 'yellow',     points: [] },
      { id: 'dokuso_5',              name: '独房①②-5',         color: 'yellow',     points: [] },
      { id: 'dokuso_6',              name: '独房①②-6',         color: 'yellow',     points: [] },
      { id: 'odori_nishi',           name: '踊り場(北西)',       color: 'yellow',     points: [] },
      { id: 'odori_naka',            name: '踊り場(中)',         color: 'yellow',     points: [] },
      { id: 'gokoku_nishi_ue',       name: '牢獄西(上)',         color: 'yellow',     points: [] },
      { id: 'gokoku_nishi_migi',     name: '牢獄西(右)',         color: 'yellow',     points: [] },
      { id: 'renraku_nw',            name: '連絡通路北西',       color: 'yellow',     points: [] },
      { id: 'gokoku_higashi_ue',     name: '牢獄東(上)',         color: 'yellow',     points: [] },
      { id: 'gokoku_higashi_shita',  name: '牢獄東(下)',         color: 'yellow',     points: [] },
      { id: 'renraku_higashi',       name: '連絡通路東',         color: 'yellow',     points: [] },
      { id: 'saishi_hiroba',         name: '祭祀場広間',         color: 'yellow',     points: [] },
      { id: 'saishi_danju',          name: '祭祀場壇上',         color: 'yellow',     points: [] },
      { id: 'dokuso_shita',          name: '独房①②(下)',        color: 'yellow',     points: [] },
      { id: 'higashi_hiro',          name: '東広間',             color: 'yellow',     points: [] },
    ],
  },
]
