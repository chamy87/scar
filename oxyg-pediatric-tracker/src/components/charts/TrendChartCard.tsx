import { useMemo, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { Reading } from "@/types/data"
import { EmptyState } from "@/components/shared/EmptyState"
import { LineChartIcon } from "lucide-react"

export function TrendChartCard({ readings, canAdd }: { readings: Reading[]; canAdd: boolean }) {
  const [show, setShow] = useState({ spo2: true, bpm: true, pi: true })
  const chartData = useMemo(() => [...readings].reverse().map((r) => ({ t: new Date(r.recorded_at).toLocaleDateString(), spo2: r.spo2, bpm: r.bpm, pi: r.pi ?? 0 })), [readings])
  if (!readings.length) return <EmptyState title="No readings yet" description={canAdd ? "Add the first reading to begin trend analysis." : "No readings yet. Log in to add the first reading."} Icon={LineChartIcon} />
  return (
    <div className="rounded-2xl border border-border-soft bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold">Oxygen & Heart Rate Trend</h3>
        <div className="flex gap-2 text-xs">
          {[
            ["spo2", "SpO2", "bg-scarlet-soft text-scarlet-deep"],
            ["bpm", "BPM", "bg-rose-100 text-rose-700"],
            ["pi", "PI", "bg-red-50 text-red-700"],
          ].map(([key, label, color]) => (
            <button key={key} onClick={() => setShow((s) => ({ ...s, [key]: !s[key as keyof typeof s] }))} className={`rounded-full px-3 py-1 ${color} ${show[key as keyof typeof show] ? "" : "opacity-40"}`}>{label}</button>
          ))}
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="t" />
            <YAxis />
            <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#F3D4D4" }} />
            {show.spo2 && <Line type="monotone" dataKey="spo2" stroke="#B91C1C" strokeWidth={2} dot={false} />}
            {show.bpm && <Line type="monotone" dataKey="bpm" stroke="#E11D48" strokeWidth={2} dot={false} />}
            {show.pi && <Line type="monotone" dataKey="pi" stroke="#7F1D1D" strokeWidth={2} dot={false} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
