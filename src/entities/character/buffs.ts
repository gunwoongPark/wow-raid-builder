import { type RosterCharacter } from "./types"

export type BuffKey =
  // === 공격대 핵심 버프 ===
  | "heroism" // 영웅심 / 시간왜곡 / 고대의 격노
  | "battleRez" // 전투 부활
  // === 공격대 시너지 (받는 피해 증가 / 강화) ===
  | "ebonMight" // 흑요석 힘 — 증폭술사 (Evoker Augmentation)
  | "markOfTheWild" // 자연의 표시 — 드루이드
  | "arcaneBrilliance" // 마법사 지능 버프 (Arcane Brilliance)
  | "mysticTouch" // 신비로운 손길 — 수도사 (받는 물리 피해 5% 증가)
  | "huntersVigil" // 추적자의 경계 (Hunter Mark, 받는 피해 5% 증가)
  // === 기사 오라 ===
  | "devoutionAura" // 헌신의 오라 — 신기 팔라딘 (마법 피해 감소)
  | "retributionAura" // 징벌의 오라 — 징벌 팔라딘
  | "crusaderAura" // 십자군 오라 — 보호 팔라딘
  // === 힐러 외생기 ===
  | "ancestralGuidance" // 정령 인도 — 복원 주술사
  | "powerInfusion" // 활력 주입 — 사제
  | "innervate" // 내면의 힘 — 드루이드
  | "blessingOfSacrifice" // 희생의 축복 — 팔라딘
  | "externals" // 개인 외생기 (신의 가호, 코코넛 등)
  // === 특수기 (공격대 쿨기) ===
  | "powerWordBarrier" // 권능의 방어막 — 수양 사제
  | "darkness" // 어둠 — 악마사냥꾼 (Darkness, 피해 감소)
  | "antiMagicZone" // 마법 차단 구역 — 죽음의 기사 (AMZ)
  | "rallying" // 집결의 함성 — 전사
  | "auramastery" // 오라 숙련 — 신기 팔라딘 (Aura Mastery)
  // === 유틸 ===
  | "stampedingRoar" // 우렁찬 포효 — 드루이드 이동속도
  | "windRush" // 질풍의 토템 — 주술사 이동속도
  | "doorOfShadows" // 그림자의 문 — 악마사냥꾼 순간이동
  | "gateOfShadows" // 집단 포탈 — 법사
  | "healthstone" // 영혼석 — 흑마법사
  | "soulstone" // 소울스톤 — 흑마법사 (사전 부활)
  | "symbiosisNote" // 공생 — 드루이드 (특정 스펙 특수 효과 부여);

interface BuffSource {
  label: string
  category: BuffCategory
  specIds: number[]
}

