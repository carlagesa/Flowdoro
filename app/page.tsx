"use client"

import { useState, useMemo, useEffect } from "react"
import { GradientBackground } from "@/components/gradient-background"
import { BackgroundImage } from "@/components/background-image"
import { TimerDisplay } from "@/components/timer-display"
import { TimerControls } from "@/components/timer-controls"
import { SessionIndicators } from "@/components/session-indicators"
import { SettingsPanel } from "@/components/settings-panel"
import { Greeting } from "@/components/greeting"
import { BottomBar } from "@/components/bottom-bar"
import { ProgressRing } from "@/components/progress-ring"
import { BackgroundPicker, BACKGROUNDS } from "@/components/background-picker"
import type { BackgroundImage as BackgroundImageType } from "@/components/background-picker"
import { SpotifyWidget } from "@/components/spotify-widget"
import { Notepad } from "@/components/notepad"
import { MotivationalQuote } from "@/components/motivational-quote"
import { usePomodoro } from "@/hooks/use-pomodoro"

export default function PomodoroPage() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [bgPickerOpen, setBgPickerOpen] = useState(false)
  const [spotifyOpen, setSpotifyOpen] = useState(false)
  const [notepadOpen, setNotepadOpen] = useState(false)
  const [selectedBg, setSelectedBg] = useState<BackgroundImageType>(BACKGROUNDS[0])

  const {
    timeRemaining,
    isRunning,
    mode,
    completedSessions,
    currentSession,
    settings,
    toggle,
    reset,
    skip,
    switchMode,
    updateSettings,
    stats,
  } = usePomodoro()

  const totalDuration = useMemo(() => {
    if (mode === "focus") return settings.focusDuration * 60
    return (completedSessions % settings.sessionsBeforeLongBreak === 0 && completedSessions > 0
      ? settings.longBreakDuration
      : settings.shortBreakDuration) * 60
  }, [mode, settings, completedSessions])

  const progress = 1 - timeRemaining / totalDuration

  useEffect(() => {
    const mins = Math.floor(timeRemaining / 60)
    const secs = timeRemaining % 60
    const display = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    const modeLabel = mode === "focus" ? "Focus" : "Break"
    document.title = isRunning ? `${display} - ${modeLabel} | Flowdoro` : "Flowdoro - Focus Timer"
  }, [timeRemaining, isRunning, mode])

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      {/* Animated gradient canvas (always rendered, dims behind photo) */}
      <GradientBackground mode={isRunning ? mode : "idle"} />

      {/* Photo background layer */}
      <BackgroundImage url={selectedBg.url} />

      {/* Vignette overlay */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        {/* Greeting */}
        <div className="mb-2">
          <Greeting />
        </div>

        {/* Timer area */}
        <div className="relative flex items-center justify-center">
          <ProgressRing progress={progress} mode={mode} />
          <div className="relative z-10">
            <TimerDisplay
              timeRemaining={timeRemaining}
              isRunning={isRunning}
              mode={mode}
            />
          </div>
        </div>

        {/* Session indicators */}
        <SessionIndicators
          totalSessions={settings.sessionsBeforeLongBreak}
          completedSessions={completedSessions % settings.sessionsBeforeLongBreak}
          currentSession={currentSession}
          mode={mode}
        />

        {/* Controls */}
        <div className="mt-2">
          <TimerControls
            isRunning={isRunning}
            onToggle={toggle}
            onReset={reset}
            onSkip={skip}
          />
        </div>

        {/* Motivational quote */}
        <div className="mt-4">
          <MotivationalQuote />
        </div>
      </div>

      {/* Spotify widget */}
      <SpotifyWidget open={spotifyOpen} onClose={() => setSpotifyOpen(false)} />

      {/* Notepad */}
      <Notepad open={notepadOpen} onClose={() => setNotepadOpen(false)} />

      {/* Bottom bar */}
      <BottomBar
        mode={mode}
        onModeSwitch={switchMode}
        onSettingsOpen={() => setSettingsOpen(true)}
        onBackgroundOpen={() => setBgPickerOpen(true)}
        onSpotifyToggle={() => setSpotifyOpen((o) => !o)}
        onNotepadToggle={() => setNotepadOpen((o) => !o)}
        completedSessions={completedSessions}
        spotifyOpen={spotifyOpen}
        notepadOpen={notepadOpen}
      />

      {/* Background picker */}
      {bgPickerOpen && (
        <BackgroundPicker
          selected={selectedBg.id}
          onSelect={setSelectedBg}
          onClose={() => setBgPickerOpen(false)}
        />
      )}

      {/* Settings panel */}
      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={updateSettings}
          onClose={() => setSettingsOpen(false)}
          stats={stats}
        />
      )}
    </main>
  )
}
