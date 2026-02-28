"use client"

interface ProgressRingProps {
  progress: number
  mode: "focus" | "break"
}

export function ProgressRing({ progress, mode }: ProgressRingProps) {
  const size = 320
  const strokeWidth = 3
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - progress * circumference

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
      <svg width={size} height={size} className="rotate-[-90deg] opacity-30">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-foreground/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-linear ${
            mode === "focus" ? "text-primary" : "text-accent"
          }`}
        />
      </svg>
    </div>
  )
}
