"use client"

import { useState, useEffect } from "react"

interface BackgroundImageProps {
  url: string
}

export function BackgroundImage({ url }: BackgroundImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [currentUrl, setCurrentUrl] = useState("")

  useEffect(() => {
    if (!url) {
      setLoaded(false)
      setCurrentUrl("")
      return
    }

    setLoaded(false)
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setCurrentUrl(url)
      requestAnimationFrame(() => setLoaded(true))
    }
    img.src = url
  }, [url])

  if (!url && !currentUrl) return null

  return (
    <div
      className="fixed inset-0 z-[0] transition-opacity duration-1000 ease-in-out"
      style={{ opacity: loaded ? 1 : 0 }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${currentUrl})` }}
      />
      {/* Dark overlay to keep text readable */}
      <div className="absolute inset-0 bg-black/40" />
      {/* Gradient color tint blending with the photo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(140,20,80,0.3)] via-transparent to-[rgba(60,20,160,0.3)] mix-blend-overlay" />
    </div>
  )
}
