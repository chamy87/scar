import { Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { TrendChartCard } from "@/components/TrendChartCard"
import { ReadingsTable } from "@/components/ReadingsTable"
import type { Reading, ReportSummary } from "@/types/data"

export function ReportsPage({
  readings,
  summary,
  start,
  end,
  setStart,
  setEnd,
  onRun,
  isAuthenticated,
}: {
  readings: Reading[]
  summary: ReportSummary
  start: string
  end: string
  setStart: (v: string) => void
  setEnd: (v: string) => void
  onRun: () => Promise<void>
  isAuthenticated: boolean
}) {
  if (!readings.length) return <EmptyState title="No report data" description="No report data is available for the selected range." Icon={Activity} />
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border-soft bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-end gap-2">
          <label className="text-sm">Start <input type="date" className="ml-2 rounded-lg border border-border-soft p-2" value={start} onChange={(e) => setStart(e.target.value)} /></label>
          <label className="text-sm">End <input type="date" className="ml-2 rounded-lg border border-border-soft p-2" value={end} onChange={(e) => setEnd(e.target.value)} /></label>
          <Button onClick={onRun}>Run Report</Button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
          <div>Avg SpO₂: <b>{summary.averageSpo2.toFixed(1)}</b></div>
          <div>Lowest SpO₂: <b>{summary.minSpo2}</b></div>
          <div>Highest SpO₂: <b>{summary.maxSpo2}</b></div>
          <div>Avg BPM: <b>{summary.averageBpm.toFixed(1)}</b></div>
          <div>Lowest BPM: <b>{summary.minBpm}</b></div>
          <div>Highest BPM: <b>{summary.maxBpm}</b></div>
          <div>Readings: <b>{summary.count}</b></div>
          <div>Flags: <b>{summary.thresholdFlags}</b></div>
        </div>
      </div>
      <TrendChartCard readings={readings} canAdd={isAuthenticated} />
      <ReadingsTable readings={readings} isAuthenticated={false} onEdit={() => undefined} onDelete={() => undefined} />
    </div>
  )
}
