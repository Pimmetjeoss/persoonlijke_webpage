"use client"

import Link from "next/link"

interface NavigationProps {
  onPlayClick?: () => void
}

export function Navigation({ onPlayClick }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="px-4 md:px-8 lg:px-16 py-4">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Left - Logo/Name */}
          <Link
            href="/"
            className="text-xl md:text-2xl lg:text-3xl font-bold px-8 py-3 border-2 rounded-full transition-all"
            style={{
              backgroundColor: 'transparent',
              color: 'hsl(144.9 80.4% 10%)',
              borderColor: 'hsl(144.9 80.4% 10%)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'hsl(142.4 71.8% 29.2%)'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'hsl(144.9 80.4% 10%)'
            }}
          >
            PIMPLIFY
          </Link>

          {/* Right - Navigation buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={onPlayClick}
              className="text-xl md:text-2xl lg:text-3xl font-bold px-8 py-3 border-2 rounded-full transition-all cursor-pointer"
              style={{
                backgroundColor: 'transparent',
                color: 'hsl(144.9 80.4% 10%)',
                borderColor: 'hsl(144.9 80.4% 10%)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(142.4 71.8% 29.2%)'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'hsl(144.9 80.4% 10%)'
              }}
            >
              PLAY
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
