import { z } from "zod"

export const characterParamSchema = z.object({
  name: z
    .string()
    .min(2, "캐릭터명은 2자 이상이어야 합니다.")
    .max(50, "캐릭터명이 너무 깁니다.")
    .regex(/^[가-힣a-zA-Z0-9]+$/, "유효하지 않은 캐릭터명입니다."),
  realm: z
    .string()
    .min(2, "서버 슬러그가 너무 짧습니다.")
    .max(40, "서버 슬러그가 너무 깁니다.")
    .regex(/^[a-z-]+$/, "유효하지 않은 서버 슬러그입니다."),
})
