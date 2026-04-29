import { format } from "date-fns"
import type { NormalizedReportReading } from "@/utils/reportCalculations"

function csvEscape(value: string) {
  const escaped = value.replace(/"/g, '""')
  return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped
}

export function exportReportCsv({
  patientName,
  reportStart,
  reportEnd,
  rows,
}: {
  patientName: string
  reportStart: string
  reportEnd: string
  rows: NormalizedReportReading[]
}) {
  const headers = [
    "patient_name",
    "diagnosis",
    "report_start",
    "report_end",
    "measured_at",
    "reading_type",
    "time_window_start",
    "time_window_end",
    "spo2_min",
    "spo2_max",
    "spo2_avg",
    "spo2_display",
    "bpm",
    "perfusion_index",
    "signal_quality",
    "status",
    "notes",
  ]
  const lines = [headers.join(",")]
  for (const row of rows) {
    const spo2Display = row.readingKind === "range" ? `${row.spo2Min}-${row.spo2Max}% avg ${row.spo2Avg}%` : `${row.spo2Avg}%`
    const readingType = row.readingKind === "single" ? "Spot check" : row.readingKind === "range" ? "Range reading" : "Continuous sample"
    const values = [
      patientName,
      "",
      reportStart,
      reportEnd,
      row.recordedAtISO,
      readingType,
      row.timeWindowStartISO,
      row.timeWindowEndISO,
      `${row.spo2Min}`,
      `${row.spo2Max}`,
      `${row.spo2Avg}`,
      spo2Display,
      row.bpm == null ? "" : `${row.bpm}`,
      row.perfusionIndex == null ? "" : `${row.perfusionIndex}`,
      row.signalQuality ?? "",
      row.status,
      row.notes ?? "",
    ]
    lines.push(values.map((v) => csvEscape(v)).join(","))
  }
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `scarlett-cardiology-report-data-${format(new Date(), "yyyy-MM-dd")}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
