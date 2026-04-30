import { useMemo, useState } from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { LineChartIcon, Minus, TrendingDown, TrendingUp } from "lucide-react"
import { EmptyState } from "@/components/shared/EmptyState"
import type { Reading } from "@/types/data"

export function TrendChartCard({ readings, canAdd }: { readings: Reading[]; canAdd: boolean }) {
  const [activeTab, setActiveTab] = useState<"spo2" | "bpm" | "pi">("spo2")
  const chartData = useMemo(
    () =>
      [...readings].reverse().map((r) => ({
        t: new Date(r.measured_start ?? r.recorded_at).toLocaleString(),
        spo2: r.spo2_avg ?? r.spo2 ?? 0,
        bpm: r.bpm ?? null,
        pi: r.pi ?? null,
        min: r.spo2_min ?? r.spo2_avg ?? r.spo2 ?? 0,
        max: r.spo2_max ?? r.spo2_avg ?? r.spo2 ?? 0,
        range: [r.spo2_min ?? r.spo2_avg ?? r.spo2 ?? 0, r.spo2_max ?? r.spo2_avg ?? r.spo2 ?? 0] as [number, number],
        avg: r.spo2_avg ?? r.spo2,
        start: r.measured_start,
        end: r.measured_end,
        isRange: r.is_spo2_range,
      })),
    [readings],
  )

  if (!readings.length) return <EmptyState title="No readings yet" description={canAdd ? "Add the first reading to begin trend analysis." : "No readings yet. Log in to add the first reading."} Icon={LineChartIcon} />

  const spo2Data = chartData
  const bpmData = chartData.filter((d) => d.bpm != null)
  const piData = chartData.filter((d) => d.pi != null)
  const values =
    activeTab === "spo2" ? spo2Data.map((d) => d.spo2) : activeTab === "bpm" ? bpmData.map((d) => d.bpm as number) : piData.map((d) => d.pi as number)
  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null
  const min = values.length ? Math.min(...values) : null
  const max = values.length ? Math.max(...values) : null
  const trendDelta = values.length > 1 ? values[values.length - 1] - values[0] : 0
  const trend =
    trendDelta > 1
      ? { label: "Trending Up", tone: "bg-emerald-100 text-emerald-700", Icon: TrendingUp }
      : trendDelta < -1
        ? { label: "Slight Decline", tone: "bg-red-100 text-red-700", Icon: TrendingDown }
        : { label: "Stable", tone: "bg-gray-100 text-gray-700", Icon: Minus }
  const spo2MinDomain = Math.max(70, Math.floor(Math.min(...spo2Data.map((d) => d.min)) - 3))
  const spo2MaxDomain = Math.min(100, Math.ceil(Math.max(...spo2Data.map((d) => d.max)) + 3))

  return (
    <div className="rounded-2xl border border-border-soft bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-text-main">Oxygen & Heart Rate Trend</h3>
        <div className="inline-flex rounded-xl border border-border-soft bg-scarlet-soft p-1">
          {[
            ["spo2", "SpO₂"],
            ["bpm", "BPM"],
            ["pi", "PI"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key as "spo2" | "bpm" | "pi")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                activeTab === key ? "bg-white text-text-main shadow-sm" : "text-text-muted hover:text-text-main"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${trend.tone}`}>
          <trend.Icon className="h-3.5 w-3.5" />
          {trend.label}
        </span>
        <span className="rounded-full border border-border-soft px-2.5 py-1 text-xs text-text-main">Avg: {avg == null ? "—" : avg.toFixed(1)}</span>
        <span className="rounded-full border border-border-soft px-2.5 py-1 text-xs text-text-main">Min: {min == null ? "—" : min.toFixed(1)}</span>
        <span className="rounded-full border border-border-soft px-2.5 py-1 text-xs text-text-main">Max: {max == null ? "—" : max.toFixed(1)}</span>
        <span className="rounded-full border border-border-soft px-2.5 py-1 text-xs text-text-main">Count: {values.length}</span>
      </div>

      {activeTab === "spo2" && (
        <div className="h-72 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={spo2Data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#F3D4D4" strokeDasharray="3 3" />
              <XAxis dataKey="t" tick={{ fill: "#6B7280", fontSize: 11 }} minTickGap={20} />
              <YAxis domain={[spo2MinDomain, spo2MaxDomain]} tick={{ fill: "#6B7280", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #F3D4D4", borderRadius: 10, boxShadow: "0 4px 14px rgba(17,24,39,0.08)" }}
                cursor={{ stroke: "#B91C1C", strokeWidth: 1, strokeDasharray: "3 3" }}
                formatter={(value, name, item) => {
                  const payload = item.payload as (typeof spo2Data)[number]
                  if (name === "spo2") return [`${payload.avg?.toFixed(1)}%`, "SpO₂ Avg"]
                  if (name === "range") return [`Min ${payload.min.toFixed(1)}% · Max ${payload.max.toFixed(1)}%`, "SpO₂ Range"]
                  return [String(value), String(name)]
                }}
                labelFormatter={(_, items) => {
                  const p = items?.[0]?.payload as (typeof spo2Data)[number] | undefined
                  if (!p) return ""
                  const label = p.isRange ? "Range reading" : "Single reading"
                  const timeWindow = `${new Date(p.start ?? "").toLocaleString()} - ${new Date(p.end ?? p.start ?? "").toLocaleString()}`
                  return `${label} · ${timeWindow}`
                }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "12px" }} />
              <Area type="monotone" dataKey="range" name="SpO₂ Range" stroke="none" fill="rgba(220, 38, 38, 0.15)" />
              <Line
                type="monotone"
                dataKey="spo2"
                name="SpO₂ Avg"
                stroke="#DC2626"
                strokeWidth={2}
                dot={(props) => {
                  const isRange = props.payload?.isRange
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={isRange ? 5 : 4}
                      fill={isRange ? "#fff" : "#DC2626"}
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
      )}

      {activeTab === "bpm" && (
        bpmData.length ? (
          <div className="h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bpmData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#F3D4D4" strokeDasharray="3 3" />
                <XAxis dataKey="t" tick={{ fill: "#6B7280", fontSize: 11 }} minTickGap={20} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #F3D4D4", borderRadius: 10, boxShadow: "0 4px 14px rgba(17,24,39,0.08)" }}
                  cursor={{ stroke: "#B91C1C", strokeWidth: 1, strokeDasharray: "3 3" }}
                  formatter={(value) => [String(value), "BPM"]}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="bpm" stroke="#2563EB" strokeWidth={2} name="BPM" dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : <EmptyState title="No data available for selected range" description="No BPM data available for selected range." Icon={LineChartIcon} />
      )}

      {activeTab === "pi" && (
        piData.length ? (
          <div className="h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={piData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#F3D4D4" strokeDasharray="3 3" />
                <XAxis dataKey="t" tick={{ fill: "#6B7280", fontSize: 11 }} minTickGap={20} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #F3D4D4", borderRadius: 10, boxShadow: "0 4px 14px rgba(17,24,39,0.08)" }}
                  cursor={{ stroke: "#B91C1C", strokeWidth: 1, strokeDasharray: "3 3" }}
                  formatter={(value) => [String(value), "PI"]}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="pi" stroke="#059669" strokeWidth={2} name="Perfusion Index" dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : <EmptyState title="No data available for selected range" description="No PI data available for selected range." Icon={LineChartIcon} />
      )}
    </div>
  )
}
