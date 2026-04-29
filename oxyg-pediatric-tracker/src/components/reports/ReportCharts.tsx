import { ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar } from "recharts"
import type { Threshold } from "@/types/data"
import type { NormalizedReportReading } from "@/utils/reportCalculations"
import { EmptyState } from "@/components/shared/EmptyState"
import { LineChartIcon } from "lucide-react"

export function ReportCharts({ rows, threshold }: { rows: NormalizedReportReading[]; threshold: Threshold | null }) {
  if (!rows.length) return <EmptyState title="No readings found for this report range." description="No readings found for this report range." Icon={LineChartIcon} />
  const spo2Vals = rows.map((r) => r.spo2Avg)
  const minSpo2 = Math.max(70, Math.floor(Math.min(...spo2Vals) - 3))
  const maxSpo2 = Math.min(100, Math.ceil(Math.max(...spo2Vals) + 3))
  const data = rows.map((r) => ({ t: r.displayTime, spo2: r.spo2Avg, spo2Min: r.spo2Min, spo2Max: r.spo2Max, bpm: r.bpm, pi: r.perfusionIndex, timeWindow: r.timeWindow, kind: r.readingKind }))
  const chartCard = "report-chart-card rounded-2xl border border-border-soft bg-white p-4 shadow-sm"
  return (
    <div className="space-y-3">
      <div className={chartCard}>
        <h3 className="mb-2 font-semibold">SpO₂ Trend</h3>
        <div className="report-chart-height">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <XAxis dataKey="t" hide />
              <YAxis domain={[minSpo2, maxSpo2]} />
              <Tooltip formatter={(v, n, item) => n === "spo2" ? [`avg ${item.payload.spo2}% (min ${item.payload.spo2Min}, max ${item.payload.spo2Max})`, item.payload.kind === "range" ? "Range reading" : "Spot check"] : [v as string, n]} labelFormatter={(_, items) => items?.[0]?.payload?.timeWindow ?? ""} />
              {threshold?.low_spo2_threshold != null && <ReferenceLine y={threshold.low_spo2_threshold} stroke="#B91C1C" strokeDasharray="3 3" />}
              <Line dataKey="spo2" stroke="#B91C1C" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className={chartCard}>
        <h3 className="mb-2 font-semibold">BPM Trend</h3>
        <div className="report-chart-height-bpm">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.filter((d) => d.bpm != null)}>
              <XAxis dataKey="t" hide />
              <YAxis />
              <Tooltip />
              {threshold?.high_bpm_threshold != null && <ReferenceLine y={threshold.high_bpm_threshold} stroke="#E11D48" strokeDasharray="3 3" />}
              {threshold?.low_bpm_threshold != null && <ReferenceLine y={threshold.low_bpm_threshold} stroke="#7F1D1D" strokeDasharray="3 3" />}
              <Line dataKey="bpm" stroke="#E11D48" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className={chartCard}>
        <h3 className="mb-2 font-semibold">PI Trend</h3>
        <div className="report-chart-height-bpm">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.filter((d) => d.pi != null)}>
              <XAxis dataKey="t" hide />
              <YAxis />
              <Tooltip />
              <Line dataKey="pi" stroke="#7F1D1D" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className={chartCard}>
        <h3 className="mb-2 font-semibold">SpO₂ Range Visualization</h3>
        <div className="report-chart-height-range">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <XAxis dataKey="t" hide />
              <YAxis />
              <Tooltip formatter={(v, n, item) => [v as string, n === "spo2" ? (item.payload.kind === "range" ? "Range reading" : "Spot check") : String(n)]} />
              <Bar dataKey="spo2Max" fill="#FEE2E2" />
              <Bar dataKey="spo2Min" fill="#f8b4b4" />
              <Line dataKey="spo2" stroke="#B91C1C" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
