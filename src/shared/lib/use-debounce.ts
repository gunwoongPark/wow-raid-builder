"use client"

import { debounce } from "lodash-es"
import { useEffect, useState } from "react"

export const useDebounce = <Value>(value: Value, delay: number): Value => {
  const [debouncedValue, setDebouncedValue] = useState<Value>(value)

  // React Compiler가 debounce 인스턴스를 자동 메모이제이션 — useMemo 불필요
  const debouncedSetter = debounce(setDebouncedValue, delay)

  useEffect(() => {
    debouncedSetter(value)
    return () => debouncedSetter.cancel()
  }, [value, debouncedSetter])

  return debouncedValue
}
