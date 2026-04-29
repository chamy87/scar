import { Activity, AlertTriangle, Droplets, HeartPulse } from "lucide-react"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { PatientSummaryCard } from "@/components/patient/PatientSummaryCard"
import { TrendChartCard } from "@/components/TrendChartCard"
import { SafetyDisclaimer } from "@/components/common/SafetyDisclaimer"
import type { Patient, Reading, ReportSummary } from "@/types/data"

export function DashboardPage({
  patient,
  latest,
  summary,
  readings,
  isAuthenticated,
  isAdmin,
  userId,
  onPhotoUpdated,
}: {
  patient: Patient | null
  latest: Reading | null
  summary: ReportSummary
  readings: Reading[]
  isAuthenticated: boolean
  isAdmin: boolean
  userId?: string
  onPhotoUpdated: (url: string) => void
}) {
  return (
    <div className="space-y-5">
      <PatientSummaryCard patient={patient} latestReading={latest} isAdmin={isAdmin} userId={userId} onPhotoUpdated={onPhotoUpdated} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Latest SpO₂" value={latest ? `${latest.spo2_avg ?? latest.spo2 ?? "--"}%` : "--"} helper="Oxygen saturation" trend={summary.count > 1 ? `${(summary.maxSpo2 - summary.minSpo2).toFixed(0)} range` : "No trend"} Icon={Droplets} />
        <MetricCard title="Latest BPM" value={latest?.bpm != null ? `${latest.bpm}` : "--"} helper="Heart rate" trend={summary.count > 1 ? `${(summary.maxBpm - summary.minBpm).toFixed(0)} range` : "No trend"} Icon={HeartPulse} />
        <MetricCard title="Latest PI" value={latest?.pi != null ? `${latest.pi}` : "--"} helper="Perfusion index" trend={summary.count > 1 ? "Tracking enabled" : "No trend"} Icon={Activity} />
        <MetricCard title="Flags" value={`${summary.thresholdFlags}`} helper="Potential threshold events" trend={summary.thresholdFlags ? "Needs review" : "None"} Icon={AlertTriangle} />
      </div>
      <TrendChartCard readings={readings} canAdd={isAuthenticated} />
      <SafetyDisclaimer />
    </div>
  )
}
