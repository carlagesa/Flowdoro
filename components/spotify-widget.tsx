"use client"

import { useState } from "react"
import { X, Music, ChevronDown, ChevronUp, GripHorizontal } from "lucide-react"
import { useDraggable } from "@/hooks/use-draggable"

interface SpotifyPlaylist {
  id: string
  name: string
  uri: string
}

const PLAYLISTS: SpotifyPlaylist[] = [
  { id: "0vvXsWCC9xrXsKd4FyS8kM", name: "Lofi Beats", uri: "37i9dQZF1DWWQRwui0ExPn" },
  { id: "1", name: "Deep Focus", uri: "37i9dQZF1DWZeKCadgRdKQ" },
  { id: "2", name: "Peaceful Piano", uri: "37i9dQZF1DX4sWSpwq3LiO" },
  { id: "3", name: "Brain Food", uri: "37i9dQZF1DWXLeA8Omikj7" },
  { id: "4", name: "Nature Sounds", uri: "37i9dQZF1DX4PP3DA4J0N8" },
  { id: "5", name: "Ambient Relaxation", uri: "37i9dQZF1DX3Ogo9pFvBkY" },
  { id: "6", name: "Jazz for Study", uri: "37i9dQZF1DX0SM0LYsmbMT" },
  { id: "7", name: "Classical Focus", uri: "37i9dQZF1DWV0gynK7G6pD" },
]

interface SpotifyWidgetProps {
  open: boolean
  onClose: () => void
}

export function SpotifyWidget({ open, onClose }: SpotifyWidgetProps) {
  const [selectedPlaylist, setSelectedPlaylist] = useState(PLAYLISTS[0])
  const [expanded, setExpanded] = useState(false)

  const { position, containerRef, dragProps } = useDraggable({
    initialPosition: { x: 16, y: Math.max(60, (typeof window !== "undefined" ? window.innerHeight : 600) - 420) },
    handleSelector: "[data-drag-handle]",
  })

  if (!open) return null

  return (
    <div
      ref={containerRef}
      className="fixed z-40 animate-in fade-in duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: "none",
        userSelect: "none",
      }}
      {...dragProps}
    >
      <div className="w-80 rounded-2xl bg-[rgba(10,5,20,0.85)] backdrop-blur-xl border border-foreground/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Drag handle */}
        <div
          data-drag-handle
          className="flex items-center justify-center py-1.5 cursor-grab active:cursor-grabbing select-none"
        >
          <GripHorizontal className="w-5 h-5 text-foreground/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-2 border-b border-foreground/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#1DB954] flex items-center justify-center">
              <Music className="w-3.5 h-3.5 text-[rgba(10,5,20,1)]" />
            </div>
            <span className="text-foreground text-sm font-semibold">Spotify Player</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center text-foreground/50 hover:bg-foreground/15 hover:text-foreground transition-colors"
            aria-label="Close Spotify widget"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Playlist selector */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-foreground/5 transition-colors"
          aria-expanded={expanded}
        >
          <span className="text-foreground/70 text-xs font-medium">{selectedPlaylist.name}</span>
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-foreground/40" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-foreground/40" />
          )}
        </button>

        {expanded && (
          <div className="px-2 pb-2 max-h-40 overflow-y-auto scrollbar-thin">
            {PLAYLISTS.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => {
                  setSelectedPlaylist(playlist)
                  setExpanded(false)
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedPlaylist.uri === playlist.uri
                    ? "bg-[#1DB954]/20 text-[#1DB954]"
                    : "text-foreground/60 hover:bg-foreground/10 hover:text-foreground/80"
                }`}
              >
                <Music className="w-3.5 h-3.5 shrink-0" />
                {playlist.name}
              </button>
            ))}
          </div>
        )}

        {/* Spotify embed */}
        <div className="px-3 pb-3">
          <iframe
            title={`Spotify playlist: ${selectedPlaylist.name}`}
            style={{ borderRadius: "12px" }}
            src={`https://open.spotify.com/embed/playlist/${selectedPlaylist.uri}?utm_source=generator&theme=0`}
            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>

        <p className="px-4 pb-3 text-foreground/25 text-[10px] leading-tight">
          Powered by Spotify. A Spotify account is required for full playback.
        </p>
      </div>
    </div>
  )
}
