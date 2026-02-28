"use client"

import { Settings, Timer, Coffee, Flame, Image, Music, PenLine } from "lucide-react"

interface BottomBarProps {
  mode: "focus" | "break"
  onModeSwitch: (mode: "focus" | "break") => void
  onSettingsOpen: () => void
  onBackgroundOpen: () => void
  onSpotifyToggle: () => void
  onNotepadToggle: () => void
  completedSessions: number
  spotifyOpen: boolean
  notepadOpen: boolean
}

export function BottomBar({
  mode,
  onModeSwitch,
  onSettingsOpen,
  onBackgroundOpen,
  onSpotifyToggle,
  onNotepadToggle,
  completedSessions,
  spotifyOpen,
  notepadOpen,
}: BottomBarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
      <div className="flex items-center gap-1 px-2 py-2 rounded-full bg-[rgba(10,5,20,0.6)] backdrop-blur-xl border border-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {/* Spotify */}
        <button
          onClick={onSpotifyToggle}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
            spotifyOpen
              ? "bg-[#1DB954]/20 text-[#1DB954]"
              : "text-foreground/50 hover:text-foreground/80 hover:bg-foreground/10"
          }`}
          aria-label={spotifyOpen ? "Close Spotify player" : "Open Spotify player"}
          aria-pressed={spotifyOpen}
        >
          <Music className="w-4.5 h-4.5" />
        </button>

        {/* Notepad */}
        <button
          onClick={onNotepadToggle}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
            notepadOpen
              ? "bg-primary/20 text-primary"
              : "text-foreground/50 hover:text-foreground/80 hover:bg-foreground/10"
          }`}
          aria-label={notepadOpen ? "Close notepad" : "Open notepad"}
          aria-pressed={notepadOpen}
        >
          <PenLine className="w-4.5 h-4.5" />
        </button>

        {/* Background picker */}
        <button
          onClick={onBackgroundOpen}
          className="flex items-center justify-center w-10 h-10 rounded-full text-foreground/50 hover:text-foreground/80 hover:bg-foreground/10 transition-all duration-300"
          aria-label="Change background"
        >
          <Image className="w-4.5 h-4.5" />
        </button>

        <div className="w-px h-6 bg-foreground/10 mx-1" />

        {/* Focus mode */}
        <button
          onClick={() => onModeSwitch("focus")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            mode === "focus"
              ? "bg-primary/20 text-primary-foreground"
              : "text-foreground/50 hover:text-foreground/80"
          }`}
          aria-label="Focus mode"
          aria-pressed={mode === "focus"}
        >
          <Timer className="w-4 h-4" />
          <span className="hidden sm:inline">Focus</span>
        </button>

        {/* Break mode */}
        <button
          onClick={() => onModeSwitch("break")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            mode === "break"
              ? "bg-accent/20 text-accent-foreground"
              : "text-foreground/50 hover:text-foreground/80"
          }`}
          aria-label="Break mode"
          aria-pressed={mode === "break"}
        >
          <Coffee className="w-4 h-4" />
          <span className="hidden sm:inline">Break</span>
        </button>

        <div className="w-px h-6 bg-foreground/10 mx-1" />

        {/* Session count */}
        {completedSessions > 0 && (
          <div className="flex items-center gap-1 px-3 py-2.5 text-foreground/50">
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold tabular-nums">{completedSessions}</span>
          </div>
        )}

        {/* Settings */}
        <button
          onClick={onSettingsOpen}
          className="flex items-center justify-center w-10 h-10 rounded-full text-foreground/50 hover:text-foreground/80 hover:bg-foreground/10 transition-all duration-300"
          aria-label="Open settings"
        >
          <Settings className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  )
}
