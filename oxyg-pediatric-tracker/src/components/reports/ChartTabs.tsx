type ChartTab = "spo2" | "bpm" | "pi"

const tabs: Array<{ id: ChartTab; label: string }> = [
  { id: "spo2", label: "SpO₂" },
  { id: "bpm", label: "BPM" },
  { id: "pi", label: "PI" },
]

export function ChartTabs({ active, onChange }: { active: ChartTab; onChange: (tab: ChartTab) => void }) {
  return (
    <div className="inline-flex rounded-xl border border-border-soft bg-scarlet-soft p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            active === tab.id ? "bg-white text-text-main shadow-sm" : "text-text-muted hover:text-text-main"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export type { ChartTab }
