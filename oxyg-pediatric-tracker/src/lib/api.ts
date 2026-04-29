import { supabase } from "@/lib/supabaseClient"
import type { ContinuousSession, Patient, Reading, ReportSummary, Threshold } from "@/types/data"

export type ReadingInput = {
  patient_id: string
  device_id?: string | null
  spo2: number | null
  spo2_min: number | null
  spo2_max: number | null
  spo2_avg: number
  is_spo2_range: boolean
  reading_type: string
  measured_start: string
  measured_end: string
  measured_at?: string
  bpm?: number | null
  pi?: number | null
  signal_quality?: string | null
  notes?: string | null
  waveform?: string | null
  recorded_at: string
}

export async function getReadings(start?: string, end?: string): Promise<Reading[]> {
  if (!supabase) return []
  let query = supabase.from("readings").select("*").order("recorded_at", { ascending: false })
  if (start) query = query.gte("recorded_at", start)
  if (end) query = query.lte("recorded_at", end)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Reading[]
}

export async function getPatients(): Promise<Patient[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from("patients").select("*").limit(200)
  if (error) throw error
  const rows = (data ?? []) as Record<string, unknown>[]
  return rows.map((row) => ({
    id: String(row.id ?? ""),
    display_name: String(row.display_name ?? row.name ?? row.full_name ?? "Pediatric Patient"),
    dob: row.dob ? String(row.dob) : null,
    photo_url: row.photo_url ? String(row.photo_url) : null,
  }))
}

export async function getThresholdForPatient(patientId: string): Promise<Threshold | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from("thresholds").select("*").eq("patient_id", patientId).limit(1).maybeSingle()
  if (error) throw error
  if (!data) return null
  const row = data as Record<string, unknown>
  const numOrNull = (v: unknown) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  }
  return {
    patient_id: patientId,
    low_spo2_threshold: numOrNull(row.low_spo2_threshold ?? row.min_spo2 ?? row.spo2_low),
    high_bpm_threshold: numOrNull(row.high_bpm_threshold ?? row.max_bpm ?? row.bpm_high),
    low_bpm_threshold: numOrNull(row.low_bpm_threshold ?? row.min_bpm ?? row.bpm_low),
  }
}

export async function getReportReadings(patientId: string, startISO: string, endISO: string): Promise<Reading[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from("readings")
    .select("*")
    .eq("patient_id", patientId)
    .or(`and(measured_at.gte.${startISO},measured_at.lte.${endISO}),and(measured_start.lte.${endISO},measured_end.gte.${startISO}),and(recorded_at.gte.${startISO},recorded_at.lte.${endISO})`)
    .order("recorded_at", { ascending: true })
  if (!error) return (data ?? []) as Reading[]

  const { data: fallback, error: fallbackError } = await supabase.from("readings").select("*").eq("patient_id", patientId).order("recorded_at", { ascending: true })
  if (fallbackError) throw fallbackError
  const start = new Date(startISO).getTime()
  const end = new Date(endISO).getTime()
  return ((fallback ?? []) as Reading[]).filter((r) => {
    const measuredAt = new Date((r as unknown as { measured_at?: string }).measured_at ?? r.measured_start ?? r.recorded_at).getTime()
    const rs = new Date(r.measured_start ?? (r as unknown as { measured_at?: string }).measured_at ?? r.recorded_at).getTime()
    const re = new Date(r.measured_end ?? (r as unknown as { measured_at?: string }).measured_at ?? r.recorded_at).getTime()
    return (measuredAt >= start && measuredAt <= end) || (rs <= end && re >= start)
  })
}

export async function getPrimaryPatient(): Promise<Patient | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from("patients").select("*").limit(50)
  if (error) throw error
  const rows = (data ?? []) as Record<string, unknown>[]
  if (!rows.length) return null
  const sorted = [...rows].sort((a, b) => {
    const ax = String(a.created_at ?? a.createdAt ?? "")
    const bx = String(b.created_at ?? b.createdAt ?? "")
    return ax.localeCompare(bx)
  })
  const row = sorted[0]
  return {
    id: String(row.id ?? ""),
    display_name: String(row.display_name ?? row.name ?? row.full_name ?? "Pediatric Patient"),
    dob: row.dob ? String(row.dob) : null,
    photo_url: row.photo_url ? String(row.photo_url) : null,
  }
}

