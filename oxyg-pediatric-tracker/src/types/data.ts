export type Reading = {
  id: string
  patient_id: string
  device_id: string | null
  spo2: number | null
  spo2_min: number | null
  spo2_max: number | null
  spo2_avg: number | null
  is_spo2_range: boolean
  reading_type?: string | null
  measured_start: string | null
  measured_end: string | null
  bpm: number | null
  pi: number | null
  signal_quality: string | null
  notes: string | null
  waveform: string | null
  recorded_at: string
  created_by: string | null
}

export type Patient = {
  id: string
  display_name: string
  dob: string | null
  photo_url: string | null
}

export type ContinuousSession = {
  id: string
  started_at: string
  ended_at: string | null
}

export type Threshold = {
  patient_id: string
  low_spo2_threshold: number | null
  high_bpm_threshold: number | null
  low_bpm_threshold: number | null
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
