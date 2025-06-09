"use client"

import type React from "react"
import { useCallback, useMemo, useRef, useEffect } from "react"
import { useOptimizedState, useDebounce } from "@/hooks/use-optimized-state"

interface OptimizedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor: (item: T) => string
  onEndReached?: () => void
  endReachedThreshold?: number
  className?: string
  itemClassName?: string
  loadingIndicator?: React.ReactNode
  emptyComponent?: React.ReactNode
  isLoading?: boolean
}

export function OptimizedList<T>({
  items,
  renderItem,
  keyExtractor,
  onEndReached,
  endReachedThreshold = 200,
  className,
  itemClassName,
  loadingIndicator = <div>Loading...</div>,
  emptyComponent = <div>No items found</div>,
  isLoading = false,
}: OptimizedListProps<T>) {
  const listRef = useRef<HTMLDivElement>(null)
  const [isLoadingMore, setIsLoadingMore] = useOptimizedState(false)
  const onEndReachedCalledDuringMomentumRef = useRef(false)

  // Memoize the rendered items to prevent unnecessary re-renders
  const renderedItems = useMemo(() => {
    return items.map((item, index) => (
      <div key={keyExtractor(item)} className={itemClassName}>
        {renderItem(item, index)}
      </div>
    ))
  }, [items, renderItem, keyExtractor, itemClassName])

  // Handle scroll events to detect when the user has reached the end of the list
  const handleScroll = useCallback(() => {
    if (!listRef.current || !onEndReached || isLoadingMore || onEndReachedCalledDuringMomentumRef.current) {
      return
    }

    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    const distanceFromEnd = scrollHeight - scrollTop - clientHeight

    if (distanceFromEnd < endReachedThreshold) {
      onEndReachedCalledDuringMomentumRef.current = true
      setIsLoadingMore(true)

      onEndReached()

      // Reset after a short delay
      setTimeout(() => {
        onEndReachedCalledDuringMomentumRef.current = false
        setIsLoadingMore(false)
      }, 1000)
    }
  }, [onEndReached, isLoadingMore, endReachedThreshold, setIsLoadingMore])

  // Debounce the scroll handler for better performance
  const debouncedHandleScroll = useDebounce(handleScroll, 100)

  // Add scroll event listener
  useEffect(() => {
    const listElement = listRef.current

    if (listElement) {
      listElement.addEventListener("scroll", debouncedHandleScroll)
    }

    return () => {
      if (listElement) {
        listElement.removeEventListener("scroll", debouncedHandleScroll)
      }
    }
  }, [debouncedHandleScroll])

  // Render loading state
  if (isLoading && items.length === 0) {
    return <div className={className}>{loadingIndicator}</div>
  }

  // Render empty state
  if (!isLoading && items.length === 0) {
    return <div className={className}>{emptyComponent}</div>
  }

  return (
    <div ref={listRef} className={className} style={{ overflowY: "auto" }}>
      {renderedItems}
      {isLoadingMore && <div className="py-2">{loadingIndicator}</div>}
    </div>
  )
}
