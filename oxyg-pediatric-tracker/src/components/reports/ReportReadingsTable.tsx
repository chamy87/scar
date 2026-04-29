import type { NormalizedReportReading } from "@/utils/reportCalculations"

export function ReportReadingsTable({ rows }: { rows: NormalizedReportReading[] }) {
  return (
    <div className="report-section rounded-2xl border border-border-soft bg-white p-4 shadow-sm">
      <h3 className="mb-2 font-semibold">Detailed Readings</h3>
      <div className="overflow-x-auto">
        <table className="report-table">
          <thead>
            <tr className="border-b border-border-soft text-left text-text-muted">
              <th className="p-2">Date/Time</th><th>Reading Type</th><th>Time Window</th><th>SpO₂</th><th>BPM</th><th>PI</th><th>Signal Quality</th><th>Status</th><th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border-soft/70 align-top">
                <td className="p-2">{r.displayTime}</td>
                <td>{r.readingKind === "single" ? "Spot check" : r.readingKind === "range" ? "Range reading" : "Continuous sample"}</td>
                <td>{r.timeWindow}</td>
                <td>{r.readingKind === "range" ? `${r.spo2Min}-${r.spo2Max}% avg ${r.spo2Avg}%` : `${r.spo2Avg}%`}</td>
                <td>{r.bpm ?? "—"}</td>
                <td>{r.perfusionIndex ?? "—"}</td>
                <td>{r.signalQuality ?? "—"}</td>
                <td>{r.status}</td>
                <td className="whitespace-pre-wrap break-words">{r.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
