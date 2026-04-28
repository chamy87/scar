import { useEffect, useMemo, useState } from "react"
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { createReading, deleteReading, getReadings, login, logout, updateReading, buildReportSummary } from "@/lib/api"
import { hasSupabaseEnv, supabase } from "@/lib/supabaseClient"
import type { Reading } from "@/types/data"
import { SafetyDisclaimer } from "@/components/common/SafetyDisclaimer"
import { Button } from "@/components/ui/button"
import { Activity, Droplets, HeartPulse, LogIn, LogOut } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const links = ["/dashboard", "/readings", "/sessions", "/reports", "/settings"]

function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-bg-clinical text-text-main">{children}</div>
}
function Sidebar() {
  return (
    <aside className="no-print w-52 border-r border-border-soft bg-white p-4">
      <h1 className="mb-6 text-lg font-semibold text-scarlet-deep">OxyG Pediatric Tracker</h1>
      <nav className="space-y-2">{links.map((l) => <Link key={l} to={l} className="block rounded-md px-3 py-2 hover:bg-scarlet-soft">{l.replace("/", "")}</Link>)}</nav>
    </aside>
  )
}
function AuthStatus({ authed }: { authed: boolean }) {
  return <span className="text-sm text-text-muted">{authed ? "Authenticated" : "Public Read-Only"}</span>
}
function TopNav({ authed, onLogin, onLogout }: { authed: boolean; onLogin: () => void; onLogout: () => void }) {
  return <header className="no-print flex items-center justify-between border-b border-border-soft bg-white px-6 py-3"><AuthStatus authed={authed} />{authed ? <Button onClick={onLogout}><LogOut className="mr-2 inline size-4" />Logout</Button> : <Button onClick={onLogin}><LogIn className="mr-2 inline size-4" />Login</Button>}</header>
}
function DashboardHeader() { return <h2 className="text-2xl font-semibold text-scarlet-deep">Clinical Trend Dashboard</h2> }
function StatusBadge({ label }: { label: string }) { return <span className="rounded-full bg-scarlet-soft px-3 py-1 text-xs font-medium text-scarlet-deep">{label}</span> }
function MetricCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) { return <div className="rounded-md border border-border-soft bg-white p-4"><div className="mb-2 flex items-center justify-between text-sm text-text-muted">{title}{icon}</div><div className="text-2xl font-semibold">{value}</div></div> }
function TrendChart({ data }: { data: Reading[] }) {
  const chart = [...data].reverse().map((r) => ({ t: new Date(r.recorded_at).toLocaleDateString(), spo2: r.spo2, bpm: r.bpm, pi: r.pi ?? 0 }))
  return <div className="h-72 rounded-md border border-border-soft bg-white p-4"><ResponsiveContainer width="100%" height="100%"><LineChart data={chart}><XAxis dataKey="t" /><YAxis /><Tooltip /><Line dataKey="spo2" stroke="#b91c1c" /><Line dataKey="bpm" stroke="#e11d48" /><Line dataKey="pi" stroke="#7f1d1d" /></LineChart></ResponsiveContainer></div>
}
function ReadingsTable({ readings, authed, onEdit, onDelete }: { readings: Reading[]; authed: boolean; onEdit: (r: Reading) => void; onDelete: (id: string) => void }) {
  return <table className="w-full rounded-md border border-border-soft bg-white text-sm"><thead><tr className="bg-scarlet-soft text-left"><th className="p-2">Time</th><th>SpO2</th><th>BPM</th><th>PI</th><th className="no-print">Actions</th></tr></thead><tbody>{readings.map((r) => <tr key={r.id} className="border-t border-border-soft"><td className="p-2">{new Date(r.recorded_at).toLocaleString()}</td><td>{r.spo2}</td><td>{r.bpm}</td><td>{r.pi ?? "-"}</td><td className="no-print">{authed && <div className="flex gap-2"><Button className="bg-accent-rose" onClick={() => onEdit(r)}>Edit</Button><Button className="bg-scarlet-deep" onClick={() => onDelete(r.id)}>Delete</Button></div>}</td></tr>)}</tbody></table>
}
function ReadingFormModal({ open, onClose, onSave, initial }: { open: boolean; onClose: () => void; onSave: (r: Omit<Reading, "id" | "created_by">) => void; initial?: Reading | null }) {
  const [spo2, setSpo2] = useState(initial?.spo2 ?? 92); const [bpm, setBpm] = useState(initial?.bpm ?? 120); const [pi, setPi] = useState(initial?.pi ?? 4.1)
  if (!open) return null
  return <div className="fixed inset-0 z-20 bg-black/30 p-6"><div className="mx-auto max-w-md rounded-md bg-white p-4"><h3 className="mb-3 text-lg font-semibold">{initial ? "Edit Reading" : "Add Reading"}</h3><div className="space-y-2"><input className="w-full rounded border border-border-soft p-2" type="number" value={spo2} onChange={(e) => setSpo2(Number(e.target.value))} /><input className="w-full rounded border border-border-soft p-2" type="number" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} /><input className="w-full rounded border border-border-soft p-2" type="number" step="0.1" value={pi ?? 0} onChange={(e) => setPi(Number(e.target.value))} /></div><div className="mt-4 flex justify-end gap-2"><Button className="bg-gray-500" onClick={onClose}>Cancel</Button><Button onClick={() => onSave({ patient_id: "00000000-0000-0000-0000-000000000001", device_id: null, spo2, bpm, pi, recorded_at: new Date().toISOString() })}>Save</Button></div></div></div>
}
function SessionsTable() { return <div className="rounded-md border border-border-soft bg-white p-4 text-sm text-text-muted">Continuous sessions are listed from `continuous_sessions`.</div> }
function ReportBuilder({ start, end, setStart, setEnd, onRun }: { start: string; end: string; setStart: (v: string) => void; setEnd: (v: string) => void; onRun: () => void }) {
  return <div className="no-print flex items-end gap-2 rounded-md border border-border-soft bg-white p-4"><label className="text-sm">Start<input type="date" className="ml-2 rounded border border-border-soft p-2" value={start} onChange={(e) => setStart(e.target.value)} /></label><label className="text-sm">End<input type="date" className="ml-2 rounded border border-border-soft p-2" value={end} onChange={(e) => setEnd(e.target.value)} /></label><Button onClick={onRun}>Run Report</Button><Button onClick={() => window.print()} className="bg-scarlet-deep">Print</Button></div>
}
function ReportSummary({ readings }: { readings: Reading[] }) {
  const s = buildReportSummary(readings)
  return <div className="grid grid-cols-2 gap-3 rounded-md border border-border-soft bg-white p-4 text-sm md:grid-cols-4"><div>Avg SpO2: <b>{s.averageSpo2.toFixed(1)}</b></div><div>Low SpO2: <b>{s.minSpo2}</b></div><div>High SpO2: <b>{s.maxSpo2}</b></div><div>Avg BPM: <b>{s.averageBpm.toFixed(1)}</b></div><div>Low BPM: <b>{s.minBpm}</b></div><div>High BPM: <b>{s.maxBpm}</b></div><div>Readings: <b>{s.count}</b></div><div>Threshold Flags: <b>{s.thresholdFlags}</b></div></div>
}
function LoginForm() { const [e, setE] = useState(""); const [p, setP] = useState(""); return <div className="mx-auto mt-16 max-w-sm rounded-md border border-border-soft bg-white p-6"><h2 className="mb-3 text-xl font-semibold">Login</h2><input className="mb-2 w-full rounded border border-border-soft p-2" placeholder="Email" value={e} onChange={(x) => setE(x.target.value)} /><input className="mb-3 w-full rounded border border-border-soft p-2" type="password" placeholder="Password" value={p} onChange={(x) => setP(x.target.value)} /><Button className="w-full" onClick={() => login(e, p)}>Sign In</Button></div> }

