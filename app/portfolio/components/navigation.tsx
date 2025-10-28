"use client"

import Link from "next/link"

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-16 py-4">
        {/* Left - Logo/Name */}
        <Link href="/" className="text-lg md:text-xl font-bold px-6 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors">
          PIMPLIFY
        </Link>

        {/* Right - Navigation buttons */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm md:text-base px-6 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors">
            PLAY
          </Link>
          <Link href="/portfolio" className="text-sm md:text-base px-6 py-2 border-2 border-black rounded-full bg-black text-white">
            ABOUT
          </Link>
          <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 border-black rounded-full bg-black text-white text-xs md:text-sm font-medium">
            EN
          </button>
        </div>
      </div>
    </nav>
  )
}
