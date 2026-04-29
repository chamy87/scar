import { UserRound } from "lucide-react"

export function PatientAvatar({ name, photoUrl, size = "md" }: { name: string; photoUrl?: string | null; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
  const cls = size === "lg" ? "size-20 text-lg" : size === "sm" ? "size-10 text-xs" : "size-14 text-sm"
  if (photoUrl) return <img className={`${cls} rounded-full border border-border-soft object-cover`} src={photoUrl} alt={name} />
  return <div className={`${cls} flex items-center justify-center rounded-full border border-border-soft bg-scarlet-soft font-semibold text-scarlet-deep`}><UserRound className="mr-1 size-4" />{initials}</div>
}
