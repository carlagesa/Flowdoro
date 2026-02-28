"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface Settings {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsBeforeLongBreak: number
}

export interface SessionLog {
  date: string          // ISO date string YYYY-MM-DD
  focusMinutes: number  // total focus minutes that day
  sessions: number      // sessions completed that day
}

export interface PomodoroStats {
  todayFocusMinutes: number
  todaySessions: number
  weekFocusMinutes: number
  weekSessions: number
  totalFocusMinutes: number
  totalSessions: number
  currentStreak: number   // consecutive days with at least 1 session
  bestStreak: number
  dailyLogs: SessionLog[]
}

interface PomodoroState {
  timeRemaining: number
  isRunning: boolean
  mode: "focus" | "break"
  completedSessions: number
  currentSession: number
  settings: Settings
  stats: PomodoroStats
}

const DEFAULT_SETTINGS: Settings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10)
}

function getWeekDates(): string[] {
  const dates: string[] = []
  const now = new Date()
  const dayOfWeek = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7))
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    dates.push(d.toISOString().slice(0, 10))
  }
  return dates
}

function calculateStreak(logs: SessionLog[]): { current: number; best: number } {
  if (logs.length === 0) return { current: 0, best: 0 }
  const sorted = [...logs].filter((l) => l.sessions > 0).sort((a, b) => b.date.localeCompare(a.date))
  if (sorted.length === 0) return { current: 0, best: 0 }

  let current = 0
  let best = 0
  let streak = 1
  const today = getToday()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  // Current streak must include today or yesterday
  if (sorted[0].date === today || sorted[0].date === yesterdayStr) {
    current = 1
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1].date)
      const curr = new Date(sorted[i].date)
      const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
      if (diff === 1) {
        current++
      } else {
        break
      }
    }
  }

  // Best streak
  streak = 1
  best = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date)
    const curr = new Date(sorted[i].date)
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
    if (diff === 1) {
      streak++
      best = Math.max(best, streak)
    } else {
      streak = 1
    }
  }

  return { current, best: Math.max(best, current) }
}

