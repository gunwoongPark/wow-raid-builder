// Blizzard 공식 WoW 직업 색상
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

export const getClassColor = (className: string): string => {
  const normalized = className.replace(/\s/g, "")
  const enName = KO_TO_EN[normalized] ?? className
  return CLASS_COLORS[enName] ?? CLASS_COLORS[className] ?? "#c5a84b"
}
