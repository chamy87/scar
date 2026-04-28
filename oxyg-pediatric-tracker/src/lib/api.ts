import { supabase } from "@/lib/supabaseClient"
import type { Reading, ReportSummary } from "@/types/data"

export async function getReadings(start?: string, end?: string): Promise<Reading[]> {
  if (!supabase) return []
  let query = supabase.from("readings").select("*").order("recorded_at", { ascending: false })
  if (start) query = query.gte("recorded_at", start)
  if (end) query = query.lte("recorded_at", end)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Reading[]
}

export async function createReading(payload: Omit<Reading, "id" | "created_by">) {
  if (!supabase) throw new Error("Missing Supabase configuration")
  const { error } = await supabase.from("readings").insert(payload)
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
  const spo2 = readings.map((r) => r.spo2)
  const bpm = readings.map((r) => r.bpm)
  const thresholdFlags = readings.filter((r) => r.spo2 < 85 || r.bpm > 180 || r.bpm < 60).length
  return {
    averageSpo2: spo2.reduce((a, b) => a + b, 0) / spo2.length,
    minSpo2: Math.min(...spo2),
    maxSpo2: Math.max(...spo2),
    averageBpm: bpm.reduce((a, b) => a + b, 0) / bpm.length,
    minBpm: Math.min(...bpm),
    maxBpm: Math.max(...bpm),
    count: readings.length,
    thresholdFlags,
  }
}

export async function login(email: string, password: string) {
  if (!supabase) throw new Error("Missing Supabase configuration")
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function logout() {
  if (!supabase) return
  await supabase.auth.signOut()
}
