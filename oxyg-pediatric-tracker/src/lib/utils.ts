import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CENTRAL_TZ = "America/Chicago"

const centralPartsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: CENTRAL_TZ,
  hour12: false,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
})

function partsOf(date: Date) {
  const out: Record<string, string> = {}
  for (const part of centralPartsFormatter.formatToParts(date)) {
    if (part.type !== "literal") out[part.type] = part.value
  }
  if (out.hour === "24") out.hour = "00"
  return out
}

// Convert a UTC ISO string into a `YYYY-MM-DDTHH:MM` value suitable for a
// <input type="datetime-local"> displayed as Central Time.
export function toCentralInputValue(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  const p = partsOf(date)
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`
}

// Interpret a `YYYY-MM-DDTHH:MM` string from a datetime-local input as Central
// Time and return the corresponding UTC ISO timestamp.
export function fromCentralInputValue(local: string): string {
  const naive = new Date(`${local}:00Z`).getTime()
  if (Number.isNaN(naive)) return new Date().toISOString()
  const p = partsOf(new Date(naive))
  const asCentral = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour),
    Number(p.minute),
    Number(p.second),
  )
  const offset = asCentral - naive
  return new Date(naive - offset).toISOString()
}

// Current time formatted for a datetime-local input in Central Time.
export function nowCentralInputValue(): string {
  return toCentralInputValue(new Date().toISOString())
}
