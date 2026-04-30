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
  | "arcaneIntellect" // 신비한 지능 — 마법사
  | "atrophicPoison" // 위축의 독 — 도적
  | "battleShout" // 전투의 외침 — 전사
  | "blessingOfTheBronze" // 청동용군단의 축복 — 기원사
  | "chaosBrand" // 혼돈의 낙인 — 악마사냥꾼
  | "concentrationAura" // 집중의 오라 — 성기사
  | "crusaderAura" // 성전사의 오라 — 성기사 (탈것 이동속도)
  | "devoutionAura" // 헌신의 오라 — 성기사
  | "huntersMark" // 사냥꾼의 징표 — 사냥꾼
  | "markOfTheWild" // 야생의 징표 — 드루이드
  | "mysticTouch" // 신비한 손길 — 수도사
  | "powerWordFortitude" // 신의 권능: 인내 — 사제
  | "skyfury" // 하늘의 격노 — 주술사
  // === 외생기 (개인 방어 쿨기) ===
  | "blessingOfProtection" // 보호의 축복 — 성기사 (물리 면역)
  | "blessingOfSacrifice" // 희생의 축복 — 성기사
  | "guardianSpirit" // 수호 영혼 — 신성 사제
  | "innervate" // 정신 자극 — 드루이드 (힐러 마나)
  | "ironBark" // 무쇠껍질 — 드루이드
  | "layOnHands" // 신의 축복 — 성기사 (체력 100% 응급 치유)
  | "lifeCocoon" // 기의 고치 — 운무 수도사
  | "painSuppression" // 고통 억제 — 수양 사제
  | "powerInfusion" // 마력 주입 — 사제
  // === 공생기 (공격대 광역 방어 쿨기) ===
  | "antiMagicZone" // 대마법 지대 — 죽음의 기사
  | "auraMastery" // 오라 숙련 — 신성 성기사
  | "darkness" // 어둠 — 악마사냥꾼
  | "powerWordBarrier" // 신의 권능: 방벽 — 수양 사제
  | "rallying" // 재집결의 함성 — 전사
  | "revival" // 재활 — 운무 수도사
  | "rewind" // 되돌리기 — 보존 기원사
  // === 유틸 ===
  | "abominationLimb" // 흉물 사지 — 혈기 죽음의 기사 (주기 광역 끌어당기기)
  | "conjureRefreshment" // 원기 회복의 식탁 창조 — 마법사
  | "curseOfTongues" // 언어의 저주 — 흑마법사
  | "deathGrip" // 죽음의 손아귀 — 죽음의 기사
  | "demonicGateway" // 악마의 관문 — 흑마법사
  | "gorefiendGrasp" // 고어핀드의 손아귀 — 혈기 죽음의 기사 (광역 끌어당기기)
  | "healthstone" // 생명석 — 흑마법사
  | "leapOfFaith" // 도약 — 사제
  | "magePortal" // 포탈 창조 — 마법사
  | "rescue" // 구출 — 기원사
  | "ritualOfSummoning" // 소환의 문 — 흑마법사
  | "shroudOfConcealment" // 은폐의 장막 — 도적
  | "soulstone" // 영혼석 — 흑마법사
  | "stampedingRoar" // 쇄도의 포효 — 드루이드
  | "tremorTotem" // 정기의 토템 — 주술사
  | "windRush" // 바람 질주 토템 — 주술사

interface BuffSource {
  category: BuffCategory
  icon: string
  label: string
  spellId: number
  specIds: number[]
}

// ─── 스펙 ID → 직업/특성명 매핑 ─────────────────────────────────────────────

