import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { Threshold } from "@/types/data"

type BpmChartRow = {
  t: string
  bpm: number
}

function BpmTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[#F3D4D4] bg-white p-3 text-xs text-[#111827] shadow-sm">
      <p className="font-semibold">{label}</p>
      <p>BPM: {payload[0].value}</p>
    </div>
  )
}

export function BpmChart({ data, threshold }: { data: BpmChartRow[]; threshold: Threshold | null }) {
  return (
    <div className="report-chart-height-bpm min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#F3D4D4" strokeDasharray="3 3" />
          <XAxis dataKey="t" tick={{ fill: "#6B7280", fontSize: 11 }} minTickGap={20} />
          <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} />
          <Tooltip content={<BpmTooltip />} cursor={{ stroke: "#B91C1C", strokeWidth: 1, strokeDasharray: "3 3" }} />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "12px" }} />
          {threshold?.high_bpm_threshold != null && (
            <ReferenceLine y={threshold.high_bpm_threshold} stroke="#1D4ED8" strokeDasharray="4 4" name="High Threshold" />
          )}
          {threshold?.low_bpm_threshold != null && (
            <ReferenceLine y={threshold.low_bpm_threshold} stroke="#1D4ED8" strokeDasharray="4 4" name="Low Threshold" />
          )}
          <Line type="monotone" dataKey="bpm" stroke="#2563EB" strokeWidth={2} name="BPM" dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export type { BpmChartRow }
