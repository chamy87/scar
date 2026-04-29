import { useEffect, useMemo, useState } from "react"
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { Activity, AlertTriangle, Droplets, HeartPulse, Waves } from "lucide-react"
import { AppShell } from "@/components/layout/AppShell"
import { Header } from "@/components/layout/Header"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { TrendChartCard } from "@/components/charts/TrendChartCard"
import { SafetyDisclaimer } from "@/components/common/SafetyDisclaimer"
import { PatientSummaryCard } from "@/components/patient/PatientSummaryCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { buildReportSummary, createReading, deleteReading, getPrimaryPatient, getReadings, getSessions, isAdmin, updateReading } from "@/lib/api"
import { hasSupabaseEnv } from "@/lib/supabaseClient"
import type { ContinuousSession, Patient, Reading } from "@/types/data"

function ReadingFormModal({ open, onClose, onSave, initial }: { open: boolean; onClose: () => void; onSave: (r: Omit<Reading, "id" | "created_by">) => void; initial?: Reading | null }) {
  const [spo2, setSpo2] = useState(initial?.spo2 ?? 92)
  const [bpm, setBpm] = useState(initial?.bpm ?? 120)
  const [pi, setPi] = useState(initial?.pi ?? 4.1)
  useEffect(() => { setSpo2(initial?.spo2 ?? 92); setBpm(initial?.bpm ?? 120); setPi(initial?.pi ?? 4.1) }, [initial, open])
  if (!open) return null
  return <div className="fixed inset-0 z-20 bg-black/30 p-4"><div className="mx-auto mt-20 max-w-md rounded-2xl bg-white p-5 shadow-lg"><h3 className="mb-3 text-lg font-semibold">{initial ? "Edit Reading" : "Add Reading"}</h3><div className="space-y-2"><input className="w-full rounded-xl border border-border-soft p-2" type="number" value={spo2} onChange={(e) => setSpo2(Number(e.target.value))} /><input className="w-full rounded-xl border border-border-soft p-2" type="number" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} /><input className="w-full rounded-xl border border-border-soft p-2" type="number" step="0.1" value={pi ?? 0} onChange={(e) => setPi(Number(e.target.value))} /></div><div className="mt-4 flex justify-end gap-2"><Button className="bg-gray-500" onClick={onClose}>Cancel</Button><Button onClick={() => onSave({ patient_id: initial?.patient_id ?? "00000000-0000-0000-0000-000000000001", device_id: initial?.device_id ?? null, spo2, bpm, pi, recorded_at: initial?.recorded_at ?? new Date().toISOString() })}>Save</Button></div></div></div>
}

function ReadingsTable({ readings, isAuthenticated, onEdit, onDelete }: { readings: Reading[]; isAuthenticated: boolean; onEdit: (r: Reading) => void; onDelete: (id: string) => void }) {
  if (!readings.length) return <EmptyState title="No readings yet" description="No oxygen readings have been recorded yet." Icon={Activity} />
  return <table className="w-full rounded-2xl border border-border-soft bg-white text-sm shadow-sm"><thead><tr className="bg-scarlet-soft/60 text-left"><th className="p-3">Time</th><th>SpO2</th><th>BPM</th><th>PI</th><th>Actions</th></tr></thead><tbody>{readings.map((r) => <tr key={r.id} className="border-t border-border-soft"><td className="p-3">{new Date(r.recorded_at).toLocaleString()}</td><td>{r.spo2}</td><td>{r.bpm}</td><td>{r.pi ?? "-"}</td><td>{isAuthenticated && <div className="flex gap-2"><Button className="bg-accent-rose" onClick={() => onEdit(r)}>Edit</Button><Button className="bg-scarlet-deep" onClick={() => onDelete(r.id)}>Delete</Button></div>}</td></tr>)}</tbody></table>
}

function SessionsTable({ sessions }: { sessions: ContinuousSession[] }) {
  if (!sessions.length) return <EmptyState title="No sessions available" description="Continuous session records will appear here when collected." Icon={Waves} />
  return <table className="w-full rounded-2xl border border-border-soft bg-white text-sm shadow-sm"><thead><tr className="bg-scarlet-soft/60 text-left"><th className="p-3">Started</th><th>Ended</th></tr></thead><tbody>{sessions.map((s) => <tr key={s.id} className="border-t border-border-soft"><td className="p-3">{new Date(s.started_at).toLocaleString()}</td><td>{s.ended_at ? new Date(s.ended_at).toLocaleString() : "-"}</td></tr>)}</tbody></table>
}

function LoginPage() {
  const { signIn, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const backTo = (location.state as { from?: string } | undefined)?.from ?? "/dashboard"
  useEffect(() => { if (isAuthenticated) navigate(backTo) }, [isAuthenticated, navigate, backTo])
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError("")
    try { await signIn(email, password); navigate(backTo) } catch (err) { setError(err instanceof Error ? err.message : "Unable to login") } finally { setLoading(false) }
  }
  return <div className="mx-auto mt-16 max-w-md rounded-2xl border border-border-soft bg-white p-6 shadow-sm"><h2 className="text-2xl font-semibold text-scarlet-deep">OxyG Pediatric Tracker</h2><p className="mb-4 text-sm text-text-muted">Sign in to manage readings</p><form onSubmit={submit} className="space-y-3"><input className="w-full rounded-xl border border-border-soft p-2" type="email" placeholder="Email" required value={email} onChange={(x) => setEmail(x.target.value)} /><input className="w-full rounded-xl border border-border-soft p-2" type="password" placeholder="Password" required value={password} onChange={(x) => setPassword(x.target.value)} />{error && <p className="text-sm text-accent-rose">{error}</p>}<Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Login"}</Button></form><Link to="/dashboard" className="mt-3 block text-center text-sm text-scarlet-primary">Back to dashboard</Link></div>
}

