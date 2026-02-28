"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

export interface BackgroundImage {
  id: string
  url: string
  thumb: string
  label: string
  credit: string
}

const BACKGROUNDS: BackgroundImage[] = [
  {
    id: "none",
    url: "",
    thumb: "",
    label: "Gradient Only",
    credit: "",
  },
  {
    id: "mountains",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=60",
    label: "Mountains",
    credit: "Samuel Ferrara",
  },
  {
    id: "aurora",
    url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=200&q=60",
    label: "Aurora",
    credit: "Jonatan Pie",
  },
  {
    id: "forest",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&q=60",
    label: "Forest",
    credit: "Sebastian Unrau",
  },
  {
    id: "ocean",
    url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&q=60",
    label: "Ocean",
    credit: "Jeremy Bishop",
  },
  {
    id: "night-sky",
    url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&q=60",
    label: "Night Sky",
    credit: "Benjamin Voros",
  },
  {
    id: "desert",
    url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=200&q=60",
    label: "Desert",
    credit: "Keith Hardy",
  },
  {
    id: "lake",
    url: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=200&q=60",
    label: "Lake",
    credit: "Pietro De Grandi",
  },
  {
    id: "rain",
    url: "https://images.unsplash.com/photo-1428592953211-077101b2021b?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1428592953211-077101b2021b?w=200&q=60",
    label: "Rain",
    credit: "Max Bender",
  },
]

interface BackgroundPickerProps {
  selected: string
  onSelect: (bg: BackgroundImage) => void
  onClose: () => void
}

export function BackgroundPicker({ selected, onSelect, onClose }: BackgroundPickerProps) {
  const [page, setPage] = useState(0)
  const perPage = 6
  const totalPages = Math.ceil(BACKGROUNDS.length / perPage)
  const visible = BACKGROUNDS.slice(page * perPage, page * perPage + perPage)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[rgba(20,10,30,0.9)] backdrop-blur-xl border border-foreground/10 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-label="Choose background"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-foreground text-lg font-semibold">Choose Background</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-foreground/60 hover:bg-foreground/15 hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {visible.map((bg) => (
            <button
              key={bg.id}
              onClick={() => {
                onSelect(bg)
                onClose()
              }}
              className={`group relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                selected === bg.id
                  ? "border-primary shadow-[0_0_16px_rgba(200,60,150,0.4)]"
                  : "border-transparent hover:border-foreground/20"
              }`}
              aria-label={`Set background to ${bg.label}`}
              aria-pressed={selected === bg.id}
            >
              {bg.thumb ? (
                <img
                  src={bg.thumb}
                  alt={bg.label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#8c1450] via-[#3c1490] to-[#c83c64]" />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                <span className="text-foreground text-xs font-medium leading-tight">{bg.label}</span>
              </div>
            </button>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-foreground/60 hover:bg-foreground/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-foreground/50 text-sm tabular-nums">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-foreground/60 hover:bg-foreground/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <p className="text-foreground/30 text-xs text-center mt-4">
          Photos from Unsplash
        </p>
      </div>
    </div>
  )
}

export { BACKGROUNDS }
