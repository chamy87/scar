import { format } from "date-fns"
import { PatientAvatar } from "@/components/patient/PatientAvatar"
import type { Patient } from "@/types/data"

function ageFromDob(dob?: string | null) {
  if (!dob) return "Age unavailable"
  const birth = new Date(dob)
  const now = new Date()
  const days = Math.max(0, Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)))
  if (days < 60) {
    const weeks = Math.max(1, Math.floor(days / 7))
    return `${weeks} week${weeks === 1 ? "" : "s"}`
  }
  if (days < 730) {
    const months = Math.max(1, Math.floor(days / 30.44))
    return `${months} month${months === 1 ? "" : "s"}`
  }
  const years = Math.floor(days / 365.25)
  return `${years} year${years === 1 ? "" : "s"}`
}

export function ReportHeader({ patient, startISO, endISO }: { patient: Patient | null; startISO: string; endISO: string }) {
  const name = patient?.display_name ?? "Pediatric Patient"
  return (
    <div className="report-section rounded-2xl border border-border-soft bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="report-patient-photo">
            <PatientAvatar name={name} photoUrl={patient?.photo_url} />
          </div>
          <div className="text-sm">
            <h1 className="text-lg font-semibold text-scarlet-deep">Scarlett&apos;s Pediatric Tracker — Cardiology Report</h1>
            <p className="font-semibold">{name}</p>
            <p className="text-text-muted">Age: {ageFromDob(patient?.dob)}</p>
          </div>
        </div>
        <div className="text-right text-xs text-text-muted">
          <p>Range: {format(new Date(startISO), "PPP p")}</p>
          <p>to {format(new Date(endISO), "PPP p")}</p>
          <p className="mt-2">Generated: {format(new Date(), "PPP p")}</p>
        </div>
      </div>
    </div>
  )
}