const SPEC_INFO: Record<number, { className: string; specName: string }> = {
  // 마법사
  62: { className: "마법사", specName: "비전" },
  63: { className: "마법사", specName: "화염" },
  64: { className: "마법사", specName: "냉기" },
  // 성기사
  65: { className: "성기사", specName: "신성" },
  66: { className: "성기사", specName: "보호" },
  70: { className: "성기사", specName: "징벌" },
  // 전사
  71: { className: "전사", specName: "무기" },
  72: { className: "전사", specName: "분노" },
  73: { className: "전사", specName: "방어" },
  // 드루이드
  102: { className: "드루이드", specName: "조화" },
  103: { className: "드루이드", specName: "야성" },
  104: { className: "드루이드", specName: "수호" },
  105: { className: "드루이드", specName: "회복" },
  // 죽음의 기사
  250: { className: "죽음의 기사", specName: "혈기" },
  251: { className: "죽음의 기사", specName: "냉기" },
  252: { className: "죽음의 기사", specName: "부정" },
  // 사냥꾼
  253: { className: "사냥꾼", specName: "야수" },
  254: { className: "사냥꾼", specName: "사격" },
  255: { className: "사냥꾼", specName: "생존" },
  // 사제
  256: { className: "사제", specName: "수양" },
  257: { className: "사제", specName: "신성" },
  258: { className: "사제", specName: "암흑" },
  // 도적
  259: { className: "도적", specName: "암살" },
  260: { className: "도적", specName: "무법" },
  261: { className: "도적", specName: "잠행" },
  // 주술사
  262: { className: "주술사", specName: "원소" },
  263: { className: "주술사", specName: "향상" },
  264: { className: "주술사", specName: "복원" },
  // 흑마법사
  265: { className: "흑마법사", specName: "고통" },
  266: { className: "흑마법사", specName: "악마소환사" },
  267: { className: "흑마법사", specName: "파괴" },
  // 수도사
  268: { className: "수도사", specName: "양조" },
  269: { className: "수도사", specName: "풍운" },
  270: { className: "수도사", specName: "운무" },
  // 악마사냥꾼
  577: { className: "악마사냥꾼", specName: "파멸" },
  581: { className: "악마사냥꾼", specName: "복수" },
  // 기원사
  1467: { className: "기원사", specName: "황폐" },
  1468: { className: "기원사", specName: "보존" },
  1473: { className: "기원사", specName: "증강" },
}

// 직업 → 해당 직업의 전체 스펙 ID 목록
const CLASS_ALL_SPEC_IDS: Record<string, number[]> = {
  기원사: [1467, 1468, 1473],
  도적: [259, 260, 261],
  드루이드: [102, 103, 104, 105],
  마법사: [62, 63, 64],
  사냥꾼: [253, 254, 255],
  사제: [256, 257, 258],
  성기사: [65, 66, 70],
  수도사: [268, 269, 270],
  악마사냥꾼: [577, 581],
  전사: [71, 72, 73],
  주술사: [262, 263, 264],
  죽음의기사: [250, 251, 252],
  흑마법사: [265, 266, 267],
}

export interface CandidateProvider {
  /** 직업 색상 조회 및 key로 사용되는 기본 직업명 */
  className: string
  /** 표시용 레이블 (전 특성 제공 시 직업명만, 일부 특성만 시 "특성 직업명") */
  label: string
}

/**
 * specIds 배열을 직업 단위로 묶어, 표시용 CandidateProvider 목록을 반환한다.
 * - 직업의 모든 특성이 포함되면 직업명만 반환
 * - 일부 특성만 포함되면 "특성 직업명" 형태로 반환
 */
