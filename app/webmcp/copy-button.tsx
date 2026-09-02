"use client";

import { useEffect, useRef, useState } from "react";

function ClipboardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="5.5"
        y="5.5"
        width="8"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10.5 3.5v-1a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m3 8.5 3.5 3.5L13 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type CopyButtonProps = {
  /** Precies de tekst die op het klembord belandt. */
  text: string;
  label: string;
  className: string;
  doneClassName: string;
};

/**
 * Vervangt het oude label "Vraag dit": in één klik staat de volledige prompt op
 * het klembord, klaar om in de ChatGPT-desktopapp te plakken. Valt terug op een
 * verborgen textarea + execCommand voor browsers zonder clipboard-API of buiten
 * een secure context.
 */
export function CopyButton({ text, label, className, doneClassName }: CopyButtonProps) {
  const [gekopieerd, setGekopieerd] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function kopieer() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const veld = document.createElement("textarea");
        veld.value = text;
        veld.setAttribute("readonly", "");
        veld.style.position = "fixed";
        veld.style.opacity = "0";
        document.body.appendChild(veld);
        veld.select();
        document.execCommand("copy");
        document.body.removeChild(veld);
      }
    } catch {
      return;
    }

    setGekopieerd(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setGekopieerd(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={kopieer}
      className={gekopieerd ? `${className} ${doneClassName}` : className}
    >
      {gekopieerd ? <CheckIcon /> : <ClipboardIcon />}
      <span aria-live="polite">{gekopieerd ? "Gekopieerd" : label}</span>
    </button>
  );
}
