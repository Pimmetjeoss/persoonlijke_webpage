"use client";

import { useEffect } from "react";

/**
 * De statische pagina zette `html { scroll-behavior: smooth }` (en viel onder
 * prefers-reduced-motion terug op `auto`). Scroll-behavior moet op de
 * scroll-box staan, dus op <html> — dat kan hier niet via de CSS-module zonder
 * het naar de rest van de app te lekken. Daarom zetten we het alleen zolang
 * deze route gemount is, en herstellen we de oude waarde bij unmount.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "smooth";

    return () => {
      root.style.scrollBehavior = previous;
    };
  }, []);

  return null;
}
