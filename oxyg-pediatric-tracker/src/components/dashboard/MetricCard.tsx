import type { LucideIcon } from "lucide-react"

export function MetricCard({
  title,
  value,
  helper,
  trend,
  Icon,
}: {
  title: string
  value: string
  helper: string
  trend: string
  Icon: LucideIcon
}) {
  return (
    <div className="rounded-2xl border border-border-soft bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-text-muted">{title}</p>
        <div className="rounded-xl bg-scarlet-soft p-2 text-scarlet-primary"><Icon className="size-4" /></div>
      </div>
      <p className="text-3xl font-semibold text-text-main">{value}</p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-text-muted">{helper}</p>
        <p className="text-xs font-medium text-scarlet-deep">{trend}</p>
      </div>
    </div>
  )
}
