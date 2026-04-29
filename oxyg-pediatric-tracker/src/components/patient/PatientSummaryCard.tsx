import { CalendarDays, HeartPulse } from "lucide-react"
import { PatientAvatar } from "@/components/patient/PatientAvatar"
import { PatientPhotoUpload } from "@/components/patient/PatientPhotoUpload"
import type { Patient, Reading } from "@/types/data"

function ageFromDob(dob?: string | null) {
  if (!dob) return "DOB not set"
  const birth = new Date(dob)
  const now = new Date()
  const years = now.getFullYear() - birth.getFullYear()
  return `${years} years`
}

export function PatientSummaryCard({
  patient,
  latestReading,
  isAdmin,
  userId,
  onPhotoUpdated,
}: {
  patient: Patient | null
  latestReading: Reading | null
  isAdmin: boolean
  userId?: string
  onPhotoUpdated: (url: string) => void
}) {
  const name = patient?.display_name ?? "Pediatric Patient"
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
              {patient?.dob ?? "DOB unavailable"} • {ageFromDob(patient?.dob)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted">Latest reading</p>
          <p className="text-sm font-semibold">
            {latestReading ? `${latestReading.spo2}% SpO2 · ${latestReading.bpm} BPM · PI ${latestReading.pi ?? "-"}` : "No readings yet"}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            <HeartPulse className="mr-1 inline size-3" />
            {latestReading ? `Updated ${new Date(latestReading.recorded_at).toLocaleString()}` : "Awaiting first reading"}
          </p>
          {isAdmin && patient && userId && (
            <div className="mt-2">
              <PatientPhotoUpload patientId={patient.id} userId={userId} onUploaded={onPhotoUpdated} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
