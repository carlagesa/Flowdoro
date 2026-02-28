"use client"

import { Play, Pause, RotateCcw, SkipForward } from "lucide-react"

interface TimerControlsProps {
  isRunning: boolean
  onToggle: () => void
  onReset: () => void
  onSkip: () => void
}

export function TimerControls({ isRunning, onToggle, onReset, onSkip }: TimerControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onReset}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-foreground/10 backdrop-blur-md border border-foreground/10 text-foreground/70 hover:text-foreground hover:bg-foreground/15 transition-all duration-300"
        aria-label="Reset timer"
      >
        <RotateCcw className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-180" />
      </button>

      <button
        onClick={onToggle}
        className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-foreground/15 backdrop-blur-md border border-foreground/15 text-foreground hover:bg-foreground/20 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        aria-label={isRunning ? "Pause timer" : "Start timer"}
      >
        {isRunning ? (
          <Pause className="w-7 h-7" />
        ) : (
          <Play className="w-7 h-7 ml-0.5" />
        )}
      </button>

      <button
        onClick={onSkip}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-foreground/10 backdrop-blur-md border border-foreground/10 text-foreground/70 hover:text-foreground hover:bg-foreground/15 transition-all duration-300"
        aria-label="Skip to next session"
      >
        <SkipForward className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>
    </div>
  )
}
