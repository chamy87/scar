import type { ReturnTypeSummary } from "@/components/reports/types"

export function ReportSummaryCards({ summary }: { summary: ReturnTypeSummary }) {
  const card = "summary-card rounded-xl border border-border-soft bg-white p-3 shadow-sm"
  return (
    <div className="report-section grid gap-2 md:grid-cols-2 xl:grid-cols-4">
      <div className={card}>
        <h3 className="mb-2 font-semibold">SpO₂</h3>
        <p className="text-sm">Avg {summary.spo2.avg.toFixed(1)}%</p>
        <p className="text-sm">Low {summary.spo2.min.toFixed(1)}%</p>
        <p className="text-sm">High {summary.spo2.max.toFixed(1)}%</p>
        <p className="text-sm">Count {summary.spo2.count}</p>
        <p className="text-sm">Range-based {summary.spo2.rangeCount}</p>
      </div>
      <div className={card}>
        <h3 className="mb-2 font-semibold">BPM</h3>
        <p className="text-sm">{summary.bpm.count ? `Avg ${summary.bpm.avg?.toFixed(1)} / Low ${summary.bpm.min} / High ${summary.bpm.max}` : "Not enough data"}</p>
        <p className="text-sm">Count {summary.bpm.count}</p>
      </div>
      <div className={card}>
        <h3 className="mb-2 font-semibold">PI</h3>
        <p className="text-sm">{summary.pi.count ? `Avg ${summary.pi.avg?.toFixed(2)} / Low ${summary.pi.min?.toFixed(2)} / High ${summary.pi.max?.toFixed(2)}` : "Not enough data"}</p>
        <p className="text-sm">Count {summary.pi.count}</p>
      </div>
      <div className={card}>
        <h3 className="mb-2 font-semibold">Threshold Flags</h3>
        <p className="text-sm">Below SpO₂ threshold: {summary.flags.belowSpo2}</p>
        <p className="text-sm">High BPM flags: {summary.flags.highBpm}</p>
        <p className="text-sm">Low BPM flags: {summary.flags.lowBpm}</p>
      </div>
    </div>
  )
}
