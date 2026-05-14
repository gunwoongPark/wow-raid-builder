import { type RosterCharacter } from "./types"

/**
 * 스펠 아이콘 CDN URL 헬퍼
 * https://wow.zamimg.com/images/wow/icons/medium/{icon}.jpg
 */
export const wowheadIconUrl = (icon: string) =>
  `https://wow.zamimg.com/images/wow/icons/medium/${icon}.jpg`

export type BuffCategory =
  | "bloodlust"
  | "battleRez"
  | "synergy"
  | "externalCd"
  | "raidCd"
  | "utility"

export type BuffKey =
  // === Bloodlust ===
  | "heroism"
  // === Battle Resurrection ===
  | "battleRez"
  // === Synergy — raid-wide stat buffs ===
  | "arcaneIntellect"
  | "atrophicPoison"
  | "battleShout"
  | "blessingOfTheBronze"
  | "chaosBrand"
  | "concentrationAura"
  | "crusaderAura"
  | "devoutionAura"
  | "huntersMark"
  | "markOfTheWild"
  | "mysticTouch"
  | "powerWordFortitude"
  | "skyfury"
  // === External CD — personal defensive cooldowns ===
  | "blessingOfProtection"
  | "blessingOfSacrifice"
  | "guardianSpirit"
  | "innervate"
  | "ironBark"
  | "layOnHands"
  | "lifeCocoon"
  | "painSuppression"
  | "powerInfusion"
  // === Raid CD — group defensive cooldowns ===
  | "antiMagicZone"
  | "auraMastery"
  | "darkness"
  | "powerWordBarrier"
  | "rallying"
  | "revival"
  | "rewind"
  // === Utility ===
  | "abominationLimb"
  | "conjureRefreshment"
  | "curseOfTongues"
  | "deathGrip"
  | "demonicGateway"
  | "gorefiendGrasp"
  | "healthstone"
  | "leapOfFaith"
  | "magePortal"
  | "rescue"
  | "ritualOfSummoning"
  | "shroudOfConcealment"
  | "soulstone"
  | "stampedingRoar"
  | "tremorTotem"
  | "windRush"

interface BuffSource {
  category: BuffCategory
  icon: string
  spellId: number
  specIds: number[]
}

// ─── Spec ID → class/spec name (English — matches CLASS_COLORS keys) ──────────

const SPEC_INFO: Record<number, { className: string; specName: string }> = {
  // Mage
  62: { className: "Mage", specName: "Arcane" },
  63: { className: "Mage", specName: "Fire" },
  64: { className: "Mage", specName: "Frost" },
  // Paladin
  65: { className: "Paladin", specName: "Holy" },
  66: { className: "Paladin", specName: "Protection" },
  70: { className: "Paladin", specName: "Retribution" },
  // Warrior
  71: { className: "Warrior", specName: "Arms" },
  72: { className: "Warrior", specName: "Fury" },
  73: { className: "Warrior", specName: "Protection" },
  // Druid
  102: { className: "Druid", specName: "Balance" },
  103: { className: "Druid", specName: "Feral" },
  104: { className: "Druid", specName: "Guardian" },
  105: { className: "Druid", specName: "Restoration" },
  // Death Knight
  250: { className: "Death Knight", specName: "Blood" },
  251: { className: "Death Knight", specName: "Frost" },
  252: { className: "Death Knight", specName: "Unholy" },
  // Hunter
  253: { className: "Hunter", specName: "Beast Mastery" },
  254: { className: "Hunter", specName: "Marksmanship" },
  255: { className: "Hunter", specName: "Survival" },
  // Priest
  256: { className: "Priest", specName: "Discipline" },
  257: { className: "Priest", specName: "Holy" },
  258: { className: "Priest", specName: "Shadow" },
  // Rogue
  259: { className: "Rogue", specName: "Assassination" },
  260: { className: "Rogue", specName: "Outlaw" },
  261: { className: "Rogue", specName: "Subtlety" },
  // Shaman
  262: { className: "Shaman", specName: "Elemental" },
  263: { className: "Shaman", specName: "Enhancement" },
  264: { className: "Shaman", specName: "Restoration" },
  // Warlock
  265: { className: "Warlock", specName: "Affliction" },
  266: { className: "Warlock", specName: "Demonology" },
  267: { className: "Warlock", specName: "Destruction" },
  // Monk
  268: { className: "Monk", specName: "Brewmaster" },
  269: { className: "Monk", specName: "Windwalker" },
  270: { className: "Monk", specName: "Mistweaver" },
  // Demon Hunter
  577: { className: "Demon Hunter", specName: "Havoc" },
  581: { className: "Demon Hunter", specName: "Vengeance" },
  // Evoker
  1467: { className: "Evoker", specName: "Devastation" },
  1468: { className: "Evoker", specName: "Preservation" },
  1473: { className: "Evoker", specName: "Augmentation" },
}

