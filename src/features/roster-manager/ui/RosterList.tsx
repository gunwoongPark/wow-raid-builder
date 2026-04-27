"use client"

import Image from "next/image"

import { type RosterCharacter } from "@/entities/character"
import { getClassColor } from "@/shared/config/class-colors"
import { useRosterStore } from "@/shared/model/roster-store"

const ROLE_LABEL: Record<string, string> = {
  HEALER: "힐러",
  MELEE: "근딜",
  RANGED: "원딜",
  TANK: "탱커",
}

const ROLE_COLOR: Record<string, string> = {
  HEALER: "text-emerald-400",
  MELEE: "text-red-400",
  RANGED: "text-sky-400",
  TANK: "text-blue-400",
}

const ScoreColor = ({ score }: { score: number }) => {
  const color =
    score >= 3000
      ? "text-orange-400 font-bold"
      : score >= 2000
        ? "text-purple-400"
        : score >= 1000
          ? "text-blue-400"
          : "text-muted-foreground"

  return <span className={color}>{score > 0 ? score.toLocaleString() : "—"}</span>
}

// WCL 파싱 % 색상 — 공식 Warcraft Logs 퍼센타일 색상 체계
const ParseColor = ({ parse }: { parse: number | null | undefined }) => {
  if (parse === null || parse === undefined) return <span className="text-muted-foreground">—</span>

  const pct = Math.round(parse)
  const color =
    pct >= 95
      ? "text-yellow-400 font-bold" // legendary
      : pct >= 75
        ? "text-purple-400" // epic
        : pct >= 50
          ? "text-blue-400" // rare
          : pct >= 25
            ? "text-green-400" // uncommon
            : "text-muted-foreground" // common

  return <span className={color}>{pct}</span>
}

const CharacterRow = ({ character }: { character: RosterCharacter }) => {
  const removeCharacter = useRosterStore((s) => s.removeCharacter)
  const classColor = getClassColor(character.className)
  const score = character.raiderIO?.score ?? 0
  const progression = character.raiderIO?.raidProgression
    ? Object.values(character.raiderIO.raidProgression)[0]
    : null

  return (
    <tr className="border-border/30 border-b transition-colors hover:bg-white/5">
      {/* 썸네일 + 이름 */}
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          {character.raiderIO?.thumbnailUrl && (
            <Image
              alt={character.name}
              className="border-border/50 size-8 rounded border"
              height={32}
              src={character.raiderIO.thumbnailUrl}
              width={32}
            />
          )}
          <span className="font-semibold" style={{ color: classColor }}>
            {character.name}
          </span>
        </div>
      </td>
      <td className="text-muted-foreground px-3 py-2 text-sm">{character.realm}</td>
      <td className="px-3 py-2 text-sm" style={{ color: classColor }}>
        {character.specName}
      </td>
      <td className="text-foreground/80 px-3 py-2 text-sm">{character.className}</td>
      <td className={`px-3 py-2 text-sm font-medium ${ROLE_COLOR[character.role] ?? ""}`}>
        {ROLE_LABEL[character.role] ?? character.role}
      </td>
      <td className="text-foreground/90 px-3 py-2 text-sm">{character.itemLevel}</td>
      <td className="px-3 py-2 font-mono text-sm">
        <ScoreColor score={score} />
      </td>
      <td className="px-3 py-2 font-mono text-sm">
        <ParseColor parse={character.warcraftLogs?.bestParseAvg} />
      </td>
      <td className="text-muted-foreground px-3 py-2 text-xs">{progression?.summary ?? "—"}</td>
      <td className="px-3 py-2">
        <button
          className="text-muted-foreground/60 text-xs transition-colors hover:text-red-400"
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
    return (
      <p className="text-muted-foreground py-6 text-center text-sm">
        아직 추가된 공대원이 없습니다.
      </p>
    )
  }

  const roleOrder = ["TANK", "HEALER", "MELEE", "RANGED"]
  const sorted = [...characters].sort(
    (a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
  )

  const roleCounts = sorted.reduce<Record<string, number>>((acc, c) => {
    acc[c.role] = (acc[c.role] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-primary font-semibold">공격대 ({characters.length}명)</span>
          <div className="flex gap-2 text-xs">
            {Object.entries(roleCounts).map(([role, count]) => (
              <span className={`${ROLE_COLOR[role] ?? ""}`} key={role}>
                {ROLE_LABEL[role]} {count}
              </span>
            ))}
          </div>
        </div>
        <button
          className="text-muted-foreground/60 text-xs transition-colors hover:text-red-400"
          onClick={clearRoster}
        >
          전체 초기화
        </button>
      </div>

      {/* 테이블 */}
      <div className="border-border/40 bg-card/60 overflow-x-auto rounded-md border">
        <table className="w-full text-left">
          <thead>
            <tr className="border-border/40 text-muted-foreground border-b text-xs">
              <th className="px-3 py-2">캐릭터</th>
              <th className="px-3 py-2">서버</th>
              <th className="px-3 py-2">특성</th>
              <th className="px-3 py-2">직업</th>
              <th className="px-3 py-2">역할</th>
              <th className="px-3 py-2">아이템레벨</th>
              <th className="px-3 py-2">M+ 점수</th>
              <th className="px-3 py-2">파싱 %</th>
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
