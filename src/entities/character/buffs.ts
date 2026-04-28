import { type RosterCharacter } from "./types"

/**
 * 스펠 아이콘 CDN URL 헬퍼
 * https://wow.zamimg.com/images/wow/icons/medium/{icon}.jpg
 */
export const wowheadIconUrl = (icon: string) =>
  `https://wow.zamimg.com/images/wow/icons/medium/${icon}.jpg`

export type BuffCategory = "블러드" | "전투부활" | "시너지" | "외생기" | "공생기" | "유틸"

export type BuffKey =
  // === 블러드 ===
  | "heroism" // 피의 욕망·영웅심 / 시간 왜곡 / 영원의 쇄도 / 원초적 분노
  // === 전투 부활 ===
  | "battleRez" // 환생·아군 되살리기·구제 등
  // === 시너지 (공격대 전체 통계 버프) ===
  | "arcaneIntellect" // 신비한 지능 — 법사
  | "atrophicPoison" // 위축의 독 — 도적
  | "battleShout" // 전투의 외침 — 전사
  | "blessingOfTheBronze" // 청동용군단의 축복 — 기원사
  | "chaosBrand" // 혼돈의 낙인 — 악마사냥꾼
  | "concentrationAura" // 집중의 오라 — 팔라딘
  | "devoutionAura" // 헌신의 오라 — 팔라딘
  | "huntersMark" // 사냥꾼의 징표 — 사냥꾼
  | "markOfTheWild" // 야생의 징표 — 드루이드
  | "mysticTouch" // 신비한 손길 — 수도사
  | "powerWordFortitude" // 신의 권능: 인내 — 사제
  | "skyfury" // 하늘의 격노 — 주술사
  // === 외생기 (개인 방어 쿨기) ===
  | "blessingOfSacrifice" // 희생의 축복 — 팔라딘
  | "guardianSpirit" // 수호 영혼 — 신성 사제
  | "innervate" // 정신 자극 — 드루이드 (힐러 마나)
  | "ironBark" // 무쇠껍질 — 드루이드
  | "lifeCocoon" // 기의 고치 — 안개술사
  | "painSuppression" // 고통 억제 — 수양 사제
  | "powerInfusion" // 마력 주입 — 사제
  // === 공생기 (공격대 광역 방어 쿨기) ===
  | "antiMagicZone" // 대마법 지대 — 죽음의 기사
  | "auraMastery" // 오라 숙련 — 신기 팔라딘
  | "darkness" // 어둠 — 악마사냥꾼
  | "powerWordBarrier" // 신의 권능: 방벽 — 수양 사제
  | "rallying" // 재집결의 함성 — 전사
  // === 유틸 ===
  | "conjureRefreshment" // 원기 회복의 식탁 창조 — 법사
  | "curseOfTongues" // 언어의 저주 — 흑마법사
  | "deathGrip" // 죽음의 손아귀 — 죽음의 기사
  | "demonicGateway" // 악마의 관문 — 흑마법사
  | "healthstone" // 생명석 — 흑마법사
  | "shroudOfConcealment" // 은폐의 장막 — 도적
  | "soulstone" // 영혼석 — 흑마법사
  | "stampedingRoar" // 쇄도의 포효 — 드루이드
  | "windRush" // 바람 질주 토템 — 주술사

interface BuffSource {
  category: BuffCategory
  icon: string
  label: string
  spellId: number
  specIds: number[]
}

