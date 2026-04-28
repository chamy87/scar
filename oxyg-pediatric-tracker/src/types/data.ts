export type Reading = {
  id: string
  patient_id: string
  device_id: string | null
  spo2: number
  bpm: number
  pi: number | null
  recorded_at: string
  created_by: string | null
}

export type ReportSummary = {
  averageSpo2: number
  minSpo2: number
  maxSpo2: number
  averageBpm: number
  minBpm: number
  maxBpm: number
  count: number
  thresholdFlags: number
}