/**
 * Reverse lookup: "ClassName:SpecName" → specId
 * Used to resolve specId from Raider.IO responses that only carry specName.
 */
const SPEC_ID_BY_CLASS_AND_NAME: Record<string, number> = Object.fromEntries(
  Object.entries(SPEC_INFO).map(([id, { className, specName }]) => [
    `${className}:${specName}`,
    Number(id),
  ])
)

/**
 * Returns the Blizzard spec ID for an English class + spec name combination.
 * Returns 0 if not found (unknown / new spec not yet in the table).
 */
export const getSpecIdByClassAndName = (className: string, specName: string): number =>
  SPEC_ID_BY_CLASS_AND_NAME[`${className}:${specName}`] ?? 0

/**
 * Returns the English class and spec names for a given spec ID.
 * Use this to normalize Blizzard API responses (which may return localized names)
 * into language-neutral English identifiers stored in RosterCharacter.
 * Falls back to the provided raw strings if the specId is unknown.
 */
export const getEnglishClassAndSpec = (
  specId: number,
  fallbackClassName: string,
  fallbackSpecName: string
): { className: string; specName: string } => {
  const info = SPEC_INFO[specId]
  return info ?? { className: fallbackClassName, specName: fallbackSpecName }
}

// Class → all spec IDs (English class name keys)
const CLASS_ALL_SPEC_IDS: Record<string, number[]> = {
  "Death Knight": [250, 251, 252],
  "Demon Hunter": [577, 581],
  Druid: [102, 103, 104, 105],
  Evoker: [1467, 1468, 1473],
  Hunter: [253, 254, 255],
  Mage: [62, 63, 64],
  Monk: [268, 269, 270],
  Paladin: [65, 66, 70],
  Priest: [256, 257, 258],
  Rogue: [259, 260, 261],
  Shaman: [262, 263, 264],
  Warlock: [265, 266, 267],
  Warrior: [71, 72, 73],
}

export interface CandidateProvider {
  /** English class name — used for color lookup via CLASS_COLORS */
  className: string
  /** English spec name, null when all specs of the class provide this buff */
  specName: string | null
}

/**
 * Normalizes a name with spaces to a camelCase-ish key without separators.
 * e.g. "Death Knight" → "DeathKnight", "Beast Mastery" → "BeastMastery"
 */
export const normalizeName = (name: string): string =>
  name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")

/**
 * Returns the translation key used in the candidateProvider namespace.
 * e.g. className="Death Knight", specName="Blood" → "DeathKnight_Blood"
 *      className="Mage", specName=null → "Mage"
 */
export const candidateProviderKey = (provider: CandidateProvider): string => {
  const classKey = normalizeName(provider.className)
  if (!provider.specName) return classKey
  return `${classKey}_${normalizeName(provider.specName)}`
}

/**
 * Groups specIds by class, returns CandidateProvider list.
 * - All class specs covered → { className, specName: null }
 * - Partial coverage → one entry per spec
 */
