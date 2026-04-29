import { AlertTriangle } from "lucide-react"

export function SafetyDisclaimer() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 size-4" />
        <p>
          Reporting only. This tool does not diagnose, monitor emergencies, or replace clinical judgment. Follow your
          cardiologist&apos;s emergency instructions for concerning symptoms or readings.
        </p>
      </div>
    </div>
  )
}
