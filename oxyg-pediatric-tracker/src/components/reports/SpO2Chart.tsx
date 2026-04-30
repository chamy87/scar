import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { Threshold } from "@/types/data"

type SpO2ChartRow = {
  t: string
  spo2Avg: number
  spo2Min: number
  spo2Max: number
  spo2Range: [number, number]
  timeWindow: string
  kind: "single" | "range" | "continuous_sample"
}

function SpO2Tooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: SpO2ChartRow }>; label?: string }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-lg border border-[#F3D4D4] bg-white p-3 text-xs text-[#111827] shadow-sm">
      <p className="font-semibold">{label}</p>
      <p>Avg: {p.spo2Avg.toFixed(1)}%</p>
      <p>Min: {p.spo2Min.toFixed(1)}%</p>
      <p>Max: {p.spo2Max.toFixed(1)}%</p>
      <p>{p.kind === "range" ? "Range reading" : "Single reading"}</p>
      <p className="text-[#6B7280]">{p.timeWindow}</p>
    </div>
  )
}

export function SpO2Chart({ data, threshold }: { data: SpO2ChartRow[]; threshold: Threshold | null }) {
  const minSpo2 = Math.max(70, Math.floor(Math.min(...data.map((d) => d.spo2Min)) - 3))
  const maxSpo2 = Math.min(100, Math.ceil(Math.max(...data.map((d) => d.spo2Max)) + 3))

  return (
    <div className="report-chart-height min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#F3D4D4" strokeDasharray="3 3" />
          <XAxis dataKey="t" tick={{ fill: "#6B7280", fontSize: 11 }} minTickGap={20} />
          <YAxis domain={[minSpo2, maxSpo2]} tick={{ fill: "#6B7280", fontSize: 11 }} />
          <Tooltip content={<SpO2Tooltip />} cursor={{ stroke: "#B91C1C", strokeWidth: 1, strokeDasharray: "3 3" }} />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "12px" }} />
          {threshold?.low_spo2_threshold != null && (
            <ReferenceLine y={threshold.low_spo2_threshold} stroke="#F59E0B" strokeDasharray="4 4" name="Low Threshold" />
          )}
          <Area
            type="monotone"
            dataKey="spo2Range"
            stroke="none"
            fill="rgba(220, 38, 38, 0.15)"
            name="SpO₂ Range"
          />
          <Line
            type="monotone"
            dataKey="spo2Avg"
            stroke="#DC2626"
            strokeWidth={2}
            name="SpO₂ Avg"
            dot={(props) => {
              const isRange = props.payload?.kind === "range"
              return (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={isRange ? 5 : 4}
                  fill={isRange ? "#ffffff" : "#DC2626"}
                  stroke="#DC2626"
                  strokeWidth={isRange ? 2 : 1}
                />
              )
            }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export type { SpO2ChartRow }
