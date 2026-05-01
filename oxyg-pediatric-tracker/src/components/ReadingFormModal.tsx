import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import type { Reading } from "@/types/data"
import type { ReadingInput } from "@/lib/api"
import { fromCentralInputValue, nowCentralInputValue, toCentralInputValue } from "@/lib/utils"

type Mode = "single" | "range"

export function ReadingFormModal({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean
  onClose: () => void
  onSave: (payload: ReadingInput) => Promise<void>
  initial?: Reading | null
}) {
  const [mode, setMode] = useState<Mode>("single")
  const [spo2, setSpo2] = useState("")
  const [spo2Min, setSpo2Min] = useState("")
  const [spo2Max, setSpo2Max] = useState("")
  const [measuredAt, setMeasuredAt] = useState("")
  const [measuredStart, setMeasuredStart] = useState("")
  const [measuredEnd, setMeasuredEnd] = useState("")
  const [bpm, setBpm] = useState("")
  const [pi, setPi] = useState("")
  const [signalQuality, setSignalQuality] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    const range = Boolean(initial?.is_spo2_range)
    setMode(range ? "range" : "single")
    setSpo2(initial?.spo2_avg?.toString() ?? "")
    setSpo2Min(initial?.spo2_min?.toString() ?? "")
    setSpo2Max(initial?.spo2_max?.toString() ?? "")
    const at = initial?.measured_start ?? initial?.recorded_at
    const atValue = at ? toCentralInputValue(at) : nowCentralInputValue()
    setMeasuredAt(atValue)
    setMeasuredStart(initial?.measured_start ? toCentralInputValue(initial.measured_start) : atValue)
    setMeasuredEnd(initial?.measured_end ? toCentralInputValue(initial.measured_end) : atValue)
    setBpm(initial?.bpm?.toString() ?? "")
    setPi(initial?.pi?.toString() ?? "")
    setSignalQuality(initial?.signal_quality ?? "")
    setNotes(initial?.notes ?? "")
    setError("")
    setSuccess("")
  }, [initial, open])

  const avg = useMemo(() => {
    if (mode === "single") return Number(spo2 || 0)
    const min = Number(spo2Min || 0)
    const max = Number(spo2Max || 0)
    return (min + max) / 2
  }, [mode, spo2, spo2Min, spo2Max])

  if (!open) return null

  const submit = async () => {
    setError("")
    const patientId = initial?.patient_id ?? "00000000-0000-0000-0000-000000000001"
    if (mode === "single") {
      const v = Number(spo2)
      if (!Number.isFinite(v) || v < 0 || v > 100) return setError("SpO₂ is required and must be between 0 and 100.")
      if (!measuredAt) return setError("Measured at is required.")
      const measuredISO = fromCentralInputValue(measuredAt)
      const payload: ReadingInput = {
        patient_id: patientId,
        device_id: initial?.device_id ?? null,
        spo2: v,
        spo2_min: v,
        spo2_max: v,
        spo2_avg: v,
        is_spo2_range: false,
        reading_type: "Spot check",
        measured_start: measuredISO,
        measured_end: measuredISO,
        measured_at: measuredISO,
        bpm: bpm ? Number(bpm) : null,
        pi: pi ? Number(pi) : null,
        signal_quality: signalQuality || null,
        notes: notes || null,
        waveform: null,
        recorded_at: measuredISO,
      }
      setSaving(true)
      try {
        await onSave(payload)
        setSuccess("Reading saved.")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Save failed")
      } finally {
        setSaving(false)
      }
      return
    }
    const min = Number(spo2Min)
    const max = Number(spo2Max)
    if (!Number.isFinite(min) || !Number.isFinite(max)) return setError("SpO₂ minimum and maximum are required.")
    if (min < 0 || max > 100 || min > max) return setError("SpO₂ min/max must be 0–100 and minimum must be less than or equal to maximum.")
    if (!measuredStart || !measuredEnd) return setError("Start and end time are required.")
    const startISO = fromCentralInputValue(measuredStart)
    const endISO = fromCentralInputValue(measuredEnd)
    if (startISO > endISO) return setError("Start time must be before or equal to end time.")
    const payload: ReadingInput = {
      patient_id: patientId,
      device_id: initial?.device_id ?? null,
      spo2: null,
      spo2_min: min,
      spo2_max: max,
      spo2_avg: Number(((min + max) / 2).toFixed(2)),
      is_spo2_range: true,
      reading_type: "Range reading",
      measured_start: startISO,
      measured_end: endISO,
      measured_at: startISO,
      bpm: bpm ? Number(bpm) : null,
      pi: pi ? Number(pi) : null,
      signal_quality: signalQuality || null,
      notes: notes || null,
      waveform: null,
      recorded_at: startISO,
    }
    setSaving(true)
    try {
      await onSave(payload)
      setSuccess("Reading saved.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-30 bg-black/30 p-4">
      <div className="mx-auto mt-16 max-w-lg rounded-2xl border border-border-soft bg-white p-5 shadow-lg">
        <h3 className="mb-3 text-lg font-semibold">{initial ? "Edit Reading" : "Add Reading"}</h3>
        <div className="mb-3 flex gap-2 text-sm">
          <button className={`rounded-full px-3 py-1 ${mode === "single" ? "bg-scarlet-primary text-white" : "bg-scarlet-soft"}`} onClick={() => setMode("single")}>Single SpO₂</button>
          <button className={`rounded-full px-3 py-1 ${mode === "range" ? "bg-scarlet-primary text-white" : "bg-scarlet-soft"}`} onClick={() => setMode("range")}>SpO₂ Range</button>
        </div>
        <div className="grid gap-2">
          {mode === "single" ? (
            <>
              <input className="rounded-xl border border-border-soft p-2" placeholder="SpO₂ value (required)" value={spo2} onChange={(e) => setSpo2(e.target.value)} />
              <label className="text-xs text-text-muted">Measured at (Central Time)</label>
              <input className="rounded-xl border border-border-soft p-2" type="datetime-local" value={measuredAt} onChange={(e) => setMeasuredAt(e.target.value)} />
            </>
          ) : (
            <>
              <input className="rounded-xl border border-border-soft p-2" placeholder="SpO₂ minimum (required)" value={spo2Min} onChange={(e) => setSpo2Min(e.target.value)} />
              <input className="rounded-xl border border-border-soft p-2" placeholder="SpO₂ maximum (required)" value={spo2Max} onChange={(e) => setSpo2Max(e.target.value)} />
              <label className="text-xs text-text-muted">Start (Central Time)</label>
              <input className="rounded-xl border border-border-soft p-2" type="datetime-local" value={measuredStart} onChange={(e) => setMeasuredStart(e.target.value)} />
              <label className="text-xs text-text-muted">End (Central Time)</label>
              <input className="rounded-xl border border-border-soft p-2" type="datetime-local" value={measuredEnd} onChange={(e) => setMeasuredEnd(e.target.value)} />
              <p className="text-xs text-text-muted">Average SpO₂: {Number.isFinite(avg) ? avg.toFixed(1) : "0.0"}%</p>
            </>
          )}
          <input className="rounded-xl border border-border-soft p-2" placeholder="BPM (optional)" value={bpm} onChange={(e) => setBpm(e.target.value)} />
          <input className="rounded-xl border border-border-soft p-2" placeholder="PI (optional)" value={pi} onChange={(e) => setPi(e.target.value)} />
          <input className="rounded-xl border border-border-soft p-2" placeholder="Signal quality (optional)" value={signalQuality} onChange={(e) => setSignalQuality(e.target.value)} />
          <textarea className="rounded-xl border border-border-soft p-2" placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        {error && <p className="mt-2 text-sm text-accent-rose">{error}</p>}
        {success && <p className="mt-2 text-sm text-emerald-700">{success}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <Button className="bg-gray-500" onClick={onClose}>Cancel</Button>
          <Button disabled={saving} onClick={submit}>{saving ? "Saving..." : "Save"}</Button>
        </div>
      </div>
    </div>
  )
}
