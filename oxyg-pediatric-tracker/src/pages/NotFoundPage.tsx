import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="mx-auto mt-20 max-w-xl rounded-2xl border border-border-soft bg-white p-8 text-center shadow-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-scarlet-deep">Scarlett&apos;s Pediatric Tracker</p>
      <h1 className="text-3xl font-semibold text-text-main">Page not found</h1>
      <p className="mt-2 text-sm text-text-muted">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link to="/dashboard"><Button className="mt-6">Back to Dashboard</Button></Link>
    </div>
  )
}
