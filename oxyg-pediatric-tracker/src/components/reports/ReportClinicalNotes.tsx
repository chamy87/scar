import type { ReturnTypeSummary } from "@/components/reports/types"
import type { Threshold } from "@/types/data"

export function ReportClinicalNotes({ summary, threshold }: { summary: ReturnTypeSummary; threshold: Threshold | null }) {
  const low = threshold?.low_spo2_threshold
  return (
    <div className="report-block rounded-2xl border border-border-soft bg-white p-4 shadow-sm">
      <h3 className="mb-2 font-semibold">Report Notes for Cardiologist</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-text-main">
        <li>Lowest recorded SpO₂ during this range: {summary.spo2.min.toFixed(1)}%.</li>
        <li>Average SpO₂ across the selected period: {summary.spo2.avg.toFixed(1)}%.</li>
        <li>{summary.flags.belowSpo2} readings were below the configured SpO₂ threshold{low != null ? ` of ${low}%` : ""}.</li>
        <li>BPM data was available for {summary.bpm.count} of {summary.spo2.count} readings.</li>
        <li>PI data was available for {summary.pi.count} of {summary.spo2.count} readings.</li>
        <li>{summary.spo2.rangeCount} readings were entered as SpO₂ ranges over a time window.</li>
      </ul>
    </div>
  )
}
