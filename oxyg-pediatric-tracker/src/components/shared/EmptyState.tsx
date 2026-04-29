import type { LucideIcon } from "lucide-react"

export function EmptyState({ title, description, Icon }: { title: string; description: string; Icon: LucideIcon }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-white p-8 text-center shadow-sm">
      <Icon className="mx-auto mb-3 size-8 text-scarlet-primary" />
      <h3 className="text-base font-semibold text-text-main">{title}</h3>
      <p className="mt-1 text-sm text-text-muted">{description}</p>
    </div>
  )
}
