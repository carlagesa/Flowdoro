"use client"

import { useEffect, useState } from "react"

const messages = {
  morning: [
    "Good morning. Time to focus.",
    "Rise and grind. Let's do this.",
    "A fresh start to a productive day.",
  ],
  afternoon: [
    "Good afternoon. Stay sharp.",
    "Keep the momentum going.",
    "Halfway through the day. Push forward.",
  ],
  evening: [
    "Good evening. Finish strong.",
    "Wind down with one more session.",
    "Evening focus. You've got this.",
  ],
  night: [
    "Late night session. Stay focused.",
    "Burning the midnight oil.",
    "The world is quiet. Time to create.",
  ],
}

function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return "morning"
  if (hour >= 12 && hour < 17) return "afternoon"
  if (hour >= 17 && hour < 21) return "evening"
  return "night"
}

export function Greeting() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    const timeOfDay = getTimeOfDay()
    const options = messages[timeOfDay]
    setMessage(options[Math.floor(Math.random() * options.length)])
  }, [])

  if (!message) return null

  return (
    <p
      className="text-foreground/70 text-lg md:text-xl font-medium italic text-center text-balance"
      style={{ letterSpacing: "0.01em" }}
    >
      {message}
    </p>
  )
}
