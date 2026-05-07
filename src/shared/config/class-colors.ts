// Blizzard 공식 WoW 직업 색상 (다크 모드 기준)
export const CLASS_COLORS: Record<string, string> = {
  "Death Knight": "#c41e3a",
  "Demon Hunter": "#a330c9",
  Druid: "#ff7c0a",
  Evoker: "#33937f",
  Hunter: "#aad372",
  Mage: "#3fc7eb",
  Monk: "#00ff98",
  Paladin: "#f48cba",
  Priest: "#f0ece0",
  Rogue: "#fff468",
  Shaman: "#0070dd",
  Warlock: "#8788ee",
  Warrior: "#c69b3a",
}

// 라이트 모드 배경에서 가독성 확보를 위한 어두운 버전
const CLASS_COLORS_LIGHT: Record<string, string> = {
  "Death Knight": "#a01830",
  "Demon Hunter": "#7a1a99",
  Druid: "#b05500",
  Evoker: "#1a6d5c",
  Hunter: "#4a7a00",
  Mage: "#0077aa",
  Monk: "#007a40",
  Paladin: "#c04080",
  Priest: "#666666",
  Rogue: "#9a7800",
  Shaman: "#005599",
  Warlock: "#4040bb",
  Warrior: "#8a6010",
}

// 한글 직업명 → 영문 매핑
const KO_TO_EN: Record<string, string> = {
  기원사: "Evoker",
  도적: "Rogue",
  드루이드: "Druid",
  마법사: "Mage",
  사냥꾼: "Hunter",
  사제: "Priest",
  성기사: "Paladin",
  수도사: "Monk",
  악마사냥꾼: "Demon Hunter",
  전사: "Warrior",
  주술사: "Shaman",
  죽음의기사: "Death Knight",
  흑마법사: "Warlock",
}

const resolveEnName = (className: string): string => {
  const normalized = className.replaceAll(" ", "")
  return KO_TO_EN[normalized] ?? className
}

export const getClassColor = (className: string): string => {
  const enName = resolveEnName(className)
  return CLASS_COLORS[enName] ?? CLASS_COLORS[className] ?? "#c5a84b"
}

export const getClassColorLight = (className: string): string => {
  const enName = resolveEnName(className)
  return CLASS_COLORS_LIGHT[enName] ?? CLASS_COLORS_LIGHT[className] ?? "#8a6a00"
}
