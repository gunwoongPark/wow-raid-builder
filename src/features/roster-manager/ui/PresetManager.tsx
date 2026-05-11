"use client"

import { useTranslations } from "next-intl"
import { type ChangeEvent, type FormEvent, useState } from "react"
import { toast } from "sonner"

import { useRosterStore } from "@/entities/character"

import { type RosterPreset, usePresetStore } from "../model/preset-store"

// ─── PresetItem ────────────────────────────────────────────────────────────────

interface PresetItemProps {
  locale: string
  onDelete: (id: string, name: string) => void
  onLoad: (id: string, name: string) => void
  preset: RosterPreset
  t: ReturnType<typeof useTranslations>
}

const PresetItem = ({ locale, onDelete, onLoad, preset, t }: PresetItemProps) => {
  const handleLoad = () => onLoad(preset.id, preset.name)
  const handleDelete = () => onDelete(preset.id, preset.name)

  return (
    <li className="border-border/40 flex items-center justify-between gap-3 rounded-md border px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm font-medium">{preset.name}</p>
        <p className="text-muted-foreground text-xs">
          {t("memberCount", { count: preset.characters.length })} ·{" "}
          {new Date(preset.createdAt).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US")}
        </p>
      </div>
      <div className="flex shrink-0 gap-1.5">
        <button
          className="border-primary/60 text-primary hover:bg-primary/10 dark:border-primary/30 dark:text-primary/70 rounded border px-2.5 py-1 text-xs transition-colors"
          onClick={handleLoad}
        >
          {t("loadButton")}
        </button>
        <button
          aria-label={t("deleteAriaLabel", { name: preset.name })}
          className="rounded border border-transparent px-2.5 py-1 text-xs text-red-600/70 transition-colors hover:border-red-500/25 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400/50 dark:hover:border-red-400/25 dark:hover:text-red-400"
          onClick={handleDelete}
        >
          {t("deleteButton")}
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
  const setPartyAssignments = useRosterStore((store) => store.setPartyAssignments)

  const presets = usePresetStore((store) => store.presets)
  const savePreset = usePresetStore((store) => store.savePreset)
  const deletePreset = usePresetStore((store) => store.deletePreset)

  const [presetName, setPresetName] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const t = useTranslations("preset")

  // We need the locale for date formatting in PresetItem
  // next-intl's useLocale() can only be used at top level, so we read it from
  // the document lang attribute as a lightweight approach.
  const locale = typeof document !== "undefined" ? document.documentElement.lang : "ko"

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setPresetName(e.target.value)

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = presetName.trim()
    if (!trimmed) return
    if (!characters.length) {
      toast.error(t("toast.noMembers"))
      return
    }
    const { partyAssignments } = useRosterStore.getState()
    savePreset(trimmed, characters, partyAssignments)
    setPresetName("")
    toast.success(t("toast.saved", { name: trimmed }))
  }

  const handleLoad = (id: string, name: string) => {
    const preset = presets.find((p) => p.id === id)
    if (!preset) return
    clearRoster()
    preset.characters.forEach(addCharacter)
    setPartyAssignments(preset.partyAssignments ?? {})
    toast.success(t("toast.loaded", { name }), {
      description: t("toast.loadedDesc", { count: preset.characters.length }),
    })
  }

  const handleDelete = (id: string, name: string) => {
    deletePreset(id)
    toast.success(t("toast.deleted", { name }))
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
          {t("sectionTitle")}
          {presets.length > 0 && (
            <span className="text-muted-foreground/50 ml-1 text-[10px] font-normal tracking-normal normal-case">
              {t("savedCount", { count: presets.length })}
            </span>
          )}
        </h2>
        <span className="text-muted-foreground text-xs">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="mt-4 flex flex-col gap-4">
          {/* Save */}
          <form className="flex gap-2" onSubmit={handleSave}>
            <input
              className="wow-input border-border/60 bg-input text-foreground placeholder:text-muted-foreground flex-1 rounded-md border px-3 py-2 text-sm"
              maxLength={30}
              onChange={handleNameChange}
              placeholder={t("namePlaceholder")}
              type="text"
              value={presetName}
            />
            <button
              className="border-primary/70 text-primary hover:bg-primary/10 dark:border-primary/40 shrink-0 rounded border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!presetName.trim() || !characters.length}
              type="submit"
            >
              {t("saveButton")}
            </button>
          </form>

          {/* List */}
          {presets.length === 0 ? (
            <p className="text-muted-foreground py-2 text-center text-sm">{t("empty")}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {presets.map((preset) => (
                <PresetItem
                  key={preset.id}
                  locale={locale}
                  onDelete={handleDelete}
                  onLoad={handleLoad}
                  preset={preset}
                  t={t}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
