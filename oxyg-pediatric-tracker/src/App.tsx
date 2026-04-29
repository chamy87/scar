import { useEffect, useMemo, useState } from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { Waves } from "lucide-react"
import { AppShell } from "@/components/layout/AppShell"
import { Header } from "@/components/layout/Header"
import { EmptyState } from "@/components/shared/EmptyState"
import { ReadingFormModal } from "@/components/ReadingFormModal"
import { hasSupabaseEnv } from "@/lib/supabaseClient"
import { useAuth } from "@/context/AuthContext"
import { buildReportSummary, createReading, deleteReading, getPrimaryPatient, getReadings, getSessions, updateReading } from "@/lib/api"
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

export function App() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin, signOut } = useAuth()
  const [readings, setReadings] = useState<Reading[]>([])
  const [reportReadings, setReportReadings] = useState<Reading[]>([])
  const [sessions, setSessions] = useState<ContinuousSession[]>([])
  const [patient, setPatient] = useState<Patient | null>(null)
  const [dataError, setDataError] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Reading | null>(null)
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")

  const refresh = async () => {
    try {
      const [r, p, s] = await Promise.all([getReadings(), getPrimaryPatient(), getSessions()])
      setReadings(r)
      setReportReadings(r)
      setPatient(p)
      setSessions(s)
      setDataError("")
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Failed to load data")
    }
  }

  useEffect(() => { refresh() }, [])
  const latest = readings[0] ?? null
  const summary = useMemo(() => buildReportSummary(reportReadings), [reportReadings])

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
          onLogout={async () => { await signOut(); navigate("/dashboard") }}
          onAddReading={() => { setEditing(null); setModalOpen(true) }}
        />
      }
    >
      <div className="space-y-5">
        {!hasSupabaseEnv && <div className="rounded-2xl border border-accent-rose bg-white p-3 text-sm text-accent-rose">Missing Supabase env vars.</div>}
        {dataError && <div className="rounded-2xl border border-accent-rose bg-white p-3 text-sm text-accent-rose">{dataError}</div>}
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage patient={patient} latest={latest} summary={summary} readings={reportReadings} isAuthenticated={isAuthenticated} isAdmin={isAdmin} onPhotoUpdated={(url) => setPatient((prev) => (prev ? { ...prev, photo_url: url } : prev))} />} />
          <Route path="/readings" element={<ReadingsPage readings={readings} isAuthenticated={isAuthenticated} onEdit={(r) => { setEditing(r); setModalOpen(true) }} onDelete={async (id) => { await deleteReading(id); await refresh() }} />} />
          <Route path="/sessions" element={<SessionsPage sessions={sessions} />} />
          <Route path="/reports" element={<ReportsPage readings={reportReadings} summary={summary} start={start} end={end} setStart={setStart} setEnd={setEnd} onRun={async () => { const data = await getReadings(start || undefined, end || undefined); setReportReadings(data) }} isAuthenticated={isAuthenticated} />} />
          <Route path="/settings" element={<div className="rounded-2xl border border-border-soft bg-white p-4 text-sm text-text-muted shadow-sm">Configure threshold targets and patient profile fields.</div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ReadingFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null) }} initial={editing} onSave={saveReading} />
      </div>
    </AppShell>
  )
}
