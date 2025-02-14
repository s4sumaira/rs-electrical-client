import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SiteInduction } from "@/lib/types/induction"

interface SectionProps {
  formState: SiteInduction
  errors: Partial<Record<keyof SiteInduction, string[]>>
  getInputProps: (name: keyof SiteInduction) => any
  getSelectProps: (name: keyof SiteInduction) => any
  setFormState: React.Dispatch<React.SetStateAction<SiteInduction>>
}

export function DocumentsSection({ formState, errors, setFormState }: SectionProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const newDocument = {
        filename: file.name,
        path: URL.createObjectURL(file),
        uploadedAt: new Date(),
        type: file.type,
      }
      setFormState((prev) => ({
        ...prev,
        documents: [...(prev.documents || []), newDocument],
      }))
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Documents</h2>
      <div className="space-y-2">
        <Label htmlFor="document">Upload Document</Label>
        <Input id="document" type="file" onChange={handleFileChange} />
      </div>
      {formState.documents && formState.documents.length > 0 && (
        <div>
          <h3 className="text-md font-semibold">Uploaded Documents:</h3>
          <ul className="list-disc pl-5">
            {formState.documents.map((doc, index) => (
              <li key={index}>
                {doc.filename} - Uploaded on {doc.uploadedAt.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

