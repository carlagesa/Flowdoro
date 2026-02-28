"use client"

import { useState, useEffect, useCallback } from "react"
import { RefreshCw } from "lucide-react"

interface QuoteData {
  text: string
  author: string
}

const QUOTES: QuoteData[] = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "It is not enough to be busy. The question is: what are we busy about?", author: "Henry David Thoreau" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Do the hard jobs first. The easy jobs will take care of themselves.", author: "Dale Carnegie" },
  { text: "Concentrate all your thoughts upon the work at hand.", author: "Alexander Graham Bell" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { text: "Amateurs sit and wait for inspiration. The rest of us just get up and go to work.", author: "Stephen King" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Productivity is never an accident. It is always the result of commitment to excellence.", author: "Paul J. Meyer" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "Deep work is the ability to focus without distraction on a cognitively demanding task.", author: "Cal Newport" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Work hard in silence, let your success be the noise.", author: "Frank Ocean" },
  { text: "The mind is everything. What you think, you become.", author: "Buddha" },
]

export function MotivationalQuote() {
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const pickQuote = useCallback(() => {
    const idx = Math.floor(Math.random() * QUOTES.length)
    return QUOTES[idx]
  }, [])

  useEffect(() => {
    setQuote(pickQuote())
  }, [pickQuote])

  // Auto-rotate every 45 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setQuote(pickQuote())
        setIsTransitioning(false)
      }, 400)
    }, 45000)
    return () => clearInterval(interval)
  }, [pickQuote])

  const handleRefresh = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setQuote(pickQuote())
      setIsTransitioning(false)
    }, 400)
  }

  if (!quote) return null

  return (
    <div className="flex items-center gap-3 max-w-lg">
      <div
        className={`flex flex-col items-center text-center transition-all duration-400 ${
          isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        <p className="text-foreground/50 text-sm md:text-base leading-relaxed italic text-balance">
          {`"${quote.text}"`}
        </p>
        <span className="text-foreground/30 text-xs mt-1.5 font-medium">
          {"-- "}{quote.author}
        </span>
      </div>
      <button
        onClick={handleRefresh}
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-foreground/20 hover:text-foreground/50 hover:bg-foreground/5 transition-all duration-200"
        aria-label="New quote"
        title="New quote"
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
