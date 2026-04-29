import { useEffect, useMemo, useState } from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { Waves } from "lucide-react"
import { AppShell } from "@/components/layout/AppShell"
import { Header } from "@/components/layout/Header"
import { EmptyState } from "@/components/shared/EmptyState"
import { ReadingFormModal } from "@/components/ReadingFormModal"
import { Button } from "@/components/ui/button"
import { PatientAvatar } from "@/components/patient/PatientAvatar"
import { PatientPhotoUpload } from "@/components/patient/PatientPhotoUpload"
import { hasSupabaseEnv } from "@/lib/supabaseClient"
import { useAuth } from "@/context/AuthContext"
import { buildReportSummary, createReading, deleteReading, getPrimaryPatient, getReadings, getSessions, updatePatientProfile, updateReading } from "@/lib/api"
import type { ContinuousSession, Patient, Reading } from "@/types/data"
import { DashboardPage } from "@/pages/DashboardPage"
import { ReadingsPage } from "@/pages/ReadingsPage"
import { ReportsPage } from "@/pages/ReportsPage"
import { LoginPage } from "@/pages/LoginPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import type { ReadingInput } from "@/lib/api"

function SessionsPage({ sessions }: { sessions: ContinuousSession[] }) {
  if (!sessions.length) return <EmptyState title="No sessions" description="No sessions have been captured yet." Icon={Waves} />
  return <table className="w-full rounded-2xl border border-border-soft bg-white text-sm shadow-sm"><thead><tr className="bg-scarlet-soft/60 text-left"><th className="p-3">Started</th><th>Ended</th></tr></thead><tbody>{sessions.map((s) => <tr key={s.id} className="border-t border-border-soft"><td className="p-3">{new Date(s.started_at).toLocaleString()}</td><td>{s.ended_at ? new Date(s.ended_at).toLocaleString() : "-"}</td></tr>)}</tbody></table>
}

function SettingsPage({
  patient,
  isAuthenticated,
  isAdmin,
  onPatientUpdated,
  onPhotoUpdated,
}: {
  patient: Patient | null
  isAuthenticated: boolean
  isAdmin: boolean
  onPatientUpdated: (patch: Partial<Patient>) => void
  onPhotoUpdated: (url: string) => void
}) {
  const name = patient?.display_name ?? "Pediatric Patient"
  const [displayName, setDisplayName] = useState(name)
  const [dob, setDob] = useState(patient?.dob ?? "")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    setDisplayName(name)
    setDob(patient?.dob ?? "")
  }, [name, patient?.dob])

  const saveProfile = async () => {
    if (!patient) return
    setSaving(true)
    setMessage("")
    try {
      await updatePatientProfile(patient.id, { display_name: displayName, dob: dob || null })
      onPatientUpdated({ display_name: displayName, dob: dob || null })
      setMessage("Patient profile updated.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed")
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border-soft bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-semibold">Patient Photo</h3>
        <div className="flex flex-wrap items-center gap-4">
          <PatientAvatar name={name} photoUrl={patient?.photo_url} size="lg" />
          <div className="space-y-2 text-sm">
            <p className="text-text-muted">Visible to everyone in the dashboard header and summary card.</p>
            {isAdmin && patient && <PatientPhotoUpload patientId={patient.id} onUploaded={onPhotoUpdated} />}
            {!isAuthenticated && <p className="text-text-muted">Log in as an admin user to change the photo.</p>}
            {isAuthenticated && !isAdmin && <p className="text-text-muted">Photo changes require admin role.</p>}
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-border-soft bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-semibold">Patient Details</h3>
        {isAdmin ? (
          <div className="grid gap-2 md:grid-cols-3">
            <input className="rounded-xl border border-border-soft p-2 text-sm" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display name" />
            <input className="rounded-xl border border-border-soft p-2 text-sm" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            <Button disabled={saving} onClick={saveProfile}>{saving ? "Saving..." : "Save Details"}</Button>
          </div>
        ) : (
          <p className="text-sm text-text-muted">Only admins can update DOB and profile details.</p>
        )}
        {message && <p className="mt-2 text-sm text-text-muted">{message}</p>}
      </div>
      <div className="rounded-2xl border border-border-soft bg-white p-4 text-sm text-text-muted shadow-sm">Configure threshold targets and patient profile fields.</div>
    </div>
  )
}

export function App() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin, signOut } = useAuth()
  const [readings, setReadings] = useState<Reading[]>([])
  const [sessions, setSessions] = useState<ContinuousSession[]>([])
  const [patient, setPatient] = useState<Patient | null>(null)
  const [dataError, setDataError] = useState("")
  const [dataVersion, setDataVersion] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Reading | null>(null)

  const refresh = async () => {
    try {
      const [r, p, s] = await Promise.all([getReadings(), getPrimaryPatient(), getSessions()])
      setReadings(r)
      setPatient(p)
      setSessions(s)
      setDataError("")
      setDataVersion(Date.now())
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Failed to load data")
    }
  }

  useEffect(() => { refresh() }, [])
  const latest = readings[0] ?? null
  const summary = useMemo(() => buildReportSummary(readings), [readings])

  const saveReading = async (payload: ReadingInput) => {
    try {
      if (editing) {
        await updateReading(editing.id, payload)
      } else if (user?.id) {
        await createReading(payload, user.id)
      }
      setModalOpen(false)
      setEditing(null)
      await refresh()
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Unable to save reading")
    }
  }

  return (
    <AppShell
      header={
        <Header
          patientName={patient?.display_name ?? "Pediatric Patient"}
          photoUrl={patient?.photo_url}
          email={user?.email}
          isAuthenticated={isAuthenticated}
          onLogin={() => navigate("/login", { state: { from: window.location.pathname } })}
          onLogout={async () => {
            try {
              await signOut()
            } catch (error) {
              setDataError(error instanceof Error ? error.message : "Logout failed")
            } finally {
              navigate("/dashboard")
            }
          }}
          onAddReading={() => { setEditing(null); setModalOpen(true) }}
        />
      }
    >
      <div className="space-y-5">
        {!hasSupabaseEnv && <div className="rounded-2xl border border-accent-rose bg-white p-3 text-sm text-accent-rose">Missing Supabase env vars.</div>}
        {dataError && <div className="rounded-2xl border border-accent-rose bg-white p-3 text-sm text-accent-rose">{dataError}</div>}
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage patient={patient} latest={latest} summary={summary} readings={readings} isAuthenticated={isAuthenticated} isAdmin={isAdmin} onPhotoUpdated={(url) => setPatient((prev) => (prev ? { ...prev, photo_url: url } : prev))} />} />
          <Route path="/readings" element={<ReadingsPage readings={readings} isAuthenticated={isAuthenticated} onEdit={(r) => { setEditing(r); setModalOpen(true) }} onDelete={async (id) => { await deleteReading(id); await refresh() }} />} />
          <Route path="/sessions" element={<SessionsPage sessions={sessions} />} />
          <Route path="/reports" element={<ReportsPage dataVersion={dataVersion} />} />
          <Route path="/settings" element={<SettingsPage patient={patient} isAuthenticated={isAuthenticated} isAdmin={isAdmin} onPatientUpdated={(patch) => setPatient((prev) => (prev ? { ...prev, ...patch } : prev))} onPhotoUpdated={(url) => setPatient((prev) => (prev ? { ...prev, photo_url: url } : prev))} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ReadingFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null) }} initial={editing} onSave={saveReading} />
      </div>
    </AppShell>
  )
}
