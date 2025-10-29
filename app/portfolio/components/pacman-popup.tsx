"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

interface PacmanPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function PacmanPopup({ isOpen, onClose }: PacmanPopupProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameInitialized = useRef(false)

  useEffect(() => {
    if (!isOpen) {
      gameInitialized.current = false
      return
    }

    // Load game scripts dynamically
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = src
        script.async = true
        script.onload = () => resolve()
        script.onerror = reject
        document.body.appendChild(script)
      })
    }

    const initializeGame = async () => {
      if (gameInitialized.current) return

      try {
        // Load game.js first (engine), then index.js (game logic)
        await loadScript("/static/script/game.js")
        await loadScript("/static/script/index.js")

        gameInitialized.current = true
      } catch (error) {
        console.error("Failed to load Pacman game:", error)
      }
    }

    initializeGame()

    // ESC key to close
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("keydown", handleEscape)

      // Clean up scripts when component unmounts
      const scripts = document.querySelectorAll('script[src*="/static/script/"]')
      scripts.forEach(script => script.remove())
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-black rounded-lg shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold transition-colors shadow-lg z-10"
          aria-label="Close Pacman game"
        >
          ×
        </button>

        {/* Game container */}
        <div className="mod-panel">
          <canvas
            ref={canvasRef}
            id="canvas"
            width="960"
            height="640"
            style={{
              display: "block",
              margin: "0 auto",
              backgroundColor: "#000",
              borderRadius: "12px",
              maxWidth: "100%",
              height: "auto"
            }}
          />
          <div className="info" style={{ paddingTop: "10px", textAlign: "center", color: "#999" }}>
            <p>Press [SPACE] to pause or continue</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