const getBuffCandidateProviders = (specIds: number[]): CandidateProvider[] => {
  const byClass: Record<string, number[]> = {}

  for (const specId of specIds) {
    const info = SPEC_INFO[specId]
    if (!info) continue
    const existing = byClass[info.className]
    if (existing) {
      existing.push(specId)
    } else {
      byClass[info.className] = [specId]
    }
  }

  return Object.entries(byClass).flatMap(([className, classSpecIds]): CandidateProvider[] => {
    const allSpecIds = CLASS_ALL_SPEC_IDS[className] ?? []
    if (allSpecIds.every((id) => classSpecIds.includes(id))) {
      return [{ className, specName: null }]
    }
    return classSpecIds.map((id) => ({
      className,
      specName: SPEC_INFO[id]?.specName ?? null,
    }))
  })
}

const BUFF_SOURCES: Record<BuffKey, BuffSource> = {
  // ─── Bloodlust ────────────────────────────────────────────────────────────
  heroism: {
    category: "bloodlust",
    icon: "ability_shaman_heroism",
    specIds: [
      262,
      263,
      264, // Shaman — Bloodlust / Heroism
      62,
      63,
      64, // Mage — Time Warp
      1467,
      1468,
      1473, // Evoker — Fury of the Aspects
      253, // Beast Mastery Hunter — Primal Rage (exotic pet required)
    ],
    spellId: 32182,
  },

  // ─── Battle Resurrection ──────────────────────────────────────────────────
  battleRez: {
    category: "battleRez",
    icon: "spell_nature_reincarnation",
    specIds: [
      102,
      103,
      104,
      105, // Druid — Rebirth
      250,
      251,
      252, // Death Knight — Raise Ally
      65,
      66,
      70, // Paladin — Redemption
      268,
      269,
      270, // Monk — Soothing Mist (Reawaken)
      1467,
      1468,
      1473, // Evoker — Reawaken
      265,
      266,
      267, // Warlock — Soulstone
    ],
    spellId: 20484,
  },

  // ─── Synergy — enemy debuffs ──────────────────────────────────────────────
  atrophicPoison: {
    category: "synergy",
    icon: "ability_rogue_nervesofsteel",
    specIds: [259, 260, 261],
    spellId: 381637,
  },
  chaosBrand: {
    category: "synergy",
    icon: "ability_demonhunter_empowerwards",
    specIds: [577, 581],
    spellId: 255260,
  },
  huntersMark: {
    category: "synergy",
    icon: "ability_hunter_markedfordeath",
    specIds: [253, 254, 255],
    spellId: 257284,
  },
  mysticTouch: {
    category: "synergy",
    icon: "ability_monk_sparring",
    specIds: [268, 269, 270],
    spellId: 8647,
  },

  // ─── Synergy — ally stat buffs ────────────────────────────────────────────
  arcaneIntellect: {
    category: "synergy",
    icon: "spell_holy_magicalsentry",
    specIds: [62, 63, 64],
    spellId: 1459,
  },
  battleShout: {
    category: "synergy",
    icon: "ability_warrior_battleshout",
    specIds: [71, 72, 73],
    spellId: 6673,
  },
  blessingOfTheBronze: {
    category: "synergy",
    icon: "ability_evoker_blessingofthebronze",
    specIds: [1467, 1468, 1473],
    spellId: 364342,
  },
  markOfTheWild: {
    category: "synergy",
    icon: "spell_nature_regeneration",
    specIds: [102, 103, 104, 105],
    spellId: 1126,
  },
  powerWordFortitude: {
    category: "synergy",
    icon: "spell_holy_wordfortitude",
    specIds: [256, 257, 258],
    spellId: 21562,
  },
  skyfury: {
    category: "synergy",
    icon: "achievement_raidprimalist_windelemental",
    specIds: [262, 263, 264],
    spellId: 462854,
  },

  // ─── Synergy — auras ──────────────────────────────────────────────────────
  concentrationAura: {
    category: "synergy",
    icon: "spell_holy_mindsooth",
    specIds: [65, 66, 70],
    spellId: 317920,
  },
  crusaderAura: {
    category: "synergy",
    icon: "spell_holy_crusaderaura",
    specIds: [65, 66, 70],
    spellId: 32223,
  },
  devoutionAura: {
    category: "synergy",
    icon: "spell_holy_devotionaura",
    specIds: [65, 66, 70],
    spellId: 465,
  },

  // ─── External CD — damage reduction / immunity ────────────────────────────
  blessingOfProtection: {
    category: "externalCd",
    icon: "spell_holy_sealofprotection",
    specIds: [65, 66, 70],
    spellId: 41450,
  },
  ironBark: {
    category: "externalCd",
    icon: "spell_druid_ironbark",
    specIds: [102, 103, 104, 105],
    spellId: 102342,
  },
  lifeCocoon: {
    category: "externalCd",
    icon: "ability_monk_chicocoon",
    specIds: [270],
    spellId: 116849,
  },
  painSuppression: {
    category: "externalCd",
    icon: "spell_holy_painsupression",
    specIds: [256],
    spellId: 33206,
  },

  // ─── External CD — emergency healing / survival ───────────────────────────
  blessingOfSacrifice: {
    category: "externalCd",
    icon: "spell_holy_sealofsacrifice",
    specIds: [65, 66, 70],
    spellId: 6940,
  },
  guardianSpirit: {
    category: "externalCd",
    icon: "spell_holy_guardianspirit",
    specIds: [257],
    spellId: 47788,
  },
  layOnHands: {
    category: "externalCd",
    icon: "spell_holy_layonhands",
    specIds: [65, 66, 70],
    spellId: 633,
  },

  // ─── External CD — mana / haste boost ────────────────────────────────────
  innervate: {
    category: "externalCd",
    icon: "spell_nature_lightning",
    specIds: [102, 103, 104, 105],
    spellId: 29166,
  },
  powerInfusion: {
    category: "externalCd",
    icon: "spell_holy_powerinfusion",
    specIds: [256, 257, 258],
    spellId: 10060,
  },

  // ─── Raid CD — magic damage reduction ────────────────────────────────────
  antiMagicZone: {
    category: "raidCd",
    icon: "spell_deathknight_antimagiczone",
    specIds: [250, 251, 252],
    spellId: 51052,
  },
  auraMastery: {
    category: "raidCd",
    icon: "spell_holy_auramastery",
    specIds: [65],
    spellId: 31821,
  },
  powerWordBarrier: {
    category: "raidCd",
    icon: "spell_holy_powerwordbarrier",
    specIds: [256],
    spellId: 62618,
  },

  // ─── Raid CD — HP / survival boost ───────────────────────────────────────
  darkness: {
    category: "raidCd",
    icon: "ability_demonhunter_darkness",
    specIds: [577, 581],
    spellId: 196718,
  },
  rallying: {
    category: "raidCd",
    icon: "ability_warrior_rallyingcry",
    specIds: [71, 72, 73],
    spellId: 97462,
  },
  revival: {
    category: "raidCd",
    icon: "spell_monk_revival",
    specIds: [270],
    spellId: 115310,
  },
  rewind: {
    category: "raidCd",
    icon: "ability_evoker_rewind",
    specIds: [1468],
    spellId: 363534,
  },

  // ─── Utility — crowd control / pulls ─────────────────────────────────────
  abominationLimb: {
    category: "utility",
    icon: "ability_maldraxxus_deathknight",
    specIds: [250],
    spellId: 383269,
  },
  deathGrip: {
    category: "utility",
    icon: "spell_deathknight_strangulate",
    specIds: [250, 251, 252],
    spellId: 49576,
  },
  gorefiendGrasp: {
    category: "utility",
    icon: "ability_deathknight_aoedeathgrip",
    specIds: [250],
    spellId: 108199,
  },

  // ─── Utility — movement ──────────────────────────────────────────────────
  demonicGateway: {
    category: "utility",
    icon: "spell_warlock_demonicportal_green",
    specIds: [265, 266, 267],
    spellId: 111771,
  },
  leapOfFaith: {
    category: "utility",
    icon: "priest_spell_leapoffaith_a",
    specIds: [256, 257, 258],
    spellId: 73325,
  },
  magePortal: {
    category: "utility",
    icon: "spell_arcane_portalstormwind",
    specIds: [62, 63, 64],
    spellId: 10059,
  },
  rescue: {
    category: "utility",
    icon: "ability_evoker_flywithme",
    specIds: [1467, 1468, 1473],
    spellId: 370665,
  },
  shroudOfConcealment: {
    category: "utility",
    icon: "ability_rogue_shroudofconcealment",
    specIds: [259, 260, 261],
    spellId: 114018,
  },
  stampedingRoar: {
    category: "utility",
    icon: "spell_druid_stampedingroar_cat",
    specIds: [102, 103, 104, 105],
    spellId: 106898,
  },
  windRush: {
    category: "utility",
    icon: "ability_shaman_windwalktotem",
    specIds: [262, 263, 264],
    spellId: 192077,
  },

  // ─── Utility — items / summons / debuffs ──────────────────────────────────
  conjureRefreshment: {
    category: "utility",
    icon: "inv_misc_food_15",
    specIds: [62, 63, 64],
    spellId: 43987,
  },
  curseOfTongues: {
    category: "utility",
    icon: "spell_shadow_curseoftounges",
    specIds: [265, 266, 267],
    spellId: 1714,
  },
  healthstone: {
    category: "utility",
    icon: "warlock_-healthstone",
    specIds: [265, 266, 267],
    spellId: 6262,
  },
  ritualOfSummoning: {
    category: "utility",
    icon: "spell_shadow_twilight",
    specIds: [265, 266, 267],
    spellId: 698,
  },
  soulstone: {
    category: "utility",
    icon: "spell_shadow_soulgem",
    specIds: [265, 266, 267],
    spellId: 20707,
  },
  tremorTotem: {
    category: "utility",
    icon: "spell_nature_tremortotem",
    specIds: [262, 263, 264],
    spellId: 8143,
  },
} satisfies Record<BuffKey, BuffSource>

