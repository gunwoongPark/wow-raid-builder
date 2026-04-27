"use client"

import { debounce } from "lodash-es"
import { useEffect, useMemo, useState } from "react"

export const useDebounce = <Value>(value: Value, delay: number): Value => {
  const [debouncedValue, setDebouncedValue] = useState<Value>(value)

  const debouncedSetter = useMemo(
    () => debounce((nextValue: Value) => setDebouncedValue(nextValue), delay),
    [delay]
  )

  useEffect(() => {
    debouncedSetter(value)
    return () => debouncedSetter.cancel()
  }, [value, debouncedSetter])

  return debouncedValue
}
