import { useRef, useState } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadPatientPhoto } from "@/lib/api"

export function PatientPhotoUpload({ patientId, onUploaded }: { patientId: string; onUploaded: (url: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const onFile = async (file?: File) => {
    if (!file) return
    setLoading(true)
    setError("")
    try {
      const url = await uploadPatientPhoto(patientId, file)
      onUploaded(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input ref={inputRef} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onFile(e.target.files?.[0])} />
      <Button className="bg-scarlet-deep text-xs" disabled={loading} onClick={() => inputRef.current?.click()}>
        <Camera className="mr-1 inline size-3" />
        {loading ? "Uploading..." : "Change Photo"}
      </Button>
      {error && <p className="mt-1 text-xs text-accent-rose">{error}</p>}
    </div>
  )
}
