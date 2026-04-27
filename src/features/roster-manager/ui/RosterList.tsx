"use client"

import { type RosterCharacter } from "@/entities/character"
import { useRosterStore } from "@/shared/model/roster-store"

const ROLE_LABEL: Record<string, string> = {
  HEALER: "힐러",
  MELEE: "근딜",
  RANGED: "원딜",
  TANK: "탱커",
}

const CharacterRow = ({ character }: { character: RosterCharacter }) => {
  const removeCharacter = useRosterStore((s) => s.removeCharacter)
  const score = character.raiderIO?.score ?? 0
  const currentRaid = character.raiderIO?.raidProgression
    ? Object.values(character.raiderIO.raidProgression)[0]
    : null

  return (
    <tr className="border-b text-sm">
      <td className="px-3 py-2 font-medium">{character.name}</td>
      <td className="px-3 py-2 text-gray-500">{character.realm}</td>
      <td className="px-3 py-2">{character.specName}</td>
      <td className="px-3 py-2">{character.className}</td>
      <td className="px-3 py-2">{ROLE_LABEL[character.role] ?? character.role}</td>
      <td className="px-3 py-2">{character.itemLevel}</td>
      <td className="px-3 py-2 font-mono">
        {score > 0 ? (
          <span
            className={
              score >= 3000
                ? "font-bold text-orange-500"
                : score >= 2000
                  ? "text-purple-500"
                  : "text-gray-700"
            }
          >
            {score.toLocaleString()}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td className="px-3 py-2 text-xs text-gray-500">{currentRaid?.summary ?? "-"}</td>
      <td className="px-3 py-2">
        <button
          className="text-xs text-red-400 hover:text-red-600"
          onClick={() => removeCharacter(character.id)}
        >
          제거
        </button>
      </td>
    </tr>
  )
}

export const RosterList = () => {
  const characters = useRosterStore((s) => s.characters)
  const clearRoster = useRosterStore((s) => s.clearRoster)

  if (characters.length === 0) {
    return <p className="py-4 text-sm text-gray-400">아직 추가된 캐릭터가 없습니다.</p>
  }

  const roleOrder = ["TANK", "HEALER", "MELEE", "RANGED"]
  const sorted = [...characters].sort(
    (a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">로스터 ({characters.length}명)</span>
        <button className="text-xs text-gray-400 hover:text-red-500" onClick={clearRoster}>
          전체 초기화
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-xs text-gray-500 uppercase">
              <th className="px-3 py-2">이름</th>
              <th className="px-3 py-2">서버</th>
              <th className="px-3 py-2">특성</th>
              <th className="px-3 py-2">직업</th>
              <th className="px-3 py-2">역할</th>
              <th className="px-3 py-2">아이템레벨</th>
              <th className="px-3 py-2">M+ 점수</th>
              <th className="px-3 py-2">레이드 진행</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => (
              <CharacterRow character={c} key={c.id} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
