import { CalendarDays, HeartPulse } from "lucide-react"
import { PatientAvatar } from "@/components/patient/PatientAvatar"
import { PatientPhotoUpload } from "@/components/patient/PatientPhotoUpload"
import type { Patient, Reading } from "@/types/data"

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

export function PatientSummaryCard({
  patient,
  latestReading,
  isAdmin,
  onPhotoUpdated,
}: {
  patient: Patient | null
  latestReading: Reading | null
  isAdmin: boolean
  onPhotoUpdated: (url: string) => void
}) {
  const name = patient?.display_name ?? "Pediatric Patient"
  const spo2Text = latestReading
    ? latestReading.is_spo2_range
      ? `${latestReading.spo2_min ?? "-"}-${latestReading.spo2_max ?? "-"}% avg ${latestReading.spo2_avg ?? "-"}%`
      : `${latestReading.spo2_avg ?? latestReading.spo2 ?? "-"}%`
    : null
  const bpmText = latestReading?.bpm ?? "—"
  const piText = latestReading?.pi ?? "—"
  return (
    <div className="rounded-2xl border border-border-soft bg-gradient-to-r from-white via-white to-scarlet-soft/70 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <PatientAvatar name={name} photoUrl={patient?.photo_url} size="lg" />
          <div>
            <h2 className="text-xl font-semibold">{name}</h2>
            <p className="text-sm text-text-muted">Tetralogy of Fallot</p>
            <p className="mt-1 text-xs text-text-muted">
              <CalendarDays className="mr-1 inline size-3" />
              Age: {ageFromDob(patient?.dob)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted">Latest reading</p>
          <p className="text-sm font-semibold">
            {latestReading ? `${spo2Text} SpO2 · ${bpmText} BPM · PI ${piText}` : "No readings yet"}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            <HeartPulse className="mr-1 inline size-3" />
            {latestReading ? `Updated ${new Date(latestReading.recorded_at).toLocaleString()}` : "Awaiting first reading"}
          </p>
          {isAdmin && patient && (
            <div className="mt-2">
              <PatientPhotoUpload patientId={patient.id} onUploaded={onPhotoUpdated} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