export function App() {
  const navigate = useNavigate()
  const { user, isAuthenticated, signOut } = useAuth()
  const [readings, setReadings] = useState<Reading[]>([])
  const [filtered, setFiltered] = useState<Reading[]>([])
  const [sessions, setSessions] = useState<ContinuousSession[]>([])
  const [patient, setPatient] = useState<Patient | null>(null)
  const [admin, setAdmin] = useState(false)
  const [dataError, setDataError] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Reading | null>(null)
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")

  const refresh = async () => {
    try {
      const [r, p, s] = await Promise.all([getReadings(), getPrimaryPatient(), getSessions()])
      setReadings(r); setFiltered(r); setPatient(p); setSessions(s); setDataError("")
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Failed to load data")
    }
  }

  useEffect(() => { refresh() }, [])
  useEffect(() => { if (user?.id) isAdmin(user.id).then(setAdmin); else setAdmin(false) }, [user?.id])
  const summary = useMemo(() => buildReportSummary(filtered), [filtered])
  const latest = readings[0] ?? null

  const header = (
    <Header
      patientName={patient?.display_name ?? "Pediatric Patient"}
      photoUrl={patient?.photo_url}
      email={user?.email}
      isAuthenticated={isAuthenticated}
      onLogin={() => navigate("/login", { state: { from: window.location.pathname } })}
      onLogout={async () => { await signOut(); navigate("/dashboard") }}
      onAddReading={() => { setEditing(null); setModalOpen(true) }}
    />
  )

  return (
    <AppShell header={header}>
      <div className="space-y-5">
        {!hasSupabaseEnv && <div className="rounded-2xl border border-accent-rose bg-white p-3 text-sm text-accent-rose">Missing Supabase env vars.</div>}
        {dataError && <div className="rounded-2xl border border-accent-rose bg-white p-3 text-sm text-accent-rose">{dataError}</div>}
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<><PatientSummaryCard patient={patient} latestReading={latest} isAdmin={admin} userId={user?.id} onPhotoUpdated={(url) => setPatient((prev) => prev ? { ...prev, photo_url: url } : prev)} /><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><MetricCard title="Latest SpO₂" value={latest ? `${latest.spo2}%` : "--"} helper="Oxygen saturation" trend={summary.count > 1 ? `${(summary.maxSpo2 - summary.minSpo2).toFixed(0)} range` : "No trend"} Icon={Droplets} /><MetricCard title="Latest BPM" value={latest ? `${latest.bpm}` : "--"} helper="Heart rate" trend={summary.count > 1 ? `${(summary.maxBpm - summary.minBpm).toFixed(0)} range` : "No trend"} Icon={HeartPulse} /><MetricCard title="Latest PI" value={latest ? `${latest.pi ?? "--"}` : "--"} helper="Perfusion index" trend={summary.count > 1 ? "Tracking enabled" : "No trend"} Icon={Activity} /><MetricCard title="Flags" value={`${summary.thresholdFlags}`} helper="Potential threshold events" trend={summary.thresholdFlags ? "Needs review" : "None"} Icon={AlertTriangle} /></div><TrendChartCard readings={filtered} canAdd={isAuthenticated} /><SafetyDisclaimer /></>} />
          <Route path="/readings" element={<><ReadingsTable readings={readings} isAuthenticated={isAuthenticated} onEdit={(r) => { setEditing(r); setModalOpen(true) }} onDelete={async (id) => { await deleteReading(id); await refresh() }} /><ReadingFormModal open={modalOpen} onClose={() => setModalOpen(false)} initial={editing} onSave={async (payload) => { if (editing) await updateReading(editing.id, payload); else if (user?.id) await createReading(payload, user.id); setModalOpen(false); await refresh() }} /></>} />
          <Route path="/sessions" element={<SessionsTable sessions={sessions} />} />
          <Route path="/reports" element={<>{!filtered.length ? <EmptyState title="No report data" description="Select a date range after readings are available." Icon={Activity} /> : <><div className="rounded-2xl border border-border-soft bg-white p-4 shadow-sm"><div className="mb-3 flex flex-wrap items-end gap-2"><label className="text-sm">Start <input type="date" className="ml-2 rounded-lg border border-border-soft p-2" value={start} onChange={(e) => setStart(e.target.value)} /></label><label className="text-sm">End <input type="date" className="ml-2 rounded-lg border border-border-soft p-2" value={end} onChange={(e) => setEnd(e.target.value)} /></label><Button onClick={async () => { const data = await getReadings(start || undefined, end || undefined); setFiltered(data) }}>Run Report</Button></div><div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4"><div>Avg SpO₂: <b>{summary.averageSpo2.toFixed(1)}</b></div><div>Lowest SpO₂: <b>{summary.minSpo2}</b></div><div>Highest SpO₂: <b>{summary.maxSpo2}</b></div><div>Avg BPM: <b>{summary.averageBpm.toFixed(1)}</b></div><div>Lowest BPM: <b>{summary.minBpm}</b></div><div>Highest BPM: <b>{summary.maxBpm}</b></div><div>Readings: <b>{summary.count}</b></div><div>Flags: <b>{summary.thresholdFlags}</b></div></div></div><TrendChartCard readings={filtered} canAdd={isAuthenticated} /></>}</>} />
          <Route path="/settings" element={<div className="rounded-2xl border border-border-soft bg-white p-4 text-sm text-text-muted shadow-sm">Configure threshold targets and patient profile fields.</div>} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </AppShell>
  )
}
