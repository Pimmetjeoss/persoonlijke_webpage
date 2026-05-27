"use client"

import { useState, type ReactNode } from "react"

const DARK = "hsl(144.9 80.4% 10%)"
const GREEN = "hsl(142.1 76.2% 36.3%)"
const LIGHT = "hsl(141 78.9% 85.1%)"

export type Status = "pass" | "fail" | "neutral" | "unableToCheck"

export type AccordionCheck = {
  title: string
  status: Status
  message: string
  /** Optioneel: als dit gevuld is, wordt de rij klikbaar en klapt de aanbeveling uit. */
  recommendation?: ReactNode
}

export type AccordionGroup = { label: string; checks: AccordionCheck[] }

const BADGE: Record<Status, { label: string; bg: string; fg: string }> = {
  fail: { label: "ACTIE NODIG", bg: "#b91c1c", fg: "white" },
  pass: { label: "OK", bg: GREEN, fg: "white" },
  neutral: { label: "N.V.T.", bg: LIGHT, fg: DARK },
  unableToCheck: { label: "NIET TE CHECKEN", bg: "#a16207", fg: "white" },
}

function RowContent({
  check,
  categoryLabel,
  expandable,
  open,
}: {
  check: AccordionCheck
  categoryLabel?: string
  expandable: boolean
  open: boolean
}) {
  const badge = BADGE[check.status]
  return (
    <>
      <span
        className="shrink-0 text-[10px] font-bold px-2 py-1 rounded tracking-widest mt-1"
        style={{ backgroundColor: badge.bg, color: badge.fg }}
      >
        {badge.label}
      </span>
      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <h3
            className="text-lg md:text-xl font-bold"
            style={{ color: DARK, fontFamily: "var(--font-fjalla-one)" }}
          >
            {check.title}
          </h3>
          {categoryLabel && (
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {categoryLabel}
            </span>
          )}
        </div>
        {check.message && (
          <p className="text-sm text-gray-600 mt-1">{check.message}</p>
        )}
        {expandable && !open && (
          <p
            className="text-xs font-semibold uppercase tracking-wide mt-1"
            style={{ color: GREEN }}
          >
            Bekijk bevindingen
          </p>
        )}
      </div>
      {expandable && (
        <span
          className="shrink-0 mt-1 text-xl leading-none transition-transform duration-200"
          style={{
            color: GREEN,
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
          }}
          aria-hidden
        >
          ›
        </span>
      )}
    </>
  )
}

function Row({
  check,
  categoryLabel,
}: {
  check: AccordionCheck
  categoryLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const expandable = Boolean(check.recommendation)

  return (
    <li className="border-b last:border-b-0" style={{ borderColor: DARK }}>
      {expandable ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="w-full py-4 flex items-start gap-4 text-left cursor-pointer hover:opacity-90 transition-opacity"
        >
          <RowContent
            check={check}
            categoryLabel={categoryLabel}
            expandable
            open={open}
          />
        </button>
      ) : (
        <div className="py-4 flex items-start gap-4">
          <RowContent
            check={check}
            categoryLabel={categoryLabel}
            expandable={false}
            open={false}
          />
        </div>
      )}

      {expandable && (
        <div
          className="grid transition-all duration-300 ease-out"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="pb-4 pl-[4.25rem] pr-2">
              <div
                className="rounded-lg border-[2px] p-4 text-sm leading-relaxed space-y-3"
                style={{ borderColor: DARK, backgroundColor: LIGHT, color: DARK }}
              >
                <p
                  className="uppercase text-[10px] font-bold tracking-widest"
                  style={{ color: GREEN }}
                >
                  Bevindingen & aanbevelingen
                </p>
                {check.recommendation}
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}

export function IssueAccordionGroups({ groups }: { groups: AccordionGroup[] }) {
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.label}>
          <h3
            className="uppercase text-sm font-bold tracking-widest mb-2 pb-2 border-b-2"
            style={{
              color: DARK,
              borderColor: DARK,
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            {group.label}
          </h3>
          <ul className="divide-y" style={{ borderColor: DARK }}>
            {group.checks.map((check) => (
              <Row key={check.title} check={check} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function IssueAccordionList({
  checks,
  categoryLabel,
}: {
  checks: AccordionCheck[]
  categoryLabel: string
}) {
  return (
    <ul className="divide-y" style={{ borderColor: DARK }}>
      {checks.map((check) => (
        <Row key={check.title} check={check} categoryLabel={categoryLabel} />
      ))}
    </ul>
  )
}
