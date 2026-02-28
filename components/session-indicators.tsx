"use client"

interface SessionIndicatorsProps {
  totalSessions: number
  completedSessions: number
  currentSession: number
  mode: "focus" | "break"
}

export function SessionIndicators({
  totalSessions,
  completedSessions,
  currentSession,
  mode,
}: SessionIndicatorsProps) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label={`Session ${currentSession} of ${totalSessions}`}>
      {Array.from({ length: totalSessions }).map((_, i) => {
        const isCompleted = i < completedSessions
        const isCurrent = i === completedSessions
        return (
          <div
            key={i}
            className={`rounded-full transition-all duration-500 ${
              isCompleted
                ? "w-3 h-3 bg-primary"
                : isCurrent
                ? `w-4 h-4 border-2 ${
                    mode === "focus" ? "border-primary" : "border-accent"
                  } bg-transparent`
                : "w-3 h-3 bg-foreground/20"
            }`}
            aria-label={
              isCompleted
                ? `Session ${i + 1}: completed`
                : isCurrent
                ? `Session ${i + 1}: in progress`
                : `Session ${i + 1}: upcoming`
            }
          />
        )
      })}
    </div>
  )
}
