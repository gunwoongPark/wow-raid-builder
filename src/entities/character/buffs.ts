import { type RosterCharacter } from "./types"

/**
 * 스펠 아이콘 CDN URL 헬퍼
 * https://wow.zamimg.com/images/wow/icons/medium/{icon}.jpg
 */
export const wowheadIconUrl = (icon: string) =>
  `https://wow.zamimg.com/images/wow/icons/medium/${icon}.jpg`

export type BuffKey =
  // === 핵심 ===
  | "heroism" // 피의 욕망·영웅심 (주술사) / 시간 왜곡 (법사) / 영원의 쇄도 (기원사) / 원초적 분노 (야수 사냥꾼)
  | "battleRez" // 전투 부활 (드루이드/죽기/팔라딘/수도사/기원사)
  // === 공대 버프 (Throughput) ===
  | "arcaneIntellect" // 신비한 지능 — 법사 (지능 3%)
  | "atrophicPoison" // 위축의 독 — 도적 (적 피해 3% 감소)
  | "battleShout" // 전투의 외침 — 전사 (공격력 5%)
  | "blessingOfTheBronze" // 청동용군단의 축복 — 기원사 전체 (이동기 재사용 15% 감소)
  | "chaosBrand" // 혼돈의 낙인 — 악마사냥꾼 (마법 피해 3% 증가)
  | "concentrationAura" // 집중의 오라 — 팔라딘 (침묵/방해 30% 단축)
  | "devoutionAura" // 헌신의 오라 — 팔라딘 (받는 피해 3% 감소)
  | "ebonMight" // 칠흑의 힘 — 증폭술사 전용 (특수 능력치 증폭)
  | "huntersMark" // 사냥꾼의 징표 — 사냥꾼 (받는 피해 3% 증가)
  | "markOfTheWild" // 야생의 징표 — 드루이드 (다용성 3%)
  | "mysticTouch" // 신비한 손길 — 수도사 (물리 피해 5% 증가)
  | "powerWordFortitude" // 신의 권능: 인내 — 사제 (체력 5%)
  | "skyfury" // 하늘의 격노 — 주술사 (특기 2% + 자동공격 연타 확률)
  // === 외생기 (개인 방어 쿨기) ===
  | "painSuppression" // 고통 억제 — 수양 사제 (피해 40% 감소)
  | "guardianSpirit" // 수호 영혼 — 신성 사제 (피해 감소 + 사망 시 소생)
  | "lifeCocoon" // 기의 고치 — 안개술사 (보호막 + 힐)
  | "ironBark" // 무쇠껍질 — 드루이드 (피해 20% 감소)
  | "blessingOfSacrifice" // 희생의 축복 — 팔라딘 (피해 30% 흡수)
  | "powerInfusion" // 마력 주입 — 사제 (하스트 25% 증가, 딜러 외생)
  | "innervate" // 정신 자극 — 드루이드 (힐러 마나 풀 회복)
  // === 공대 쿨기 (AoE 방어/특수) ===
  | "powerWordBarrier" // 신의 권능: 방벽 — 수양 사제 (구역 피해 25% 감소)
  | "darkness" // 어둠 — 악마사냥꾼 (구역 피해 20% 감소, 확률)
  | "antiMagicZone" // 대마법 지대 — 죽음의 기사 (마법 피해 20% 감소)
  | "rallying" // 재집결의 함성 — 전사 (체력 15% 증가)
  | "auraMastery" // 오라 숙련 — 신기 팔라딘 (헌신의 오라 2배)
  // === 유틸 ===
  | "stampedingRoar" // 쇄도의 포효 — 드루이드 (공대 이동속도 60%)
  | "windRush" // 바람 질주 토템 — 주술사 (공대 이동속도 60%)
  | "demonicGateway" // 악마의 관문 — 흑마법사 (공대 순간이동 포탈)
  | "magePortal" // 대규모 차원문 — 법사 (도시 집단 포탈)
  | "healthstone" // 생명석 — 흑마법사 (체력 25% 회복 아이템 제공)
  | "soulstone" // 영혼석 — 흑마법사 (사전 부활 1명)
  | "shroudOfConcealment" // 은폐의 장막 — 도적 (공대 15초 은신)

export type BuffCategory = "핵심" | "공대버프" | "외생기" | "공대쿨기" | "유틸"

interface BuffSource {
  category: BuffCategory
  icon: string
  label: string
  spellId: number
  specIds: number[]
}

