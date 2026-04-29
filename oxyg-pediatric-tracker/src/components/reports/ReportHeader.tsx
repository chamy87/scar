import { format } from "date-fns"
import { PatientAvatar } from "@/components/patient/PatientAvatar"
import type { Patient } from "@/types/data"

export function ReportHeader({ patient, startISO, endISO }: { patient: Patient | null; startISO: string; endISO: string }) {
  const name = patient?.display_name ?? "Pediatric Patient"
  return (
    <div className="report-block rounded-2xl border border-border-soft bg-white p-4 shadow-sm">
      <h1 className="text-xl font-semibold text-scarlet-deep">Scarlett&apos;s Pediatric Tracker — Cardiology Report</h1>
      <div className="mt-3 flex items-center gap-3">
        <PatientAvatar name={name} photoUrl={patient?.photo_url} />
        <div className="text-sm">
          <p className="font-semibold">{name}</p>
          <p className="text-text-muted">Diagnosis: Tetralogy of Fallot</p>
          <p className="text-text-muted">DOB: {patient?.dob ?? "Unavailable"}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-text-muted">Range: {format(new Date(startISO), "PPP p")} to {format(new Date(endISO), "PPP p")}</p>
      <p className="text-xs text-text-muted">Generated: {format(new Date(), "PPP p")}</p>
    </div>
  )
}
