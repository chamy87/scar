import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { Activity } from "lucide-react"
import type { Reading } from "@/types/data"

export function formatSpo2Display(reading: Reading) {
  if (reading.is_spo2_range) {
    return `${reading.spo2_min ?? "-"}–${reading.spo2_max ?? "-"}% avg ${reading.spo2_avg ?? "-"}%`
  }
  return `${reading.spo2_avg ?? reading.spo2 ?? "-"}%`
}

export function readingType(reading: Reading) {
  if (reading.is_spo2_range) return "Range reading"
  return "Spot check"
}

export function timeWindow(reading: Reading) {
  if (!reading.measured_start) return "-"
  if (reading.is_spo2_range && reading.measured_end) {
    return `${new Date(reading.measured_start).toLocaleString()} - ${new Date(reading.measured_end).toLocaleString()}`
  }
  return new Date(reading.measured_start).toLocaleString()
}

export function ReadingsTable({
  readings,
  isAuthenticated,
  onEdit,
  onDelete,
}: {
  readings: Reading[]
  isAuthenticated: boolean
  onEdit: (r: Reading) => void
  onDelete: (id: string) => void
}) {
  if (!readings.length) return <EmptyState title="No readings" description="No readings have been captured yet." Icon={Activity} />
  return (
    <table className="w-full rounded-2xl border border-border-soft bg-white text-sm shadow-sm">
      <thead>
        <tr className="bg-scarlet-soft/60 text-left">
          <th className="p-3">SpO₂ Display</th>
          <th>Reading Type</th>
          <th>Time Window</th>
          <th>BPM</th>
          <th>PI</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {readings.map((r) => (
          <tr key={r.id} className="border-t border-border-soft align-top">
            <td className="p-3">{formatSpo2Display(r)}</td>
            <td>{readingType(r)}</td>
            <td>{timeWindow(r)}</td>
            <td>{r.bpm ?? "-"}</td>
            <td>{r.pi ?? "-"}</td>
            <td className="max-w-60 truncate">{r.notes ?? "-"}</td>
            <td>
              {isAuthenticated && (
                <div className="flex gap-2">
                  <Button className="bg-accent-rose" onClick={() => onEdit(r)}>Edit</Button>
                  <Button className="bg-scarlet-deep" onClick={() => onDelete(r.id)}>Delete</Button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
