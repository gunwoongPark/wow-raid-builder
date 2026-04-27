import { z } from "zod"

export const guildSearchSchema = z.object({
  guildName: z.string().min(1, "길드명을 입력해주세요."),
  realm: z.string().min(1, "서버명을 입력해주세요."),
})

export type GuildSearchSchema = z.infer<typeof guildSearchSchema>
