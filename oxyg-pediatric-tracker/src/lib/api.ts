import { supabase } from "@/lib/supabaseClient"
import type { ContinuousSession, Patient, Reading, ReportSummary } from "@/types/data"

export type ReadingInput = {
  patient_id: string
  device_id?: string | null
  spo2: number | null
  spo2_min: number | null
  spo2_max: number | null
  spo2_avg: number
  is_spo2_range: boolean
  measured_start: string
  measured_end: string
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

export async function getPrimaryPatient(): Promise<Patient | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from("patients").select("id, display_name, dob, photo_url").order("created_at", { ascending: true }).limit(1).maybeSingle()
  if (error) throw error
  return (data as Patient | null) ?? null
}

export async function getSessions(): Promise<ContinuousSession[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from("continuous_sessions").select("id, started_at, ended_at").order("started_at", { ascending: false })
  if (error) throw error
  return (data ?? []) as ContinuousSession[]
}

export async function isAdmin(userId?: string): Promise<boolean> {
  if (!supabase) return false
  const uid = userId ?? (await supabase.auth.getUser()).data.user?.id
  if (!uid) return false
  const { data, error } = await supabase.from("profiles").select("role").eq("id", uid).maybeSingle()
  if (error) return false
  return data?.role === "admin"
}

export async function uploadPatientPhoto(patientId: string, file: File, userId: string): Promise<string> {
  if (!supabase) throw new Error("Missing Supabase configuration")
  const allowed = ["image/jpeg", "image/png", "image/webp"]
  if (!allowed.includes(file.type)) throw new Error("Use JPG, PNG, or WebP.")
  if (file.size > 5 * 1024 * 1024) throw new Error("File must be 5 MB or smaller.")
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const path = `${patientId}/${userId}-${Date.now()}.${ext}`
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
