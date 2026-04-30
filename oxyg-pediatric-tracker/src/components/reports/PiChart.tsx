import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type PiChartRow = {
  t: string
  pi: number
}

function PiTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[#F3D4D4] bg-white p-3 text-xs text-[#111827] shadow-sm">
      <p className="font-semibold">{label}</p>
      <p>PI: {payload[0].value}</p>
    </div>
  )
}

export function PiChart({ data }: { data: PiChartRow[] }) {
  return (
    <div className="report-chart-height-bpm min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#F3D4D4" strokeDasharray="3 3" />
          <XAxis dataKey="t" tick={{ fill: "#6B7280", fontSize: 11 }} minTickGap={20} />
          <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} />
          <Tooltip content={<PiTooltip />} cursor={{ stroke: "#B91C1C", strokeWidth: 1, strokeDasharray: "3 3" }} />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "12px" }} />
          <Line type="monotone" dataKey="pi" stroke="#059669" strokeWidth={2} name="Perfusion Index" dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export type { PiChartRow }
