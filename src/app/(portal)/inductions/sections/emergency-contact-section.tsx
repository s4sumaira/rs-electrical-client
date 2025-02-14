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

export function EmergencyContactSection({ formState, errors, getInputProps, setFormState }: SectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Emergency Contact</h2>
      <div className="space-y-2">
        <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
        <Input
          {...getInputProps("emergencyContact.name")}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              emergencyContact: { ...prev.emergencyContact, name: e.target.value },
            }))
          }
        />
        {errors["emergencyContact.name"] && (
          <p className="text-sm text-red-500">{errors["emergencyContact.name"][0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
        <Input
          {...getInputProps("emergencyContact.phoneNumber")}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              emergencyContact: { ...prev.emergencyContact, phoneNumber: e.target.value },
            }))
          }
        />
        {errors["emergencyContact.phoneNumber"] && (
          <p className="text-sm text-red-500">{errors["emergencyContact.phoneNumber"][0]}</p>
        )}
      </div>
    </div>
  )
}