const BUFF_SOURCES: Record<BuffKey, BuffSource> = {
  // ─── 핵심 ─────────────────────────────────────────────────────────────
  battleRez: {
    category: "핵심",
    icon: "spell_nature_reincarnation",
    label: "전투 부활",
    specIds: [
      102,
      103,
      104,
      105, // 드루이드 전체 (소생)
      250,
      251,
      252, // 죽음의 기사 전체 (동료 소환)
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
  heroism: {
    category: "핵심",
    icon: "ability_shaman_heroism",
    label:
      "피의 욕망·영웅심 (주술사) / 시간 왜곡 (법사) / 영원의 쇄도 (기원사) / 원초적 분노 (야수 사냥꾼)",
    specIds: [
      262,
      263,
      264, // 주술사 전체 (영웅심)
      62,
      63,
      64, // 법사 전체 (시간왜곡)
      1467,
      1468,
      1473, // 기원사 전체 (고대의 격노)
      253, // 야수조련사 사냥꾼 (원시의 격노 — 외래 야수 펫 필요)
    ],
    spellId: 32182,
  },

  // ─── 공대 버프 ────────────────────────────────────────────────────────
  arcaneIntellect: {
    category: "공대버프",
    icon: "spell_holy_magicalsentry",
    label: "신비한 지능 (법사) — 지능 3% 증가",
    specIds: [62, 63, 64], // 법사 전체
    spellId: 1459,
  },
  atrophicPoison: {
    category: "공대버프",
    icon: "ability_rogue_nervesofsteel",
    label: "위축의 독 (도적) — 적 피해 3% 감소",
    specIds: [259, 260, 261], // 도적 전체
    spellId: 381637,
  },
  battleShout: {
    category: "공대버프",
    icon: "ability_warrior_battleshout",
    label: "전투의 외침 (전사) — 공격력 5% 증가",
    specIds: [71, 72, 73], // 전사 전체
    spellId: 6673,
  },
  blessingOfTheBronze: {
    category: "공대버프",
    icon: "ability_evoker_blessingofthebronze",
    label: "청동용군단의 축복 (기원사) — 주요 이동기 재사용 15% 감소",
    specIds: [1467, 1468, 1473], // 기원사 전체
    spellId: 364342,
  },
  chaosBrand: {
    category: "공대버프",
    icon: "ability_demonhunter_empowerwards",
    label: "혼돈의 낙인 (악마사냥꾼) — 마법 피해 3% 증가",
    specIds: [577, 581], // 악마사냥꾼 전체
    spellId: 255260,
  },
  concentrationAura: {
    category: "공대버프",
    icon: "spell_holy_mindsooth",
    label: "집중의 오라 (팔라딘) — 침묵·방해 효과 30% 단축",
    specIds: [65, 66, 70], // 팔라딘 전체
    spellId: 317920,
  },
  devoutionAura: {
    category: "공대버프",
    icon: "spell_holy_devotionaura",
    label: "헌신의 오라 (팔라딘) — 받는 피해 3% 감소",
    specIds: [65, 66, 70], // 팔라딘 전체
    spellId: 465,
  },
  ebonMight: {
    category: "공대버프",
    icon: "ability_evoker_ebonmight",
    label: "칠흑의 힘 (증폭술사) — 주변 4명 능력치·피해량 증폭",
    specIds: [1473], // 증폭술사 전용
    spellId: 395152,
  },
  huntersMark: {
    category: "공대버프",
    icon: "ability_hunter_markedfordeath",
    label: "사냥꾼의 징표 (사냥꾼) — 대상 받는 피해 3% 증가",
    specIds: [253, 254, 255], // 사냥꾼 전체
    spellId: 257284,
  },
  markOfTheWild: {
    category: "공대버프",
    icon: "spell_nature_regeneration",
    label: "야생의 징표 (드루이드) — 다용성 3% 증가",
    specIds: [102, 103, 104, 105], // 드루이드 전체
    spellId: 1126,
  },
  mysticTouch: {
    category: "공대버프",
    icon: "ability_monk_sparring",
    label: "신비한 손길 (수도사) — 물리 피해 5% 증가",
    specIds: [268, 269, 270], // 수도사 전체
    spellId: 8647,
  },
  powerWordFortitude: {
    category: "공대버프",
    icon: "spell_holy_wordfortitude",
    label: "신의 권능: 인내 (사제) — 체력 5% 증가",
    specIds: [256, 257, 258], // 사제 전체
    spellId: 21562,
  },
  skyfury: {
    category: "공대버프",
    icon: "achievement_raidprimalist_windelemental",
    label: "하늘의 격노 (주술사) — 특기 2% + 자동공격 연타",
    specIds: [262, 263, 264], // 주술사 전체
    spellId: 462854,
  },

  // ─── 외생기 ───────────────────────────────────────────────────────────
  blessingOfSacrifice: {
    category: "외생기",
    icon: "spell_holy_sealofsacrifice",
    label: "희생의 축복 (팔라딘) — 대상 피해 30% 흡수",
    specIds: [65, 66, 70], // 팔라딘 전체
    spellId: 6940,
  },
  guardianSpirit: {
    category: "외생기",
    icon: "spell_holy_guardianspirit",
    label: "수호 영혼 (신성 사제) — 피해 감소 + 치사 시 소생",
    specIds: [257], // 신성 사제
    spellId: 47788,
  },
  innervate: {
    category: "외생기",
    icon: "spell_nature_lightning",
    label: "정신 자극 (드루이드) — 힐러 마나 풀 회복",
    specIds: [102, 103, 104, 105], // 드루이드 전체
    spellId: 29166,
  },
  ironBark: {
    category: "외생기",
    icon: "spell_druid_ironbark",
    label: "무쇠껍질 (드루이드) — 대상 피해 20% 감소",
    specIds: [102, 103, 104, 105], // 드루이드 전체
    spellId: 102342,
  },
  lifeCocoon: {
    category: "외생기",
    icon: "ability_monk_chicocoon",
    label: "기의 고치 (안개술사) — 흡수 보호막 + 주기 힐",
    specIds: [270], // 안개술사
    spellId: 116849,
  },
  painSuppression: {
    category: "외생기",
    icon: "spell_holy_painsupression",
    label: "고통 억제 (수양 사제) — 대상 피해 40% 감소",
    specIds: [256], // 수양 사제
    spellId: 33206,
  },
  powerInfusion: {
    category: "외생기",
    icon: "spell_holy_powerinfusion",
    label: "마력 주입 (사제) — 대상 하스트 25% 증가",
    specIds: [256, 257, 258], // 사제 전체
    spellId: 10060,
  },

  // ─── 공대 쿨기 ────────────────────────────────────────────────────────
  antiMagicZone: {
    category: "공대쿨기",
    icon: "spell_deathknight_antimagiczone",
    label: "대마법 지대 (죽음의 기사) — 마법 피해 20% 감소",
    specIds: [250, 251, 252], // 죽음의 기사 전체
    spellId: 51052,
  },
  auraMastery: {
    category: "공대쿨기",
    icon: "spell_holy_auramastery",
    label: "오라 숙련 (신기 팔라딘) — 헌신의 오라 2배 + 마법 피해 감소",
    specIds: [65], // 신기 팔라딘
    spellId: 31821,
  },
  darkness: {
    category: "공대쿨기",
    icon: "ability_demonhunter_darkness",
    label: "어둠 (악마사냥꾼) — 구역 내 피해 20% 감소 (확률)",
    specIds: [577, 581], // 악마사냥꾼 전체
    spellId: 196718,
  },
  powerWordBarrier: {
    category: "공대쿨기",
    icon: "spell_holy_powerwordbarrier",
    label: "신의 권능: 방벽 (수양 사제) — 구역 내 피해 25% 감소",
    specIds: [256], // 수양 사제
    spellId: 62618,
  },
  rallying: {
    category: "공대쿨기",
    icon: "ability_warrior_rallyingcry",
    label: "재집결의 함성 (전사) — 공격대 체력 15% 증가",
    specIds: [71, 72, 73], // 전사 전체
    spellId: 97462,
  },

  // ─── 유틸 ─────────────────────────────────────────────────────────────
  demonicGateway: {
    category: "유틸",
    icon: "spell_warlock_demonicportal_green",
    label: "악마의 관문 (흑마법사) — 공대 이동 포탈 설치",
    specIds: [265, 266, 267], // 흑마법사 전체
    spellId: 111771,
  },
  healthstone: {
    category: "유틸",
    icon: "warlock_-healthstone",
    label: "생명석 (흑마법사) — 체력 25% 즉시 회복 아이템 지급",
    specIds: [265, 266, 267], // 흑마법사 전체
    spellId: 6262,
  },
  magePortal: {
    category: "유틸",
    icon: "spell_arcane_portalstormwind",
    label: "대규모 차원문 (법사) — 공대 전체 도시 이동",
    specIds: [62, 63, 64], // 법사 전체
    spellId: 10059,
  },
  shroudOfConcealment: {
    category: "유틸",
    icon: "ability_rogue_shroudofconcealment",
    label: "은폐의 장막 (도적) — 공대 15초 그룹 은신",
    specIds: [259, 260, 261], // 도적 전체
    spellId: 114018,
  },
  soulstone: {
    category: "유틸",
    icon: "spell_shadow_soulgem",
    label: "영혼석 (흑마법사) — 사전 부활 1명 (전투 부활과 별개)",
    specIds: [265, 266, 267], // 흑마법사 전체
    spellId: 20707,
  },
  stampedingRoar: {
    category: "유틸",
    icon: "spell_druid_stampedingroar_cat",
    label: "쇄도의 포효 (드루이드) — 공격대 이동속도 60% 증가",
    specIds: [102, 103, 104, 105], // 드루이드 전체
    spellId: 106898,
  },
  windRush: {
    category: "유틸",
    icon: "ability_shaman_windwalktotem",
    label: "바람 질주 토템 (주술사) — 공격대 이동속도 60% 증가",
    specIds: [262, 263, 264], // 주술사 전체
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

// 개수를 표시하는 카테고리 (공대버프는 유무만 체크, 중복이 의미 없음)
export const COUNTABLE_CATEGORIES: BuffCategory[] = ["핵심", "외생기", "공대쿨기", "유틸"]

export const BUFF_CATEGORIES: BuffCategory[] = ["핵심", "공대버프", "외생기", "공대쿨기", "유틸"]

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
