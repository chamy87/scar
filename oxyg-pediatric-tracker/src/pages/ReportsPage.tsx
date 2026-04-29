import { useMemo, useState } from "react"
import { subDays } from "date-fns"
import { getPatients, getReportReadings, getThresholdForPatient } from "@/lib/api"
import type { Patient, Threshold } from "@/types/data"
import type { NormalizedReportReading } from "@/utils/reportCalculations"
import { calculateReportSummary, normalizeReadingForReport } from "@/utils/reportCalculations"
import { exportReportPdf } from "@/utils/exportReportPdf"
import { ReportControls } from "@/components/reports/ReportControls"
import { ReportHeader } from "@/components/reports/ReportHeader"
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards"
import { ReportClinicalNotes } from "@/components/reports/ReportClinicalNotes"
import { ReportCharts } from "@/components/reports/ReportCharts"
import { ReportReadingsTable } from "@/components/reports/ReportReadingsTable"
import { ReportDisclaimer } from "@/components/reports/ReportDisclaimer"
import { EmptyState } from "@/components/shared/EmptyState"
import { FileBarChart } from "lucide-react"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export function ReportsPage({ dataVersion }: { dataVersion: number }) {
  const location = useLocation()
  const now = new Date()
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState("")
  const [threshold, setThreshold] = useState<Threshold | null>(null)
  const [rows, setRows] = useState<NormalizedReportReading[]>([])
  const [generated, setGenerated] = useState(false)
  const [error, setError] = useState("")
  const [start, setStart] = useState(subDays(now, 7).toISOString().slice(0, 16))
  const [end, setEnd] = useState(now.toISOString().slice(0, 16))

  useEffect(() => {
    const load = async () => {
      const p = await getPatients()
      setPatients(p)
      if (p[0]?.id) {
        setSelectedPatientId(p[0].id)
      }
    }
    load().catch((e) => setError(e instanceof Error ? e.message : "Failed to load patients"))
  }, [])

  const run = async () => {
    if (!selectedPatientId) return
    setError("")
    try {
      const [readings, th] = await Promise.all([
        getReportReadings(selectedPatientId, new Date(start).toISOString(), new Date(end).toISOString()),
        getThresholdForPatient(selectedPatientId),
      ])
      setThreshold(th)
      setRows(readings.map((r) => normalizeReadingForReport(r, th)))
      setGenerated(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate report")
    }
  }

  useEffect(() => {
    if (!selectedPatientId) return
    run().catch((e) => setError(e instanceof Error ? e.message : "Failed to refresh report"))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataVersion, selectedPatientId, location.pathname])

  useEffect(() => {
    setRows([])
    setThreshold(null)
    setGenerated(false)
  }, [selectedPatientId])

  const selectedPatient = useMemo(() => patients.find((p) => p.id === selectedPatientId) ?? null, [patients, selectedPatientId])
  const summary = useMemo(() => calculateReportSummary(rows, threshold), [rows, threshold])

  return (
    <div className="space-y-4">
      <ReportControls patients={patients} selectedPatientId={selectedPatientId} onPatientChange={setSelectedPatientId} start={start} end={end} setStart={setStart} setEnd={setEnd} onGenerate={run} onDownload={async () => exportReportPdf("report-pdf-content")} />
      {error && <div className="rounded-xl border border-accent-rose bg-white p-3 text-sm text-accent-rose">{error}</div>}
      <div id="report-pdf-content" className="mx-auto max-w-[980px] space-y-4 bg-white p-2">
        <ReportHeader patient={selectedPatient} startISO={new Date(start).toISOString()} endISO={new Date(end).toISOString()} />
        <ReportDisclaimer />
        <ReportSummaryCards summary={summary} />
        <ReportClinicalNotes summary={summary} threshold={threshold} />
        {!generated || rows.length ? <><ReportCharts rows={rows} threshold={threshold} /><ReportReadingsTable rows={rows} /></> : <EmptyState title="No readings found for this report range." description="No readings found for this report range." Icon={FileBarChart} />}
      </div>
    </div>
  )
}