export function App() {
  const navigate = useNavigate()
  const [readings, setReadings] = useState<Reading[]>([])
  const [filtered, setFiltered] = useState<Reading[]>([])
  const [dataError, setDataError] = useState<string>("")
  const [authed, setAuthed] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Reading | null>(null)
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const fetchAll = async () => {
    try {
      const data = await getReadings()
      setReadings(data)
      setFiltered(data)
      setDataError("")
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Failed to load readings")
    }
  }
  useEffect(() => {
    fetchAll()
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session))
    const { data: s } = supabase.auth.onAuthStateChange((_e, session) => setAuthed(!!session))
    return () => s.subscription.unsubscribe()
  }, [])
  const avg = useMemo(() => buildReportSummary(filtered), [filtered])
  return <AppShell><div className="flex"><Sidebar /><main className="flex-1"><TopNav authed={authed} onLogin={() => navigate("/login")} onLogout={() => logout()} /><div className="space-y-4 p-6"><SafetyDisclaimer />{!hasSupabaseEnv && <div className="rounded-md border border-accent-rose bg-white p-3 text-sm text-accent-rose">Missing Supabase environment variables. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.</div>}{dataError && <div className="rounded-md border border-accent-rose bg-white p-3 text-sm text-accent-rose">Database setup issue: {dataError}. Run the SQL in <code>supabase/migration.sql</code> then <code>supabase/seed.sql</code>.</div>}<Routes>
    <Route path="/" element={<Navigate to="/dashboard" />} />
    <Route path="/dashboard" element={<><DashboardHeader /><div className="grid gap-3 md:grid-cols-4"><MetricCard title="Avg SpO2" value={avg.averageSpo2.toFixed(1)} icon={<Droplets className="size-4" />} /><MetricCard title="Avg BPM" value={avg.averageBpm.toFixed(1)} icon={<HeartPulse className="size-4" />} /><MetricCard title="Readings" value={`${avg.count}`} icon={<Activity className="size-4" />} /><MetricCard title="Flags" value={`${avg.thresholdFlags}`} icon={<StatusBadge label="Review" />} /></div><TrendChart data={filtered} /></>} />
    <Route path="/readings" element={<><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Readings</h2>{authed && <Button onClick={() => { setEditing(null); setModalOpen(true) }}>Add Reading</Button>}</div><ReadingsTable readings={readings} authed={authed} onEdit={(r) => { setEditing(r); setModalOpen(true) }} onDelete={async (id) => { try { await deleteReading(id); await fetchAll() } catch (error) { setDataError(error instanceof Error ? error.message : "Delete failed") } }} /><ReadingFormModal open={modalOpen} onClose={() => setModalOpen(false)} initial={editing} onSave={async (payload) => { try { if (editing) await updateReading(editing.id, payload); else await createReading(payload); setModalOpen(false); await fetchAll() } catch (error) { setDataError(error instanceof Error ? error.message : "Save failed") } }} /></>} />
    <Route path="/sessions" element={<SessionsTable />} />
    <Route path="/reports" element={<><ReportBuilder start={start} end={end} setStart={setStart} setEnd={setEnd} onRun={async () => { try { const data = await getReadings(start || undefined, end || undefined); setFiltered(data); setDataError("") } catch (error) { setDataError(error instanceof Error ? error.message : "Report query failed") } }} /><ReportSummary readings={filtered} /><TrendChart data={filtered} /></>} />
    <Route path="/login" element={<LoginForm />} />
    <Route path="/settings" element={<div className="rounded-md border border-border-soft bg-white p-4 text-text-muted">Settings for thresholds and profile metadata.</div>} />
  </Routes></div></main></div></AppShell>
}
