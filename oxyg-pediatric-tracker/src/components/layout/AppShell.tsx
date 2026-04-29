import { Sidebar } from "@/components/layout/Sidebar"
import type { ReactNode } from "react"

export function AppShell({ header, children }: { header: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-clinical text-text-main">
      <div className="mx-auto flex max-w-[1500px]">
        <Sidebar />
        <main className="min-w-0 flex-1">
          {header}
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