const getBuffCandidateProviders = (specIds: number[]): CandidateProvider[] => {
  const byClass: Record<string, number[]> = {}

  for (const specId of specIds) {
    const info = SPEC_INFO[specId]
    if (!info) continue
    const key = info.className.replaceAll(" ", "")
    if (!byClass[key]) byClass[key] = []
    byClass[key].push(specId)
  }

  return Object.entries(byClass).flatMap(([classKey, classSpecIds]) => {
    const className = SPEC_INFO[classSpecIds[0]]?.className ?? classKey
    const allSpecIds = CLASS_ALL_SPEC_IDS[classKey] ?? []
    if (allSpecIds.every((id) => classSpecIds.includes(id))) {
      return [{ className, label: className }]
    }
    return classSpecIds.map((id) => ({
      className,
      label: `${SPEC_INFO[id]?.specName} ${className}`,
    }))
  })
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
      264, // 주술사 전체 — 피의 욕망·영웅심
      62,
      63,
      64, // 마법사 전체 — 시간 왜곡
      1467,
      1468,
      1473, // 기원사 전체 — 용군단의 분노
      253, // 야수 사냥꾼 — 원초적 분노 (외래 야수 펫 필요)
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
      70, // 성기사 전체 (구제)
      268,
      269,
      270, // 수도사 전체 (소생의 차)
      1467,
      1468,
      1473, // 기원사 전체 (소생)
      265,
      266,
      267, // 흑마법사 전체 (영혼석)
    ],
    spellId: 20484,
  },

  // ─── 시너지 — 적에게 적용되는 디버프 ────────────────────────────────────
  atrophicPoison: {
    category: "시너지",
    icon: "ability_rogue_nervesofsteel",
    label: "위축의 독 — 적 공격력 3% 감소",
    specIds: [259, 260, 261],
    spellId: 381637,
  },
  chaosBrand: {
    category: "시너지",
    icon: "ability_demonhunter_empowerwards",
    label: "혼돈의 낙인 — 마법 피해 3% 증가",
    specIds: [577, 581],
    spellId: 255260,
  },
  huntersMark: {
    category: "시너지",
    icon: "ability_hunter_markedfordeath",
    label: "사냥꾼의 징표 — 대상 받는 피해 3% 증가",
    specIds: [253, 254, 255],
    spellId: 257284,
  },
  mysticTouch: {
    category: "시너지",
    icon: "ability_monk_sparring",
    label: "신비한 손길 — 물리 피해 5% 증가",
    specIds: [268, 269, 270],
    spellId: 8647,
  },

  // ─── 시너지 — 아군 스탯 버프 ───────────────────────────────────────────
  arcaneIntellect: {
    category: "시너지",
    icon: "spell_holy_magicalsentry",
    label: "신비한 지능 — 지능 3% 증가",
    specIds: [62, 63, 64],
    spellId: 1459,
  },
  battleShout: {
    category: "시너지",
    icon: "ability_warrior_battleshout",
    label: "전투의 외침 — 공격력 5% 증가",
    specIds: [71, 72, 73],
    spellId: 6673,
  },
  blessingOfTheBronze: {
    category: "시너지",
    icon: "ability_evoker_blessingofthebronze",
    label: "청동용군단의 축복 — 주요 이동기 재사용 15% 감소",
    specIds: [1467, 1468, 1473],
    spellId: 364342,
  },
  markOfTheWild: {
    category: "시너지",
    icon: "spell_nature_regeneration",
    label: "야생의 징표 — 유연성 3% 증가",
    specIds: [102, 103, 104, 105],
    spellId: 1126,
  },
  powerWordFortitude: {
    category: "시너지",
    icon: "spell_holy_wordfortitude",
    label: "신의 권능: 인내 — 체력 5% 증가",
    specIds: [256, 257, 258],
    spellId: 21562,
  },
  skyfury: {
    category: "시너지",
    icon: "achievement_raidprimalist_windelemental",
    label: "하늘의 격노 — 특화 2% 증가, 자동 공격 시 20% 확률로 즉시 추가 공격",
    specIds: [262, 263, 264],
    spellId: 462854,
  },

  // ─── 시너지 — 오라 ────────────────────────────────────────────────────
  concentrationAura: {
    category: "시너지",
    icon: "spell_holy_mindsooth",
    label: "집중의 오라 — 침묵·방해 효과 30% 단축",
    specIds: [65, 66, 70],
    spellId: 317920,
  },
  crusaderAura: {
    category: "시너지",
    icon: "spell_holy_crusaderaura",
    label: "성전사의 오라 — 탈것 이동속도 20% 증가",
    specIds: [65, 66, 70],
    spellId: 32223,
  },
  devoutionAura: {
    category: "시너지",
    icon: "spell_holy_devotionaura",
    label: "헌신의 오라 — 받는 피해 3% 감소",
    specIds: [65, 66, 70],
    spellId: 465,
  },

  // ─── 외생기 — 피해 감소·면역 ────────────────────────────────────────
  blessingOfProtection: {
    category: "외생기",
    icon: "spell_holy_sealofprotection",
    label: "보호의 축복 — 대상 파티원 물리 공격 면역 (10초)",
    specIds: [65, 66, 70],
    spellId: 41450,
  },
  ironBark: {
    category: "외생기",
    icon: "spell_druid_ironbark",
    label: "무쇠껍질 — 대상 피해 20% 감소 (12초)",
    specIds: [102, 103, 104, 105],
    spellId: 102342,
  },
  lifeCocoon: {
    category: "외생기",
    icon: "ability_monk_chicocoon",
    label: "기의 고치 — 대형 흡수 보호막 + 주기 치유 50%↑ (12초)",
    specIds: [270],
    spellId: 116849,
  },
  painSuppression: {
    category: "외생기",
    icon: "spell_holy_painsupression",
    label: "고통 억제 — 대상 피해 40% 감소",
    specIds: [256],
    spellId: 33206,
  },

  // ─── 외생기 — 생존·응급 치유 ─────────────────────────────────────────
  blessingOfSacrifice: {
    category: "외생기",
    icon: "spell_holy_sealofsacrifice",
    label: "희생의 축복 — 대상 피해 30%를 시전자가 대신 받음 (12초)",
    specIds: [65, 66, 70],
    spellId: 6940,
  },
  guardianSpirit: {
    category: "외생기",
    icon: "spell_holy_guardianspirit",
    label: "수호 영혼 — 치유량 60%↑ + 치사 시 생명력 40% 소생 (10초)",
    specIds: [257],
    spellId: 47788,
  },
  layOnHands: {
    category: "외생기",
    icon: "spell_holy_layonhands",
    label: "신의 축복 — 아군 최대 생명력 100% 즉시 회복 (10분 재사용)",
    specIds: [65, 66, 70],
    spellId: 633,
  },

  // ─── 외생기 — 마나·가속 강화 ─────────────────────────────────────────
  innervate: {
    category: "외생기",
    icon: "spell_nature_lightning",
    label: "정신 자극 — 대상이 8초간 마나 소모 없이 주문 시전",
    specIds: [102, 103, 104, 105],
    spellId: 29166,
  },
  powerInfusion: {
    category: "외생기",
    icon: "spell_holy_powerinfusion",
    label: "마력 주입 — 대상 가속 20% 증가 (15초)",
    specIds: [256, 257, 258],
    spellId: 10060,
  },

  // ─── 공생기 — 마법 피해 방어 ─────────────────────────────────────────
  antiMagicZone: {
    category: "공생기",
    icon: "spell_deathknight_antimagiczone",
    label: "대마법 지대 — 마법 피해 15% 감소 (6초)",
    specIds: [250, 251, 252],
    spellId: 51052,
  },
  auraMastery: {
    category: "공생기",
    icon: "spell_holy_auramastery",
    label: "오라 숙련 — 헌신의 오라 12% / 집중의 오라 침묵 면역 (8초)",
    specIds: [65],
    spellId: 31821,
  },
  powerWordBarrier: {
    category: "공생기",
    icon: "spell_holy_powerwordbarrier",
    label: "신의 권능: 방벽 — 구역 내 피해 20% 감소 (10초)",
    specIds: [256],
    spellId: 62618,
  },

  // ─── 공생기 — 체력·생존 강화 ─────────────────────────────────────────
  darkness: {
    category: "공생기",
    icon: "ability_demonhunter_darkness",
    label: "어둠 — 구역 내 피해 회피 15% 확률 (8초)",
    specIds: [577, 581],
    spellId: 196718,
  },
  rallying: {
    category: "공생기",
    icon: "ability_warrior_rallyingcry",
    label: "재집결의 함성 — 공격대 최대 체력 10%↑ (10초)",
    specIds: [71, 72, 73],
    spellId: 97462,
  },
  revival: {
    category: "공생기",
    icon: "spell_monk_revival",
    label: "재활 — 반경 40m 공격대 전체 대량 치유 + 해로운 마법·독·질병 제거",
    specIds: [270],
    spellId: 115310,
  },
  rewind: {
    category: "공생기",
    icon: "ability_evoker_rewind",
    label: "되돌리기 — 40m 내 아군이 지난 5초간 받은 피해 30% 회복",
    specIds: [1468],
    spellId: 363534,
  },

  // ─── 유틸 — 적 컨트롤 (끌어당기기) ─────────────────────────────────
  abominationLimb: {
    category: "유틸",
    icon: "ability_maldraxxus_deathknight",
    label: "흉물 사지 — 주변 적을 12초간 주기적으로 끌어당기며 이동 속도 감소",
    specIds: [250],
    spellId: 383269,
  },
  deathGrip: {
    category: "유틸",
    icon: "spell_deathknight_strangulate",
    label: "죽음의 손아귀 — 적 단일 끌어당기기",
    specIds: [250, 251, 252],
    spellId: 49576,
  },
  gorefiendGrasp: {
    category: "유틸",
    icon: "ability_deathknight_aoedeathgrip",
    label: "고어핀드의 손아귀 — 주변 모든 적 광역 끌어당기기",
    specIds: [250],
    spellId: 108199,
  },

  // ─── 유틸 — 이동·위치 ───────────────────────────────────────────────
  demonicGateway: {
    category: "유틸",
    icon: "spell_warlock_demonicportal_green",
    label: "악마의 관문 — 공격대 이동 포탈 설치",
    specIds: [265, 266, 267],
    spellId: 111771,
  },
  leapOfFaith: {
    category: "유틸",
    icon: "priest_spell_leapoffaith_a",
    label: "신의의 도약 — 아군 1명을 자신에게 끌어당기기",
    specIds: [256, 257, 258],
    spellId: 73325,
  },
  magePortal: {
    category: "유틸",
    icon: "spell_arcane_portalstormwind",
    label: "차원의 문 — 주요 도시 포탈 생성으로 빠른 이동 지원",
    specIds: [62, 63, 64],
    spellId: 10059,
  },
  rescue: {
    category: "유틸",
    icon: "ability_evoker_flywithme",
    label: "구출 — 아군에게 강하하여 대상 위치까지 함께 비행, 이동 방해 효과 제거",
    specIds: [1467, 1468, 1473],
    spellId: 370665,
  },
  shroudOfConcealment: {
    category: "유틸",
    icon: "ability_rogue_shroudofconcealment",
    label: "은폐의 장막 — 공격대 15초 그룹 은신",
    specIds: [259, 260, 261],
    spellId: 114018,
  },
  stampedingRoar: {
    category: "유틸",
    icon: "spell_druid_stampedingroar_cat",
    label: "쇄도의 포효 — 공격대 이동속도 60% 증가 (8초)",
    specIds: [102, 103, 104, 105],
    spellId: 106898,
  },
  windRush: {
    category: "유틸",
    icon: "ability_shaman_windwalktotem",
    label: "바람 질주 토템 — 공격대 이동속도 40% 증가 (5초)",
    specIds: [262, 263, 264],
    spellId: 192077,
  },

  // ─── 유틸 — 아이템·소환·디버프 ──────────────────────────────────────
  conjureRefreshment: {
    category: "유틸",
    icon: "inv_misc_food_15",
    label: "원기 회복의 식탁 창조 — 공격대 음식 제공",
    specIds: [62, 63, 64],
    spellId: 43987,
  },
  curseOfTongues: {
    category: "유틸",
    icon: "spell_shadow_curseoftounges",
    label: "언어의 저주 — 적 주문 시전 시간 30% 증가",
    specIds: [265, 266, 267],
    spellId: 1714,
  },
  healthstone: {
    category: "유틸",
    icon: "warlock_-healthstone",
    label: "생명석 — 체력 25% 즉시 회복 아이템 지급",
    specIds: [265, 266, 267],
    spellId: 6262,
  },
  ritualOfSummoning: {
    category: "유틸",
    icon: "spell_shadow_twilight",
    label: "소환의 문 — 공격대원 원격 소환 (시전 2회 도움 필요)",
    specIds: [265, 266, 267],
    spellId: 698,
  },
  soulstone: {
    category: "유틸",
    icon: "spell_shadow_soulgem",
    label: "영혼석 — 전투 부활 겸용, 사전 배치 시 자동 소생",
    specIds: [265, 266, 267],
    spellId: 20707,
  },
  tremorTotem: {
    category: "유틸",
    icon: "spell_nature_tremortotem",
    label: "정기의 토템 — 주변 아군의 공포·매혹·수면 효과 제거",
    specIds: [262, 263, 264],
    spellId: 8143,
  },
} satisfies Record<BuffKey, BuffSource>

export interface BuffCoverage {
  /** 이 버프를 제공할 수 있는 직업/특성 목록 (로스터 여부 무관) */
  candidateProviders: CandidateProvider[]
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
      candidateProviders: getBuffCandidateProviders(source.specIds),
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
