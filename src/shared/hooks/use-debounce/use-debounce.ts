import { useEffect, useState } from 'react'

export const useDebounce = (value: string, delay: number = 500) => {
  const [debounce, setDebounce] = useState<string>(value)

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebounce(value)
    }, delay)

    return () => {
      clearTimeout(timerId)
    }
  }, [value, delay])

  return debounce
}
