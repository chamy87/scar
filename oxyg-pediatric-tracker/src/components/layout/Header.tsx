import { Activity } from "lucide-react"
import { AuthButton } from "@/components/AuthButton"
import { Button } from "@/components/ui/button"
import { PatientAvatar } from "@/components/patient/PatientAvatar"
import { NavLink } from "react-router-dom"

export function Header({
  patientName,
  photoUrl,
  email,
  isAuthenticated,
  onLogin,
  onLogout,
  onAddReading,
  showSettings,
}: {
  patientName: string
  photoUrl?: string | null
  email?: string
  isAuthenticated: boolean
  onLogin: () => void
  onLogout: () => void
  onAddReading: () => void
  showSettings: boolean
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-border-soft bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <PatientAvatar name={patientName} photoUrl={photoUrl} size="sm" />
          <div>
            <p className="text-sm font-semibold text-text-main">{patientName}</p>
            <p className="text-xs text-text-muted">Diagnosis: Tetralogy of Fallot</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated && <span className="hidden text-xs text-text-muted sm:inline">{email}</span>}
          {isAuthenticated && <Button className="bg-accent-rose" onClick={onAddReading}><Activity className="mr-2 inline size-4" />Add Reading</Button>}
          <AuthButton isAuthenticated={isAuthenticated} onLogin={onLogin} onLogout={onLogout} />
        </div>
      </div>
      <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 text-xs lg:hidden">
        {["/dashboard", "/readings", "/reports", ...(showSettings ? ["/settings"] : [])].map((to) => (
          <NavLink key={to} to={to} className={({ isActive }) => `rounded-full px-3 py-1 ${isActive ? "bg-scarlet-primary text-white" : "bg-scarlet-soft text-scarlet-deep"}`}>
            {to.slice(1)}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