const BUFF_SOURCES: Record<BuffKey, BuffSource> = {
  // ─── 블러드 ───────────────────────────────────────────────────────────
  heroism: {
    category: "블러드",
    icon: "ability_shaman_heroism",
    label: "블러드",
    specIds: [
      262,
      263,
      264, // 주술사 전체
      62,
      63,
      64, // 법사 전체
      1467,
      1468,
      1473, // 기원사 전체
      253, // 야수조련사 사냥꾼 (외래 야수 펫 필요)
    ],
    spellId: 32182,
  },

  // ─── 전투 부활 ────────────────────────────────────────────────────────
  battleRez: {
    category: "전투부활",
    icon: "spell_nature_reincarnation",
    label: "전투 부활",
    specIds: [
      102,
      103,
      104,
      105, // 드루이드 전체 (환생)
      250,
      251,
      252, // 죽음의 기사 전체 (아군 되살리기)
      65,
      66,
      70, // 팔라딘 전체 (구제)
      268,
      269,
      270, // 수도사 전체 (소생의 차)
      1467,
      1468,
      1473, // 기원사 전체 (소생)
    ],
    spellId: 20484,
  },

  // ─── 시너지 ───────────────────────────────────────────────────────────
  arcaneIntellect: {
    category: "시너지",
    icon: "spell_holy_magicalsentry",
    label: "신비한 지능 (법사) — 지능 3% 증가",
    specIds: [62, 63, 64],
    spellId: 1459,
  },
  atrophicPoison: {
    category: "시너지",
    icon: "ability_rogue_nervesofsteel",
    label: "위축의 독 (도적) — 적 공격력 3% 감소",
    specIds: [259, 260, 261],
    spellId: 381637,
  },
  battleShout: {
    category: "시너지",
    icon: "ability_warrior_battleshout",
    label: "전투의 외침 (전사) — 공격력 5% 증가",
    specIds: [71, 72, 73],
    spellId: 6673,
  },
  blessingOfTheBronze: {
    category: "시너지",
    icon: "ability_evoker_blessingofthebronze",
    label: "청동용군단의 축복 (기원사) — 주요 이동기 재사용 15% 감소",
    specIds: [1467, 1468, 1473],
    spellId: 364342,
  },
  chaosBrand: {
    category: "시너지",
    icon: "ability_demonhunter_empowerwards",
    label: "혼돈의 낙인 (악마사냥꾼) — 마법 피해 3% 증가",
    specIds: [577, 581],
    spellId: 255260,
  },
  concentrationAura: {
    category: "시너지",
    icon: "spell_holy_mindsooth",
    label: "집중의 오라 (팔라딘) — 침묵·방해 효과 30% 단축",
    specIds: [65, 66, 70],
    spellId: 317920,
  },
  devoutionAura: {
    category: "시너지",
    icon: "spell_holy_devotionaura",
    label: "헌신의 오라 (팔라딘) — 받는 피해 3% 감소",
    specIds: [65, 66, 70],
    spellId: 465,
  },

  huntersMark: {
    category: "시너지",
    icon: "ability_hunter_markedfordeath",
    label: "사냥꾼의 징표 (사냥꾼) — 대상 받는 피해 3% 증가",
    specIds: [253, 254, 255],
    spellId: 257284,
  },
  markOfTheWild: {
    category: "시너지",
    icon: "spell_nature_regeneration",
    label: "야생의 징표 (드루이드) — 유연성 3% 증가",
    specIds: [102, 103, 104, 105],
    spellId: 1126,
  },
  mysticTouch: {
    category: "시너지",
    icon: "ability_monk_sparring",
    label: "신비한 손길 (수도사) — 물리 피해 5% 증가",
    specIds: [268, 269, 270],
    spellId: 8647,
  },
  powerWordFortitude: {
    category: "시너지",
    icon: "spell_holy_wordfortitude",
    label: "신의 권능: 인내 (사제) — 체력 5% 증가",
    specIds: [256, 257, 258],
    spellId: 21562,
  },
  skyfury: {
    category: "시너지",
    icon: "achievement_raidprimalist_windelemental",
    label: "하늘의 격노 (주술사) — 특기 2% + 자동공격 연타",
    specIds: [262, 263, 264],
    spellId: 462854,
  },

  // ─── 외생기 ───────────────────────────────────────────────────────────
  blessingOfSacrifice: {
    category: "외생기",
    icon: "spell_holy_sealofsacrifice",
    label: "희생의 축복 (팔라딘) — 대상 피해 30% 감소 (자신에게 전가, 12초)",
    specIds: [65, 66, 70],
    spellId: 6940,
  },
  guardianSpirit: {
    category: "외생기",
    icon: "spell_holy_guardianspirit",
    label: "수호 영혼 (신성 사제) — 치유량 60%↑ + 치사 시 생명력 40% 소생 (10초)",
    specIds: [257],
    spellId: 47788,
  },
  innervate: {
    category: "외생기",
    icon: "spell_nature_lightning",
    label: "정신 자극 (드루이드) — 8초간 마나 소모 없이 주문 시전",
    specIds: [102, 103, 104, 105],
    spellId: 29166,
  },
  ironBark: {
    category: "외생기",
    icon: "spell_druid_ironbark",
    label: "무쇠껍질 (드루이드) — 대상 피해 20% 감소",
    specIds: [102, 103, 104, 105],
    spellId: 102342,
  },
  lifeCocoon: {
    category: "외생기",
    icon: "ability_monk_chicocoon",
    label: "기의 고치 (안개술사) — 대형 흡수 보호막 + 주기 치유 50%↑ (12초)",
    specIds: [270],
    spellId: 116849,
  },
  painSuppression: {
    category: "외생기",
    icon: "spell_holy_painsupression",
    label: "고통 억제 (수양 사제) — 대상 피해 40% 감소",
    specIds: [256],
    spellId: 33206,
  },
  powerInfusion: {
    category: "외생기",
    icon: "spell_holy_powerinfusion",
    label: "마력 주입 (사제) — 대상 가속 20% 증가 (15초)",
    specIds: [256, 257, 258],
    spellId: 10060,
  },

  // ─── 공생기 ───────────────────────────────────────────────────────────
  antiMagicZone: {
    category: "공생기",
    icon: "spell_deathknight_antimagiczone",
    label: "대마법 지대 (죽음의 기사) — 마법 피해 15% 감소 (6초)",
    specIds: [250, 251, 252],
    spellId: 51052,
  },
  auraMastery: {
    category: "공생기",
    icon: "spell_holy_auramastery",
    label: "오라 숙련 (신기 팔라딘) — 헌신의 오라 12% / 집중의 오라 침묵 면역 (8초)",
    specIds: [65],
    spellId: 31821,
  },
  darkness: {
    category: "공생기",
    icon: "ability_demonhunter_darkness",
    label: "어둠 (악마사냥꾼) — 구역 내 피해 회피 15% 확률 (8초)",
    specIds: [577, 581],
    spellId: 196718,
  },
  powerWordBarrier: {
    category: "공생기",
    icon: "spell_holy_powerwordbarrier",
    label: "신의 권능: 방벽 (수양 사제) — 구역 내 피해 20% 감소 (10초)",
    specIds: [256],
    spellId: 62618,
  },
  rallying: {
    category: "공생기",
    icon: "ability_warrior_rallyingcry",
    label: "재집결의 함성 (전사) — 공격대 최대 체력 10% 증가 (10초)",
    specIds: [71, 72, 73],
    spellId: 97462,
  },

  // ─── 유틸 ─────────────────────────────────────────────────────────────
  conjureRefreshment: {
    category: "유틸",
    icon: "inv_misc_food_15",
    label: "원기 회복의 식탁 창조 (법사) — 공격대 음식 제공",
    specIds: [62, 63, 64],
    spellId: 43987,
  },
  curseOfTongues: {
    category: "유틸",
    icon: "spell_shadow_curseoftounges",
    label: "언어의 저주 (흑마법사) — 적 주문 시전 시간 30% 증가",
    specIds: [265, 266, 267],
    spellId: 1714,
  },
  deathGrip: {
    category: "유틸",
    icon: "spell_deathknight_strangulate",
    label: "죽음의 손아귀 (죽음의 기사) — 적 단일 끌어당기기",
    specIds: [250, 251, 252],
    spellId: 49576,
  },
  demonicGateway: {
    category: "유틸",
    icon: "spell_warlock_demonicportal_green",
    label: "악마의 관문 (흑마법사) — 공격대 이동 포탈 설치",
    specIds: [265, 266, 267],
    spellId: 111771,
  },
  healthstone: {
    category: "유틸",
    icon: "warlock_-healthstone",
    label: "생명석 (흑마법사) — 체력 25% 즉시 회복 아이템 지급",
    specIds: [265, 266, 267],
    spellId: 6262,
  },
  shroudOfConcealment: {
    category: "유틸",
    icon: "ability_rogue_shroudofconcealment",
    label: "은폐의 장막 (도적) — 공격대 15초 그룹 은신",
    specIds: [259, 260, 261],
    spellId: 114018,
  },
  soulstone: {
    category: "유틸",
    icon: "spell_shadow_soulgem",
    label: "영혼석 (흑마법사) — 사전 부활 1명 (전투 부활과 별개)",
    specIds: [265, 266, 267],
    spellId: 20707,
  },
  stampedingRoar: {
    category: "유틸",
    icon: "spell_druid_stampedingroar_cat",
    label: "쇄도의 포효 (드루이드) — 공격대 이동속도 60% 증가 (8초)",
    specIds: [102, 103, 104, 105],
    spellId: 106898,
  },
  windRush: {
    category: "유틸",
    icon: "ability_shaman_windwalktotem",
    label: "바람 질주 토템 (주술사) — 공격대 이동속도 40% 증가 (5초)",
    specIds: [262, 263, 264],
    spellId: 192077,
  },
} satisfies Record<BuffKey, BuffSource>

