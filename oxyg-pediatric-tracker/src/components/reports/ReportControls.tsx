import { subDays } from "date-fns"
import { Button } from "@/components/ui/button"
import type { Patient } from "@/types/data"

export function ReportControls({
  patients,
  selectedPatientId,
  onPatientChange,
  start,
  end,
  setStart,
  setEnd,
  onGenerate,
  onDownload,
}: {
  patients: Patient[]
  selectedPatientId: string
  onPatientChange: (v: string) => void
  start: string
  end: string
  setStart: (v: string) => void
  setEnd: (v: string) => void
  onGenerate: () => Promise<void>
  onDownload: () => Promise<void>
}) {
  const setQuick = (days: number) => {
    const now = new Date()
    const from = subDays(now, days)
    setStart(from.toISOString().slice(0, 16))
    setEnd(now.toISOString().slice(0, 16))
  }
  return (
    <div className="no-print rounded-2xl border border-border-soft bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">Cardiology Report Builder</h2>
      <div className="grid gap-2 md:grid-cols-5">
        <select className="rounded-xl border border-border-soft p-2 text-sm" value={selectedPatientId} onChange={(e) => onPatientChange(e.target.value)}>
          {patients.map((p) => <option key={p.id} value={p.id}>{p.display_name}</option>)}
        </select>
        <input className="rounded-xl border border-border-soft p-2 text-sm" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
        <input className="rounded-xl border border-border-soft p-2 text-sm" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
        <Button onClick={onGenerate}>Generate Report</Button>
        <div className="flex gap-2">
          <Button className="bg-scarlet-deep" onClick={onDownload}>Download PDF</Button>
          <Button className="bg-gray-700" onClick={() => window.print()}>Print</Button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <button className="rounded-full bg-scarlet-soft px-3 py-1" onClick={() => setQuick(1)}>Last 24 hours</button>
        <button className="rounded-full bg-scarlet-soft px-3 py-1" onClick={() => setQuick(7)}>Last 7 days</button>
        <button className="rounded-full bg-scarlet-soft px-3 py-1" onClick={() => setQuick(30)}>Last 30 days</button>
        <span className="rounded-full bg-gray-100 px-3 py-1">Custom range</span>
      </div>
    </div>
  )
}
