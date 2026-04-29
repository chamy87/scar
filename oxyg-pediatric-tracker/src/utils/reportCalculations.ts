import { format } from "date-fns"
import type { Reading, Threshold } from "@/types/data"

export type NormalizedReportReading = {
  id: string
  readingKind: "single" | "range" | "continuous_sample"
  displayTime: string
  timeWindow: string
  timeWindowStartISO: string
  timeWindowEndISO: string
  spo2Min: number
  spo2Max: number
  spo2Avg: number
  bpm: number | null
  perfusionIndex: number | null
  signalQuality: string | null
  notes: string | null
  status: string
  recordedAtISO: string
}

export function normalizeReadingForReport(reading: Reading, threshold?: Threshold | null): NormalizedReportReading {
  const measuredAt = (reading as unknown as { measured_at?: string }).measured_at ?? reading.measured_start ?? reading.recorded_at
  const start = reading.measured_start ?? measuredAt
  const end = reading.measured_end ?? measuredAt
  const avg = reading.spo2_avg ?? reading.spo2 ?? 0
  const min = reading.spo2_min ?? reading.spo2 ?? avg
  const max = reading.spo2_max ?? reading.spo2 ?? avg
  const readingKind = reading.reading_type === "Continuous sample" ? "continuous_sample" : reading.is_spo2_range ? "range" : "single"
  const status = threshold?.low_spo2_threshold != null && avg < threshold.low_spo2_threshold ? "Below configured threshold" : "Within configured range"
  return {
    id: reading.id,
    readingKind,
    displayTime: format(new Date(measuredAt), "PPP p"),
    timeWindow: `${format(new Date(start), "PPP p")} - ${format(new Date(end), "PPP p")}`,
    timeWindowStartISO: start,
    timeWindowEndISO: end,
    spo2Min: min,
    spo2Max: max,
    spo2Avg: avg,
    bpm: reading.bpm,
    perfusionIndex: reading.pi,
    signalQuality: reading.signal_quality,
    notes: reading.notes,
    status,
    recordedAtISO: measuredAt,
  }
}

export function calculateReportSummary(rows: NormalizedReportReading[], threshold?: Threshold | null) {
  const spo2 = rows.map((r) => r.spo2Avg)
  const bpm = rows.map((r) => r.bpm).filter((v): v is number => v != null)
  const pi = rows.map((r) => r.perfusionIndex).filter((v): v is number => v != null)
  const belowSpo2 = threshold?.low_spo2_threshold == null ? 0 : rows.filter((r) => r.spo2Avg < threshold.low_spo2_threshold!).length
  const highBpm = threshold?.high_bpm_threshold == null ? 0 : bpm.filter((v) => v > threshold.high_bpm_threshold!).length
  const lowBpm = threshold?.low_bpm_threshold == null ? 0 : bpm.filter((v) => v < threshold.low_bpm_threshold!).length
  return {
    spo2: {
      avg: spo2.length ? spo2.reduce((a, b) => a + b, 0) / spo2.length : 0,
      min: spo2.length ? Math.min(...spo2) : 0,
      max: spo2.length ? Math.max(...spo2) : 0,
      count: spo2.length,
      rangeCount: rows.filter((r) => r.readingKind === "range").length,
    },
    bpm: {
      avg: bpm.length ? bpm.reduce((a, b) => a + b, 0) / bpm.length : null,
      min: bpm.length ? Math.min(...bpm) : null,
      max: bpm.length ? Math.max(...bpm) : null,
      count: bpm.length,
    },
    pi: {
      avg: pi.length ? pi.reduce((a, b) => a + b, 0) / pi.length : null,
      min: pi.length ? Math.min(...pi) : null,
      max: pi.length ? Math.max(...pi) : null,
      count: pi.length,
    },
    flags: { belowSpo2, highBpm, lowBpm },
  }
}