export interface BuffCoverage {
  category: BuffCategory
  count: number
  covered: boolean
  icon: string
  key: BuffKey
  label: string
  providers: string[]
  spellId: number
}

export const COUNTABLE_CATEGORIES: BuffCategory[] = [
  "블러드",
  "전투부활",
  "시너지",
  "외생기",
  "공생기",
  "유틸",
]

export const BUFF_CATEGORIES: BuffCategory[] = [
  "블러드",
  "전투부활",
  "시너지",
  "외생기",
  "공생기",
  "유틸",
]

export const analyzeBuffCoverage = (characters: RosterCharacter[]): BuffCoverage[] =>
  (Object.entries(BUFF_SOURCES) as Array<[BuffKey, BuffSource]>).map(([key, source]) => {
    const matchingCharacters = characters.filter((character) =>
      source.specIds.includes(character.specId)
    )
    const providers = matchingCharacters.map(
      (character) => `${character.name} (${character.specName})`
    )
    const isCountable = (COUNTABLE_CATEGORIES as string[]).includes(source.category)

    return {
      category: source.category,
      count: isCountable ? matchingCharacters.length : 0,
      covered: providers.length > 0,
      icon: source.icon,
      key,
      label: source.label,
      providers,
      spellId: source.spellId,
    }
  })