export async function getSessions(): Promise<ContinuousSession[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from("continuous_sessions").select("*")
  if (error) throw error
  const rows = (data ?? []) as Record<string, unknown>[]
  return rows
    .map((row) => ({
      id: String(row.id ?? ""),
      started_at: String(row.started_at ?? row.startedAt ?? row.start_time ?? row.created_at ?? new Date().toISOString()),
      ended_at: row.ended_at ? String(row.ended_at) : row.endedAt ? String(row.endedAt) : row.end_time ? String(row.end_time) : null,
    }))
    .sort((a, b) => b.started_at.localeCompare(a.started_at))
}

export async function isAdmin(userId?: string): Promise<boolean> {
  if (!supabase) return false
  const uid = userId ?? (await supabase.auth.getUser()).data.user?.id
  if (!uid) return false
  const { data, error } = await supabase.from("profiles").select("role").eq("id", uid).maybeSingle()
  if (error) return false
  return data?.role === "admin"
}

export async function uploadPatientPhoto(patientId: string, file: File): Promise<string> {
  if (!supabase) throw new Error("Missing Supabase configuration")
  const allowed = ["image/jpeg", "image/png", "image/webp"]
  if (!allowed.includes(file.type)) throw new Error("Use JPG, PNG, or WebP.")
  if (file.size > 20 * 1024 * 1024) throw new Error("File must be 20 MB or smaller.")
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-")
  const path = `${patientId}/${Date.now()}-${safeName.replace(/\.[^/.]+$/, "")}.${ext}`
  const { error: uploadError } = await supabase.storage.from("patient-photos").upload(path, file, { upsert: true })
  if (uploadError) throw uploadError
  const { data } = supabase.storage.from("patient-photos").getPublicUrl(path)
  const photoUrl = data.publicUrl
  const { error: updateError } = await supabase.from("patients").update({ photo_url: photoUrl }).eq("id", patientId)
  if (updateError) throw updateError
  return photoUrl
}

export async function createReading(payload: ReadingInput, userId: string) {
  if (!supabase) throw new Error("Missing Supabase configuration")
  const { error } = await supabase.from("readings").insert({ ...payload, created_by: userId })
  if (error) throw error
}

export async function updateReading(id: string, payload: Partial<Reading>) {
  if (!supabase) throw new Error("Missing Supabase configuration")
  const { error } = await supabase.from("readings").update(payload).eq("id", id)
  if (error) throw error
}

export async function deleteReading(id: string) {
  if (!supabase) throw new Error("Missing Supabase configuration")
  const { error } = await supabase.from("readings").delete().eq("id", id)
  if (error) throw error
}

export function buildReportSummary(readings: Reading[]): ReportSummary {
  if (!readings.length) {
    return { averageSpo2: 0, minSpo2: 0, maxSpo2: 0, averageBpm: 0, minBpm: 0, maxBpm: 0, count: 0, thresholdFlags: 0 }
  }
  const spo2 = readings.map((r) => r.spo2_avg ?? r.spo2 ?? 0)
  const bpm = readings.map((r) => r.bpm).filter((v): v is number => v !== null)
  const thresholdFlags = readings.filter((r) => (r.spo2_avg ?? r.spo2 ?? 0) < 85 || (r.bpm !== null && (r.bpm > 180 || r.bpm < 60))).length
  return {
    averageSpo2: spo2.reduce((a, b) => a + b, 0) / spo2.length,
    minSpo2: Math.min(...spo2),
    maxSpo2: Math.max(...spo2),
    averageBpm: bpm.length ? bpm.reduce((a, b) => a + b, 0) / bpm.length : 0,
    minBpm: bpm.length ? Math.min(...bpm) : 0,
    maxBpm: bpm.length ? Math.max(...bpm) : 0,
    count: readings.length,
    thresholdFlags,
  }
}
