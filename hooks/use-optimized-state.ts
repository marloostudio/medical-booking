"use client"

import { useState, useCallback, useRef, useEffect } from "react"

/**
 * A hook that provides an optimized state with memoized update functions
 */
export function useOptimizedState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState)

  // Memoize the setState function
  const setOptimizedState = useCallback((newState: T | ((prevState: T) => T)) => {
    setState(newState)
  }, [])

  return [state, setOptimizedState] as const
}

/**
 * A hook that debounces a value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * A hook that throttles a function
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const lastExecuted = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastArgsRef = useRef<Parameters<T> | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      lastArgsRef.current = args

      const execute = () => {
        callback(...(lastArgsRef.current as Parameters<T>))
        lastExecuted.current = Date.now()
      }

      if (now - lastExecuted.current > delay) {
        execute()
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(
          () => {
            execute()
          },
          delay - (now - lastExecuted.current),
        )
      }
    },
    [callback, delay],
  )
}

/**
 * A hook that memoizes expensive calculations
 */
export function useMemoizedCalculation<T, D>(
  calculation: (deps: D) => T,
  deps: D,
  equalityFn?: (prev: D, next: D) => boolean,
): T {
  const prevDepsRef = useRef<D>(deps)
  const resultRef = useRef<T>(calculation(deps))

  const areEqual = equalityFn
    ? equalityFn(prevDepsRef.current, deps)
    : JSON.stringify(prevDepsRef.current) === JSON.stringify(deps)

  if (!areEqual) {
    resultRef.current = calculation(deps)
    prevDepsRef.current = deps
  }

  return resultRef.current
}
