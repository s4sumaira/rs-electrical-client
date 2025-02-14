import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContactType } from "@/lib/types/contact"
import { useState } from "react"

interface FilterModalProps {
  onApply: (filters: { contactType: string; email: string }) => void
  onClose: () => void
  initialFilters: { contactType: string; email: string }
}

export function FilterModal({ onApply, onClose, initialFilters }: FilterModalProps) {
  const [contactType, setContactType] = useState(initialFilters.contactType)
  const [email, setEmail] = useState(initialFilters.email)

  const handleApply = () => {
    onApply({ contactType, email })
    onClose()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="contactType" className="text-sm font-medium">
          Contact Type
        </label>
        <Select value={contactType} onValueChange={setContactType}>
          <SelectTrigger id="contactType">
            <SelectValue placeholder="Select contact type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Object.values(ContactType).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Filter by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button className="bg-btn-cancel hover:bg-btn-cancel-hover text-btn-cancel-fg"  onClick={onClose}>
          Discard
        </Button>
        <Button className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg" onClick={handleApply}>Apply Filters</Button>
      </div>
    </div>
  )
}

