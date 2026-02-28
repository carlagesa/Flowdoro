"use client"

import { useEffect, useRef } from "react"

interface GradientBackgroundProps {
  mode: "focus" | "break" | "idle"
}

export function GradientBackground({ mode }: GradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }

    resize()
    window.addEventListener("resize", resize)

    const palettes = {
      focus: [
        { r: 140, g: 20, b: 80 },
        { r: 180, g: 40, b: 120 },
        { r: 80, g: 20, b: 160 },
        { r: 200, g: 60, b: 100 },
      ],
      break: [
        { r: 20, g: 80, b: 140 },
        { r: 40, g: 120, b: 160 },
        { r: 60, g: 60, b: 180 },
        { r: 80, g: 140, b: 200 },
      ],
      idle: [
        { r: 120, g: 30, b: 120 },
        { r: 200, g: 50, b: 100 },
        { r: 60, g: 20, b: 140 },
        { r: 180, g: 60, b: 140 },
      ],
    }

    const animate = () => {
      timeRef.current += 0.003
      const t = timeRef.current
      const w = canvas.width
      const h = canvas.height
      const colors = palettes[mode]

      const gradient1 = ctx.createRadialGradient(
        w * (0.3 + Math.sin(t * 0.7) * 0.2),
        h * (0.3 + Math.cos(t * 0.5) * 0.2),
        0,
        w * 0.5,
        h * 0.5,
        w * 0.8
      )
      gradient1.addColorStop(0, `rgba(${colors[0].r}, ${colors[0].g}, ${colors[0].b}, 1)`)
      gradient1.addColorStop(0.5, `rgba(${colors[1].r}, ${colors[1].g}, ${colors[1].b}, 0.8)`)
      gradient1.addColorStop(1, `rgba(${colors[2].r}, ${colors[2].g}, ${colors[2].b}, 0.4)`)

      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, w, h)

      const gradient2 = ctx.createRadialGradient(
        w * (0.7 + Math.cos(t * 0.6) * 0.2),
        h * (0.6 + Math.sin(t * 0.8) * 0.2),
        0,
        w * 0.6,
        h * 0.5,
        w * 0.7
      )
      gradient2.addColorStop(0, `rgba(${colors[3].r}, ${colors[3].g}, ${colors[3].b}, 0.8)`)
      gradient2.addColorStop(0.6, `rgba(${colors[1].r}, ${colors[1].g}, ${colors[1].b}, 0.4)`)
      gradient2.addColorStop(1, `rgba(${colors[0].r}, ${colors[0].g}, ${colors[0].b}, 0)`)

      ctx.globalCompositeOperation = "screen"
      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, w, h)

      const gradient3 = ctx.createRadialGradient(
        w * (0.5 + Math.sin(t * 0.4) * 0.3),
        h * (0.4 + Math.cos(t * 0.3) * 0.3),
        0,
        w * 0.5,
        h * 0.5,
        w * 0.5
      )
      gradient3.addColorStop(0, `rgba(255, 255, 255, 0.08)`)
      gradient3.addColorStop(0.5, `rgba(255, 255, 255, 0.02)`)
      gradient3.addColorStop(1, `rgba(255, 255, 255, 0)`)

      ctx.fillStyle = gradient3
      ctx.fillRect(0, 0, w, h)

      ctx.globalCompositeOperation = "source-over"

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [mode])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}