const BUFF_SOURCES: Record<BuffKey, BuffSource> = {
  // ─── 핵심 ───────────────────────────────────────────────────────────
  battleRez: {
    category: "핵심",
    label: "전투 부활",
    specIds: [
      102,
      103,
      104,
      105, // Druid
      250,
      251,
      252, // Death Knight
      65,
      66,
      70, // Paladin
      268,
      269,
      270, // Monk
      1467,
      1468,
      1473, // Evoker
    ],
  },
  heroism: {
    category: "핵심",
    label: "영웅심 / 시간왜곡 / 고대의 격노",
    specIds: [
      262,
      263,
      264, // Shaman (Enhancement, Elemental, Restoration)
      62,
      63,
      64, // Mage (Arcane, Fire, Frost)
      1467,
      1468,
      1473, // Evoker (Devastation, Preservation, Augmentation)
    ],
  },

  // ─── 시너지 ─────────────────────────────────────────────────────────
  arcaneBrilliance: {
    category: "시너지",
    label: "비전의 총명함 (법사) — 지능 5% 증가",
    specIds: [62, 63, 64], // Mage
  },
  ebonMight: {
    category: "시너지",
    label: "흑요석 힘 (증폭술사) — 공격대 능력치+피해 증폭",
    specIds: [1473], // Evoker Augmentation
  },
  huntersVigil: {
    category: "시너지",
    label: "사냥꾼의 표식 — 단일 대상 받는 피해 5% 증가",
    specIds: [253, 254, 255], // Hunter
  },
  markOfTheWild: {
    category: "시너지",
    label: "자연의 표시 (드루이드) — 능력치 5% 증가",
    specIds: [102, 103, 104, 105], // Druid all specs
  },
  mysticTouch: {
    category: "시너지",
    label: "신비로운 손길 (수도사) — 받는 물리 피해 5% 증가",
    specIds: [268, 269, 270], // Monk
  },

  // ─── 오라 ────────────────────────────────────────────────────────────
  crusaderAura: {
    category: "오라",
    label: "십자군 오라 (보호 팔라딘) — 이동 속도 20% 증가",
    specIds: [66], // Protection Paladin
  },
  devoutionAura: {
    category: "오라",
    label: "헌신의 오라 (신기 팔라딘) — 마법 피해 감소",
    specIds: [65], // Holy Paladin
  },
  retributionAura: {
    category: "오라",
    label: "징벌의 오라 (징벌 팔라딘) — 아군 사망 시 폭발 피해",
    specIds: [70], // Retribution Paladin
  },

  // ─── 힐러 외생기 ─────────────────────────────────────────────────────
  ancestralGuidance: {
    category: "힐러외생",
    label: "정령 인도 (복원 주술사) — 피해량 일부를 치유로 전환",
    specIds: [264], // Restoration Shaman
  },
  blessingOfSacrifice: {
    category: "힐러외생",
    label: "희생의 축복 (팔라딘) — 대상 피해 30% 감소",
    specIds: [65, 66, 70], // Paladin all specs
  },
  externals: {
    category: "힐러외생",
    label: "개인 외생기 (신의 가호, 코코넛, 파충류 변신 등)",
    specIds: [
      65,
      66,
      70, // Paladin (신의 가호)
      102,
      103,
      104,
      105, // Druid (나무껍질 망토 등)
      268,
      269,
      270, // Monk (코코넛)
    ],
  },
  innervate: {
    category: "힐러외생",
    label: "내면의 힘 (드루이드) — 힐러 마나 회복",
    specIds: [102, 103, 104, 105], // Druid
  },
  powerInfusion: {
    category: "힐러외생",
    label: "활력 주입 (사제) — 대상 하스트 25% 증가",
    specIds: [256, 257, 258], // Priest all specs
  },

  // ─── 특수기 ──────────────────────────────────────────────────────────
  antiMagicZone: {
    category: "특수기",
    label: "마법 차단 구역 (죽음의 기사) — 마법 피해 20% 감소",
    specIds: [250, 251, 252], // Death Knight all specs
  },
  auramastery: {
    category: "특수기",
    label: "오라 숙련 (신기 팔라딘) — 헌신의 오라 효과 2배 + 공격대 마법 피해 감소",
    specIds: [65], // Holy Paladin
  },
  darkness: {
    category: "특수기",
    label: "어둠 (악마사냥꾼) — 구역 내 피해 20% 감소 (확률)",
    specIds: [577, 581], // Demon Hunter
  },
  powerWordBarrier: {
    category: "특수기",
    label: "권능의 방어막 (수양 사제) — 구역 내 피해 25% 감소",
    specIds: [256], // Discipline Priest
  },
  rallying: {
    category: "특수기",
    label: "집결의 함성 (전사) — 공격대 체력 15% 증가",
    specIds: [71, 72, 73], // Warrior all specs
  },

  // ─── 유틸 ────────────────────────────────────────────────────────────
  doorOfShadows: {
    category: "유틸",
    label: "그림자의 문 (악마사냥꾼) — 순간이동 + 공격대 이동",
    specIds: [577, 581], // Demon Hunter
  },
  gateOfShadows: {
    category: "유틸",
    label: "집단 포탈 (법사) — 도시 순간이동",
    specIds: [62, 63, 64], // Mage
  },
  healthstone: {
    category: "유틸",
    label: "영혼석 (흑마법사) — 공격대원 체력 회복 아이템",
    specIds: [265, 266, 267], // Warlock
  },
  soulstone: {
    category: "유틸",
    label: "소울스톤 (흑마법사) — 사전 부활 (전투 부활과 별개)",
    specIds: [265, 266, 267], // Warlock
  },
  stampedingRoar: {
    category: "유틸",
    label: "우렁찬 포효 (드루이드) — 공격대 이동속도 60% 증가",
    specIds: [102, 103, 104, 105], // Druid all specs
  },
  symbiosisNote: {
    category: "유틸",
    label: "공생 (드루이드) — 특정 직업에 드루이드 스킬 부여",
    specIds: [102, 103, 104, 105], // Druid
  },
  windRush: {
    category: "유틸",
    label: "질풍의 토템 (주술사) — 공격대 이동속도 60% 증가",
    specIds: [262, 263, 264], // Shaman all specs
  },
} satisfies Record<BuffKey, BuffSource>

export type BuffCategory = "핵심" | "시너지" | "오라" | "힐러외생" | "특수기" | "유틸"

export interface BuffCoverage {
  key: BuffKey
  label: string
  category: BuffCategory
  covered: boolean
  providers: string[]
}

export const analyzeBuffCoverage = (characters: RosterCharacter[]): BuffCoverage[] =>
  (Object.entries(BUFF_SOURCES) as Array<[BuffKey, BuffSource]>).map(([key, source]) => {
    const providers = characters
      .filter((c) => source.specIds.includes(c.specId))
      .map((c) => `${c.name} (${c.specName})`)

    return {
      category: source.category,
      covered: providers.length > 0,
      key,
      label: source.label,
      providers,
    }
  })

export const BUFF_CATEGORIES: BuffCategory[] = [
  "핵심",
  "시너지",
  "오라",
  "힐러외생",
  "특수기",
  "유틸",
]
