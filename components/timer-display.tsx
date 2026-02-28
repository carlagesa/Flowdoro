"use client"

import { useEffect, useState } from "react"

interface TimerDisplayProps {
  timeRemaining: number
  isRunning: boolean
  mode: "focus" | "break"
}

export function TimerDisplay({ timeRemaining, isRunning, mode }: TimerDisplayProps) {
  const [pulse, setPulse] = useState(false)

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

  useEffect(() => {
    if (timeRemaining <= 10 && timeRemaining > 0 && isRunning) {
      setPulse(true)
      const timeout = setTimeout(() => setPulse(false), 500)
      return () => clearTimeout(timeout)
    }
  }, [timeRemaining, isRunning])

  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className={`text-foreground font-sans tracking-tight transition-all duration-300 select-none ${
          pulse ? "scale-105" : "scale-100"
        }`}
        style={{
          fontSize: "clamp(5rem, 18vw, 14rem)",
          fontWeight: 800,
          lineHeight: 1,
          textShadow: "0 0 80px rgba(255,255,255,0.15)",
        }}
        role="timer"
        aria-live="polite"
        aria-label={`${minutes} minutes and ${seconds} seconds remaining`}
      >
        {display}
      </span>
      <div className="flex items-center gap-2 mt-2">
        <span
          className={`inline-block w-2 h-2 rounded-full transition-colors duration-500 ${
            isRunning
              ? mode === "focus"
                ? "bg-primary animate-pulse"
                : "bg-accent animate-pulse"
              : "bg-muted-foreground"
          }`}
        />
        <span className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
          {isRunning ? (mode === "focus" ? "Focusing" : "Resting") : "Ready"}
        </span>
      </div>
    </div>
  )
}
