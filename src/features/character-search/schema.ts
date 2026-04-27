import { z } from "zod"

export const characterSearchSchema = z.object({
  name: z.string().min(2, "캐릭터명을 입력해주세요."),
  realm: z.string().min(1, "서버명을 입력해주세요."),
})

export type CharacterSearchSchema = z.infer<typeof characterSearchSchema>
