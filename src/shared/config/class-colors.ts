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
// oklch 기반으로 원본 블리자드 색상의 hue를 최대한 유지하면서
// 흰 배경 대비 WCAG AA(4.5:1) 이상을 보장하는 값으로 조정
const CLASS_COLORS_LIGHT: Record<string, string> = {
  "Death Knight": "#a01830", // 7.87:1
  "Demon Hunter": "#7a1a99", // 8.62:1
  Druid: "#a34d00", // 5.80:1  (기존 #b05500 5.07→여유 확보)
  Evoker: "#1a6d5c", // 6.20:1
  Hunter: "#4a7a00", // 5.15:1
  Mage: "#0069a0", // 5.95:1  (기존 #0077aa 4.98→여유 확보)
  Monk: "#007040", // 6.19:1  (기존 #007a40 — jade 색감 복원)
  Paladin: "#b03070", // 6.00:1  (기존 #c04080 4.90→여유 확보)
  Priest: "#666666", // 5.74:1  (흰 직업색 특성상 회색 불가피)
  Rogue: "#736000", // 6.17:1  (기존 #9a7800 4.15:1 ❌ → 수정)
  Shaman: "#005599", // 7.61:1
  Warlock: "#4040bb", // 7.87:1
  Warrior: "#8a6010", // 5.58:1
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