function loadLogs(): SessionLog[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem("flowdoro-logs")
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLogs(logs: SessionLog[]) {
  if (typeof window === "undefined") return
  localStorage.setItem("flowdoro-logs", JSON.stringify(logs))
}

function buildStats(logs: SessionLog[]): PomodoroStats {
  const today = getToday()
  const weekDates = getWeekDates()
  const todayLog = logs.find((l) => l.date === today)
  const weekLogs = logs.filter((l) => weekDates.includes(l.date))
  const { current, best } = calculateStreak(logs)

  return {
    todayFocusMinutes: todayLog?.focusMinutes ?? 0,
    todaySessions: todayLog?.sessions ?? 0,
    weekFocusMinutes: weekLogs.reduce((s, l) => s + l.focusMinutes, 0),
    weekSessions: weekLogs.reduce((s, l) => s + l.sessions, 0),
    totalFocusMinutes: logs.reduce((s, l) => s + l.focusMinutes, 0),
    totalSessions: logs.reduce((s, l) => s + l.sessions, 0),
    currentStreak: current,
    bestStreak: best,
    dailyLogs: logs.slice(-30), // last 30 days
  }
}

export function usePomodoro() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [mode, setMode] = useState<"focus" | "break">("focus")
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_SETTINGS.focusDuration * 60)
  const [logs, setLogs] = useState<SessionLog[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sessionStartRef = useRef<number | null>(null)

  // Load logs on mount
  useEffect(() => {
    setLogs(loadLogs())
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczIj2NxNjQfjUbLIO/1NqsXC8aOH+10d28bUIjLXK00dO0cU4sJ2ery9K2c1UyKWamx9G0clkzKWSjxdCzbls0KGKhw8+ya1w1J2CfwM6waF02Jl6dvsyuZV43JVybvMqsYl84JFqZusipX2A5I1eXuMenXGE6IlWVtsSkWWI7IVOTtMKiVmM8IFGRM8CgU2U9H0+PMr6eTmY+Hk2NL7ybS2g/HUuLL7uYSmhBHEiJLLmWSWpDGkWHKrmTRWxFGEOFK7eQQ29GFkGDKbWOPnFHFD+AJ7OLO3NJED17JbGIOXVLDjl5I6+GNnhNDDZ2IayDM3pPCjN0H6+AM3xRCDF0HayAMH1TCDB0Hqx/L35TCDBzHqt/L35UBy9zHat+Ln5VBi9zHKp+Ln5VBi9yG6l9LX5WBS5yG6l9LH9WBS5xGqh8LH9XBC1xGqh8K39XBC1xGad7K39YAyxxGad7Kn9YAyxwGKZ6Kn9ZAitxGKZ6KYBZAitwF6V5KYBaAStwF6V5KIBaAStxF6V5KIBaAStwF6V5KIBaAStwFqR4J4BbACpvFqR4J4BbACpvFqR4J4BbACpvFqR4J4BbACpvFqR4J4BbACpvFqR4J4BbACpvFqR4J4BbACpvFqR4J4BbACpvFqR4J4BbACpvFqR4J4BbACpvFqR4J4BbACpvFqR4J4BbACpvFqR4J4BbACpvFqR4J4BbACpvFqR4J4BbACpvFqR4J4BbACpvFqR4J4BbACpv")
    }
  }, [])

  // Track when focus session starts
  useEffect(() => {
    if (isRunning && mode === "focus") {
      sessionStartRef.current = Date.now()
    } else if (!isRunning && sessionStartRef.current && mode !== "focus") {
      // Session ended naturally
      sessionStartRef.current = null
    }
  }, [isRunning, mode])

  const logFocusMinutes = useCallback(
    (minutes: number) => {
      const today = getToday()
      setLogs((prev) => {
        const existing = prev.find((l) => l.date === today)
        let updated: SessionLog[]
        if (existing) {
          updated = prev.map((l) =>
            l.date === today
              ? { ...l, focusMinutes: l.focusMinutes + minutes, sessions: l.sessions + 1 }
              : l
          )
        } else {
          updated = [...prev, { date: today, focusMinutes: minutes, sessions: 1 }]
        }
        saveLogs(updated)
        return updated
      })
    },
    []
  )

  const playNotification = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(mode === "focus" ? "Focus session complete!" : "Break is over!", {
        body: mode === "focus" ? "Time for a break." : "Ready to focus again?",
      })
    }
  }, [mode])

  const getBreakDuration = useCallback(() => {
    return (completedSessions + 1) % settings.sessionsBeforeLongBreak === 0
      ? settings.longBreakDuration
      : settings.shortBreakDuration
  }, [completedSessions, settings])

  const switchMode = useCallback(
    (newMode: "focus" | "break") => {
      setIsRunning(false)
      setMode(newMode)
      if (newMode === "focus") {
        setTimeRemaining(settings.focusDuration * 60)
      } else {
        setTimeRemaining(getBreakDuration() * 60)
      }
    },
    [settings, getBreakDuration]
  )

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          playNotification()
          if (mode === "focus") {
            // Log the completed focus session
            logFocusMinutes(settings.focusDuration)
            setCompletedSessions((s) => s + 1)
            setMode("break")
            setIsRunning(false)
            return getBreakDuration() * 60
          } else {
            setMode("focus")
            setIsRunning(false)
            return settings.focusDuration * 60
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, mode, settings, getBreakDuration, playNotification, logFocusMinutes])

  const toggle = useCallback(() => {
    if (!isRunning && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
    setIsRunning((prev) => !prev)
  }, [isRunning])

  const reset = useCallback(() => {
    setIsRunning(false)
    if (mode === "focus") {
      setTimeRemaining(settings.focusDuration * 60)
    } else {
      setTimeRemaining(getBreakDuration() * 60)
    }
  }, [mode, settings, getBreakDuration])

  const skip = useCallback(() => {
    if (mode === "focus") {
      // Log partial session time
      if (sessionStartRef.current) {
        const elapsed = Math.round((Date.now() - sessionStartRef.current) / 60000)
        if (elapsed > 0) logFocusMinutes(elapsed)
        sessionStartRef.current = null
      }
      setCompletedSessions((s) => s + 1)
      switchMode("break")
    } else {
      switchMode("focus")
    }
  }, [mode, switchMode, logFocusMinutes])

  const updateSettings = useCallback(
    (newSettings: Settings) => {
      setSettings(newSettings)
      if (!isRunning) {
        if (mode === "focus") {
          setTimeRemaining(newSettings.focusDuration * 60)
        } else {
          const breakDur =
            (completedSessions + 1) % newSettings.sessionsBeforeLongBreak === 0
              ? newSettings.longBreakDuration
              : newSettings.shortBreakDuration
          setTimeRemaining(breakDur * 60)
        }
      }
    },
    [isRunning, mode, completedSessions]
  )

  const stats = buildStats(logs)

  const state: PomodoroState = {
    timeRemaining,
    isRunning,
    mode,
    completedSessions,
    currentSession: completedSessions + 1,
    settings,
    stats,
  }

  return {
    ...state,
    toggle,
    reset,
    skip,
    switchMode,
    updateSettings,
  }
}
