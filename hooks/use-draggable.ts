"use client"

import { useState, useRef, useCallback, useEffect } from "react"

interface Position {
  x: number
  y: number
}

interface UseDraggableOptions {
  initialPosition: Position
  handleSelector?: string
}

export function useDraggable({ initialPosition, handleSelector }: UseDraggableOptions) {
  const [position, setPosition] = useState<Position>(initialPosition)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragOffset = useRef<Position>({ x: 0, y: 0 })
  const rafId = useRef<number | null>(null)
  const latestPointer = useRef<Position>({ x: 0, y: 0 })

  const updatePosition = useCallback(() => {
    if (!isDragging.current || !containerRef.current) return
    const maxX = window.innerWidth - containerRef.current.offsetWidth
    const maxY = window.innerHeight - containerRef.current.offsetHeight
    const newX = Math.max(0, Math.min(maxX, latestPointer.current.x - dragOffset.current.x))
    const newY = Math.max(0, Math.min(maxY, latestPointer.current.y - dragOffset.current.y))
    setPosition({ x: newX, y: newY })
    rafId.current = null
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const container = containerRef.current
      if (!container) return

      if (handleSelector) {
        const handle = container.querySelector(handleSelector)
        if (!handle) return
        const target = e.target as HTMLElement
        if (!handle.contains(target)) return
      }

      const target = e.target as HTMLElement
      const interactive = target.closest(
        "button, input, textarea, select, iframe, a, [contenteditable]"
      )
      if (interactive && !target.closest(handleSelector || "")) return

      isDragging.current = true
      const rect = container.getBoundingClientRect()
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
      latestPointer.current = { x: e.clientX, y: e.clientY }
      container.setPointerCapture(e.pointerId)

      // Apply will-change for GPU acceleration during drag
      container.style.willChange = "left, top"
      e.preventDefault()
    },
    [handleSelector]
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return
      latestPointer.current = { x: e.clientX, y: e.clientY }

      // Throttle to rAF for smooth 60fps updates
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(updatePosition)
      }
    },
    [updatePosition]
  )

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (isDragging.current && containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId)
      containerRef.current.style.willChange = "auto"
    }
    isDragging.current = false
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current)
      rafId.current = null
    }
  }, [])

  // Keep within bounds on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return
      const maxX = window.innerWidth - containerRef.current.offsetWidth
      const maxY = window.innerHeight - containerRef.current.offsetHeight
      setPosition((prev) => ({
        x: Math.max(0, Math.min(maxX, prev.x)),
        y: Math.max(0, Math.min(maxY, prev.y)),
      }))
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  return {
    position,
    containerRef,
    dragProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
  }
}
