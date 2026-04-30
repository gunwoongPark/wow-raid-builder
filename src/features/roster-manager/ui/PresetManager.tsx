"use client"

import { type ChangeEvent, type FormEvent, useState } from "react"
import { toast } from "sonner"

import { useRosterStore } from "@/entities/character"

import { type RosterPreset, usePresetStore } from "../model/preset-store"

// ─── PresetItem ────────────────────────────────────────────────────────────────

interface PresetItemProps {
  onDelete: (id: string, name: string) => void
  onLoad: (id: string, name: string) => void
  preset: RosterPreset
}

const PresetItem = ({ onDelete, onLoad, preset }: PresetItemProps) => {
  const handleLoad = () => onLoad(preset.id, preset.name)
  const handleDelete = () => onDelete(preset.id, preset.name)

  return (
    <li className="border-border/40 flex items-center justify-between gap-3 rounded-md border px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm font-medium">{preset.name}</p>
        <p className="text-muted-foreground text-xs">
          {preset.characters.length}명 · {new Date(preset.createdAt).toLocaleDateString("ko-KR")}
        </p>
      </div>
      <div className="flex shrink-0 gap-1.5">
        <button
          className="border-primary/60 text-primary hover:bg-primary/10 dark:border-primary/30 dark:text-primary/70 rounded border px-2.5 py-1 text-xs transition-colors"
          onClick={handleLoad}
        >
          불러오기
        </button>
        <button
          aria-label={`${preset.name} 프리셋 삭제`}
          className="rounded border border-transparent px-2.5 py-1 text-xs text-red-600/70 transition-colors hover:border-red-500/25 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400/50 dark:hover:border-red-400/25 dark:hover:text-red-400"
          onClick={handleDelete}
        >
          삭제
        </button>
      </div>
    </li>
  )
}

// ─── PresetManager ─────────────────────────────────────────────────────────────

export const PresetManager = () => {
  const characters = useRosterStore((store) => store.characters)
  const clearRoster = useRosterStore((store) => store.clearRoster)
  const addCharacter = useRosterStore((store) => store.addCharacter)

  const presets = usePresetStore((store) => store.presets)
  const savePreset = usePresetStore((store) => store.savePreset)
  const deletePreset = usePresetStore((store) => store.deletePreset)

  const [presetName, setPresetName] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setPresetName(e.target.value)

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = presetName.trim()
    if (!trimmed) return
    if (!characters.length) {
      toast.error("저장할 공격대원이 없습니다.")
      return
    }
    savePreset(trimmed, characters)
    setPresetName("")
    toast.success(`"${trimmed}" 프리셋이 저장됐습니다.`)
  }

  const handleLoad = (id: string, name: string) => {
    const preset = presets.find((p) => p.id === id)
    if (!preset) return
    clearRoster()
    preset.characters.forEach(addCharacter)
    toast.success(`"${name}" 프리셋을 불러왔습니다.`, {
      description: `공격대원 ${preset.characters.length}명이 로드됐습니다.`,
    })
  }

  const handleDelete = (id: string, name: string) => {
    deletePreset(id)
    toast.success(`"${name}" 프리셋이 삭제됐습니다.`)
  }

  const handleToggle = () => setIsOpen((prev) => !prev)

  return (
    <section className="wow-panel border-border/60 bg-card/90 rounded-lg border p-5">
      <button
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between"
        onClick={handleToggle}
      >
        <h2 className="wow-section-title text-primary/80">
          프리셋
          {presets.length > 0 && (
            <span className="text-muted-foreground/50 ml-1 text-[10px] font-normal tracking-normal normal-case">
              {presets.length}개 저장됨
            </span>
          )}
        </h2>
        <span className="text-muted-foreground text-xs">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="mt-4 flex flex-col gap-4">
          {/* 저장 */}
          <form className="flex gap-2" onSubmit={handleSave}>
            <input
              className="wow-input border-border/60 bg-input text-foreground placeholder:text-muted-foreground flex-1 rounded-md border px-3 py-2 text-sm"
              maxLength={30}
              onChange={handleNameChange}
              placeholder="프리셋 이름 (예: A팀 20인)"
              type="text"
              value={presetName}
            />
            <button
              className="border-primary/70 text-primary hover:bg-primary/10 dark:border-primary/40 shrink-0 rounded border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!presetName.trim() || !characters.length}
              type="submit"
            >
              현재 구성 저장
            </button>
          </form>

          {/* 목록 */}
          {presets.length === 0 ? (
            <p className="text-muted-foreground py-2 text-center text-sm">
              저장된 프리셋이 없습니다.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {presets.map((preset) => (
                <PresetItem
                  key={preset.id}
                  onDelete={handleDelete}
                  onLoad={handleLoad}
                  preset={preset}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
