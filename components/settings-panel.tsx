"use client"

import { useState } from "react"
import {
  X,
  Timer,
  Palette,
  BarChart3,
  Quote,
  Sparkles,
  HelpCircle,
  Minus,
  Plus,
  Clock,
  TrendingUp,
  Flame,
  Target,
  Calendar,
} from "lucide-react"
import type { PomodoroStats } from "@/hooks/use-pomodoro"

interface Settings {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsBeforeLongBreak: number
}

interface SettingsPanelProps {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
  onClose: () => void
  stats: PomodoroStats
}

type Tab = "timer" | "themes" | "stats" | "quotes" | "extras" | "support"

const NAV_ITEMS: { id: Tab; label: string; icon: typeof Timer; badge?: string }[] = [
  { id: "themes", label: "Themes", icon: Palette },
  { id: "timer", label: "Focus Timer", icon: Timer, badge: "New" },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "quotes", label: "Quotes", icon: Quote },
  { id: "extras", label: "Extras", icon: Sparkles },
  { id: "support", label: "Support", icon: HelpCircle },
]

/* ─── Small reusable sub-components ─── */

function NumberStepper({
  label,
  value,
  unit,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  unit: string
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/50 text-xs font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white/70 transition-colors"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <div className="flex items-baseline gap-1 min-w-[56px] justify-center">
          <span className="text-white text-lg font-semibold tabular-nums">{value}</span>
          {unit && <span className="text-white/30 text-xs">{unit}</span>}
        </div>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white/70 transition-colors"
          aria-label={`Increase ${label}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (c: boolean) => void
}) {
  return (
    <div className="flex items-start gap-4 py-3">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? "bg-purple-500" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <div className="flex flex-col gap-0.5">
        <span className="text-white text-sm font-medium leading-tight">{label}</span>
        {description && (
          <span className="text-white/35 text-xs leading-snug">{description}</span>
        )}
      </div>
    </div>
  )
}

/* ─── Tab content panels ─── */

function TimerSettings({
  settings,
  onSettingsChange,
}: {
  settings: Settings
  onSettingsChange: (s: Settings) => void
}) {
  const [autoStart, setAutoStart] = useState(true)
  const [showProgressBar, setShowProgressBar] = useState(true)
  const [showNotification, setShowNotification] = useState(false)
  const [showStreak, setShowStreak] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-white text-2xl font-bold tracking-tight">Focus Timer</h2>
        <p className="text-white/35 text-sm mt-1">Customize your timer to match your workflow.</p>
      </div>

      <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-5">
        <h3 className="text-white text-sm font-semibold mb-1">Timer Lengths</h3>
        <p className="text-white/30 text-xs mb-4">Set the duration for each timer phase.</p>
        <div className="grid grid-cols-2 gap-6">
          <NumberStepper label="Focus" value={settings.focusDuration} unit="mins" min={5} max={90} step={5} onChange={(v) => onSettingsChange({ ...settings, focusDuration: v })} />
          <NumberStepper label="Short Break" value={settings.shortBreakDuration} unit="mins" min={1} max={30} step={1} onChange={(v) => onSettingsChange({ ...settings, shortBreakDuration: v })} />
          <NumberStepper label="Long Break" value={settings.longBreakDuration} unit="mins" min={5} max={60} step={5} onChange={(v) => onSettingsChange({ ...settings, longBreakDuration: v })} />
          <NumberStepper label="Sessions" value={settings.sessionsBeforeLongBreak} unit="" min={2} max={8} step={1} onChange={(v) => onSettingsChange({ ...settings, sessionsBeforeLongBreak: v })} />
        </div>
      </div>

      <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-5">
        <h3 className="text-white text-sm font-semibold mb-2">Preferences</h3>
        <div className="divide-y divide-white/[0.06]">
          <Toggle label="Show timer progress bar" description="Display a visual progress ring around the timer" checked={showProgressBar} onChange={setShowProgressBar} />
          <Toggle label="Show notification" description="Show a browser notification when the timer ends" checked={showNotification} onChange={setShowNotification} />
          <Toggle label="Auto start on segment end" description="Automatically start the next session when one ends" checked={autoStart} onChange={setAutoStart} />
          <Toggle label="Show streak counter" description="Display your completed session streak in the bottom bar" checked={showStreak} onChange={setShowStreak} />
          <Toggle label="Sound effects" description="Play a sound when the timer completes" checked={soundEnabled} onChange={setSoundEnabled} />
        </div>
      </div>
    </div>
  )
}

function ThemesContent() {
  const themes = [
    { name: "Aurora", colors: ["#7c3aed", "#ec4899", "#f43f5e"] },
    { name: "Ocean", colors: ["#0ea5e9", "#06b6d4", "#0d9488"] },
    { name: "Sunset", colors: ["#f97316", "#ef4444", "#ec4899"] },
    { name: "Forest", colors: ["#22c55e", "#15803d", "#064e3b"] },
    { name: "Midnight", colors: ["#1e1b4b", "#312e81", "#4c1d95"] },
    { name: "Rose", colors: ["#e11d48", "#f43f5e", "#fb7185"] },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-white text-2xl font-bold tracking-tight">Themes</h2>
        <p className="text-white/35 text-sm mt-1">Choose a color theme for your workspace.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {themes.map((theme) => (
          <button key={theme.name} className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-4 hover:bg-white/[0.08] hover:border-white/15 transition-all text-left group">
            <div className="flex gap-1.5 mb-3">
              {theme.colors.map((color, i) => (
                <div key={i} className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </div>
            <span className="text-white text-sm font-medium group-hover:text-purple-400 transition-colors">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function formatTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}

function StatsContent({ stats }: { stats: PomodoroStats }) {
  // Build last-7-day bar data
  const last7: { label: string; minutes: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const log = stats.dailyLogs.find((l) => l.date === dateStr)
    last7.push({
      label: d.toLocaleDateString("en", { weekday: "short" }),
      minutes: log?.focusMinutes ?? 0,
    })
  }
  const maxMinutes = Math.max(...last7.map((d) => d.minutes), 1)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-white text-2xl font-bold tracking-tight">Stats</h2>
        <p className="text-white/35 text-sm mt-1">Track your focus habits over time.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <p className="text-white/45 text-xs font-medium">Today</p>
          </div>
          <p className="text-white text-2xl font-bold tabular-nums">{formatTime(stats.todayFocusMinutes)}</p>
          <p className="text-white/25 text-xs mt-1">{stats.todaySessions} {stats.todaySessions === 1 ? "session" : "sessions"} completed</p>
        </div>
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <p className="text-white/45 text-xs font-medium">This Week</p>
          </div>
          <p className="text-white text-2xl font-bold tabular-nums">{formatTime(stats.weekFocusMinutes)}</p>
          <p className="text-white/25 text-xs mt-1">{stats.weekSessions} {stats.weekSessions === 1 ? "session" : "sessions"} completed</p>
        </div>
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <p className="text-white/45 text-xs font-medium">Current Streak</p>
          </div>
          <p className="text-white text-2xl font-bold tabular-nums">{stats.currentStreak} <span className="text-sm font-normal text-white/30">{stats.currentStreak === 1 ? "day" : "days"}</span></p>
          <p className="text-white/25 text-xs mt-1">Best: {stats.bestStreak} {stats.bestStreak === 1 ? "day" : "days"}</p>
        </div>
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-400" />
            <p className="text-white/45 text-xs font-medium">All Time</p>
          </div>
          <p className="text-white text-2xl font-bold tabular-nums">{formatTime(stats.totalFocusMinutes)}</p>
          <p className="text-white/25 text-xs mt-1">{stats.totalSessions} total {stats.totalSessions === 1 ? "session" : "sessions"}</p>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <h3 className="text-white text-sm font-semibold">Last 7 Days</h3>
        </div>
        <div className="flex items-end justify-between gap-2 h-32">
          {last7.map((day, i) => {
            const height = day.minutes > 0 ? Math.max((day.minutes / maxMinutes) * 100, 8) : 4
            const isToday = i === 6
            return (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex flex-col items-center justify-end h-24">
                  {day.minutes > 0 && (
                    <span className="text-[10px] text-white/40 tabular-nums mb-1">{day.minutes}m</span>
                  )}
                  <div
                    className={`w-full max-w-[32px] rounded-md transition-all duration-300 ${
                      isToday ? "bg-purple-500" : day.minutes > 0 ? "bg-purple-500/40" : "bg-white/[0.06]"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className={`text-[10px] font-medium ${isToday ? "text-purple-400" : "text-white/30"}`}>
                  {day.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent sessions */}
      {stats.dailyLogs.length > 0 && (
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-5">
          <h3 className="text-white text-sm font-semibold mb-3">Recent Activity</h3>
          <div className="flex flex-col gap-2">
            {[...stats.dailyLogs].reverse().slice(0, 7).map((log, i) => {
              const d = new Date(log.date + "T00:00:00")
              const label = d.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })
              return (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                  <span className="text-white/50 text-xs">{label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white/30 text-xs">{log.sessions} {log.sessions === 1 ? "session" : "sessions"}</span>
                    <span className="text-white text-xs font-semibold tabular-nums">{formatTime(log.focusMinutes)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function QuotesContent() {
  const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Deep work is the ability to focus without distraction on a cognitively demanding task.", author: "Cal Newport" },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-white text-2xl font-bold tracking-tight">Quotes</h2>
        <p className="text-white/35 text-sm mt-1">Motivational quotes to keep you going.</p>
      </div>
      <div className="flex flex-col gap-3">
        {quotes.map((q, i) => (
          <div key={i} className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-4">
            <p className="text-white/80 text-sm italic leading-relaxed">&ldquo;{q.text}&rdquo;</p>
            <p className="text-purple-400/60 text-xs mt-2 font-medium">&mdash; {q.author}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExtrasContent() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-white text-2xl font-bold tracking-tight">Extras</h2>
        <p className="text-white/35 text-sm mt-1">Additional tools and features.</p>
      </div>
      <div className="flex flex-col gap-3">
        {[
          { title: "Keyboard Shortcuts", desc: "Space to start/pause, R to reset, S to skip" },
          { title: "Ambient Sounds", desc: "Play background nature sounds while focusing" },
          { title: "Focus Mode", desc: "Hide all widgets and distractions from the screen" },
        ].map((item) => (
          <div key={item.title} className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-4">
            <p className="text-white text-sm font-medium">{item.title}</p>
            <p className="text-white/35 text-xs mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SupportContent() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-white text-2xl font-bold tracking-tight">Support</h2>
        <p className="text-white/35 text-sm mt-1">Need help? We&apos;re here for you.</p>
      </div>
      <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-5">
        <p className="text-white/60 text-sm leading-relaxed">
          Flowdoro is a free, open-source Pomodoro timer designed for deep focus sessions.
          If you run into any issues or have feedback, feel free to reach out.
        </p>
        <div className="flex flex-col gap-2 mt-4">
          <div className="text-white/35 text-xs">
            <span className="text-white/50 font-medium">Version:</span> 1.0.0
          </div>
          <div className="text-white/35 text-xs">
            <span className="text-white/50 font-medium">Built with:</span> Next.js, Tailwind CSS, Lucide
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main settings panel ─── */

export function SettingsPanel({ settings, onSettingsChange, onClose, stats }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("timer")

  return (
    <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
      {/* Transparent left area -- click to close */}
      <div className="hidden md:block md:w-[45%] lg:w-[50%] shrink-0 cursor-pointer" onClick={onClose} />

      {/* Right panel area: nav + content */}
      <div className="flex flex-1 min-w-0">
        {/* Semi-transparent dark overlay behind the right panel */}
        <div className="absolute inset-0 md:left-[45%] lg:left-[50%] bg-[rgba(6,2,16,0.88)] backdrop-blur-xl" />

        {/* Navigation sidebar */}
        <nav className="relative z-10 w-52 shrink-0 flex flex-col py-8 px-5 border-r border-white/[0.06] animate-in slide-in-from-left-4 duration-300">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white/70 transition-colors mb-8 self-start"
            aria-label="Close settings"
          >
            <X className="w-4.5 h-4.5" />
          </button>

          <div className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                    isActive
                      ? "bg-purple-500/15 text-purple-400"
                      : "text-white/45 hover:text-white/75 hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Content area */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 md:p-8 animate-in slide-in-from-right-4 duration-300 settings-scroll">
          {activeTab === "timer" && <TimerSettings settings={settings} onSettingsChange={onSettingsChange} />}
          {activeTab === "themes" && <ThemesContent />}
          {activeTab === "stats" && <StatsContent stats={stats} />}
          {activeTab === "quotes" && <QuotesContent />}
          {activeTab === "extras" && <ExtrasContent />}
          {activeTab === "support" && <SupportContent />}
        </div>
      </div>
    </div>
  )
}
