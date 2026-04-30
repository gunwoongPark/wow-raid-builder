import { type BuffCategory } from "@/entities/character"

export const CATEGORY_LABEL: Record<BuffCategory, string> = {
  공생기: "공생기",
  블러드: "블러드",
  시너지: "시너지",
  외생기: "외생기",
  유틸: "유틸",
  전투부활: "전투 부활",
}

// 블러드와 전투부활은 한 행에 나란히 표시
export const INLINE_CATEGORIES = new Set<BuffCategory>(["블러드", "전투부활"])
