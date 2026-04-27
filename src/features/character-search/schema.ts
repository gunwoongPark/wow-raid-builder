import { z } from "zod"

export const characterSearchSchema = z.object({
  name: z.string().min(2, "캐릭터명을 2자 이상 입력해주세요."),
})

export type CharacterSearchSchema = z.infer<typeof characterSearchSchema>
