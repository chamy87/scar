import { Activity, ChartNoAxesCombined, FileBarChart, Gauge, Settings, Waves } from "lucide-react"
import { NavLink } from "react-router-dom"

const items = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/readings", label: "Readings", icon: Activity },
  { to: "/sessions", label: "Sessions", icon: Waves },
  { to: "/reports", label: "Reports", icon: FileBarChart },
]

export function Sidebar({ showSettings }: { showSettings: boolean }) {
  const navItems = showSettings ? [...items, { to: "/settings", label: "Settings", icon: Settings }] : items
  return (
    <aside className="hidden w-72 border-r border-border-soft bg-white/85 p-5 lg:block">
      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-border-soft bg-scarlet-soft/40 p-3">
        <div className="rounded-xl bg-scarlet-primary p-2 text-white"><ChartNoAxesCombined className="size-5" /></div>
        <div>
          <p className="text-sm font-semibold text-scarlet-deep">Scarlett&apos;s Pediatric Tracker</p>
          <p className="text-xs text-text-muted">Cardiology Reporting</p>
        </div>
      </div>
      <nav className="space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${isActive ? "bg-scarlet-primary text-white" : "text-text-muted hover:bg-scarlet-soft/70"}`}>
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
