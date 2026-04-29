import type { Reading } from "@/types/data"
import type { ReadingInput } from "@/lib/api"
import { ReadingsTable } from "@/components/ReadingsTable"
import { ReadingFormModal } from "@/components/ReadingFormModal"

export function ReadingsPage({
  readings,
  isAuthenticated,
  modalOpen,
  editing,
  onEdit,
  onDelete,
  onCloseModal,
  onSave,
}: {
  readings: Reading[]
  isAuthenticated: boolean
  modalOpen: boolean
  editing: Reading | null
  onEdit: (r: Reading) => void
  onDelete: (id: string) => void
  onCloseModal: () => void
  onSave: (payload: ReadingInput) => Promise<void>
}) {
  return (
    <>
      <ReadingsTable readings={readings} isAuthenticated={isAuthenticated} onEdit={onEdit} onDelete={onDelete} />
      <ReadingFormModal open={modalOpen} onClose={onCloseModal} initial={editing} onSave={onSave} />
    </>
  )
}
