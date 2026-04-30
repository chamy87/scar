import { useMemo, useState } from "react"
import { EmptyState } from "@/components/shared/EmptyState"
import { LineChartIcon, TrendingDown, TrendingUp, Minus } from "lucide-react"
import type { Threshold } from "@/types/data"
import type { NormalizedReportReading } from "@/utils/reportCalculations"
import { ChartTabs, type ChartTab } from "@/components/reports/ChartTabs"
import { SpO2Chart } from "@/components/reports/SpO2Chart"
import { BpmChart } from "@/components/reports/BpmChart"
import { PiChart } from "@/components/reports/PiChart"

function getTrend(values: number[]) {
  if (values.length < 2) return { label: "Stable", tone: "bg-gray-100 text-gray-700", Icon: Minus }
  const delta = values[values.length - 1] - values[0]
  if (delta > 1) return { label: "Trending Up", tone: "bg-emerald-100 text-emerald-700", Icon: TrendingUp }
  if (delta < -1) return { label: "Slight Decline", tone: "bg-red-100 text-red-700", Icon: TrendingDown }
  return { label: "Stable", tone: "bg-gray-100 text-gray-700", Icon: Minus }
}

export function ReportCharts({ rows, threshold }: { rows: NormalizedReportReading[]; threshold: Threshold | null }) {
  const [activeTab, setActiveTab] = useState<ChartTab>("spo2")
  const spo2Data = useMemo(
    () =>
      rows.map((r) => ({
        t: r.displayTime,
        spo2Avg: r.spo2Avg,
        spo2Min: r.spo2Min,
        spo2Max: r.spo2Max,
        spo2Range: [r.spo2Min, r.spo2Max] as [number, number],
        timeWindow: r.timeWindow,
        kind: r.readingKind,
      })),
    [rows],
  )

  const bpmData = useMemo(() => rows.filter((r) => r.bpm != null).map((r) => ({ t: r.displayTime, bpm: r.bpm as number })), [rows])
  const piData = useMemo(
    () => rows.filter((r) => r.perfusionIndex != null).map((r) => ({ t: r.displayTime, pi: r.perfusionIndex as number })),
    [rows],
  )

  const activeValues =
    activeTab === "spo2" ? spo2Data.map((d) => d.spo2Avg) : activeTab === "bpm" ? bpmData.map((d) => d.bpm) : piData.map((d) => d.pi)

  const trend = getTrend(activeValues)
  const values = activeValues
  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null
  const min = values.length ? Math.min(...values) : null
  const max = values.length ? Math.max(...values) : null
  const count = values.length

  if (!rows.length) {
    return <EmptyState title="No data available for selected range" description="No data available for selected range" Icon={LineChartIcon} />
  }

  const chartCard = "report-chart-card rounded-2xl border border-border-soft bg-white p-4 shadow-sm"

  return (
    <div className={chartCard}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-text-main">Clinical Trends</h3>
        <ChartTabs active={activeTab} onChange={setActiveTab} />
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${trend.tone}`}>
          <trend.Icon className="h-3.5 w-3.5" />
          {trend.label}
        </span>
        <span className="rounded-full border border-border-soft px-2.5 py-1 text-xs text-text-main">Avg: {avg == null ? "—" : avg.toFixed(1)}</span>
        <span className="rounded-full border border-border-soft px-2.5 py-1 text-xs text-text-main">Min: {min == null ? "—" : min.toFixed(1)}</span>
        <span className="rounded-full border border-border-soft px-2.5 py-1 text-xs text-text-main">Max: {max == null ? "—" : max.toFixed(1)}</span>
        <span className="rounded-full border border-border-soft px-2.5 py-1 text-xs text-text-main">Count: {count}</span>
      </div>

      {activeTab === "spo2" && <SpO2Chart data={spo2Data} threshold={threshold} />}
      {activeTab === "bpm" &&
        (bpmData.length ? (
          <BpmChart data={bpmData} threshold={threshold} />
        ) : (
          <EmptyState title="No data available for selected range" description="No BPM data available for selected range." Icon={LineChartIcon} />
        ))}
      {activeTab === "pi" &&
        (piData.length ? (
          <PiChart data={piData} />
        ) : (
          <EmptyState title="No data available for selected range" description="No PI data available for selected range." Icon={LineChartIcon} />
        ))}
    </div>
  )
}