export interface BuffProvider {
  name: string
  specId: number
}

export interface BuffCoverage {
  /** Providers who can supply this buff (class/spec info, locale-independent) */
  candidateProviders: CandidateProvider[]
  category: BuffCategory
  count: number
  covered: boolean
  icon: string
  key: BuffKey
  providers: BuffProvider[]
  spellId: number
}

export const COUNTABLE_CATEGORIES: BuffCategory[] = [
  "bloodlust",
  "battleRez",
  "synergy",
  "externalCd",
  "raidCd",
  "utility",
]

export const BUFF_CATEGORIES: BuffCategory[] = [
  "bloodlust",
  "battleRez",
  "synergy",
  "externalCd",
  "raidCd",
  "utility",
]

export const analyzeBuffCoverage = (characters: RosterCharacter[]): BuffCoverage[] =>
  (Object.entries(BUFF_SOURCES) as Array<[BuffKey, BuffSource]>).map(([key, source]) => {
    const matchingCharacters = characters.filter((character) =>
      source.specIds.includes(character.specId)
    )
    const providers = matchingCharacters.map((character) => ({
      name: character.name,
      specId: character.specId,
    }))
    const isCountable = COUNTABLE_CATEGORIES.includes(source.category)

    return {
      candidateProviders: getBuffCandidateProviders(source.specIds),
      category: source.category,
      count: isCountable ? matchingCharacters.length : 0,
      covered: providers.length > 0,
      icon: source.icon,
      key,
      providers,
      spellId: source.spellId,
    }
  })
