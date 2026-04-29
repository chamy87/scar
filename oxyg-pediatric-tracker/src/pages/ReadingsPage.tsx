import type { Reading } from "@/types/data"
import { ReadingsTable } from "@/components/ReadingsTable"

export function ReadingsPage({
  readings,
  isAuthenticated,
  onEdit,
  onDelete,
}: {
  readings: Reading[]
  isAuthenticated: boolean
  onEdit: (r: Reading) => void
  onDelete: (id: string) => void
}) {
  return (
    <>
      <ReadingsTable readings={readings} isAuthenticated={isAuthenticated} onEdit={onEdit} onDelete={onDelete} />
    </>
  )
}
