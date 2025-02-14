import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useState } from "react"

interface FilterModalProps {
  onApply: (filters: { name: string; postCode: string }) => void
  onClose: () => void
  initialFilters: { name: string; postCode: string }
}

export function FilterModal({ onApply, onClose, initialFilters }: FilterModalProps) {
  const [name, setName] = useState(initialFilters.name)
  const [postCode, setPostCode] = useState(initialFilters.postCode)

  const handleApply = () => {
    onApply({ name, postCode })
    onClose()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Filter by name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="postCode" className="text-sm font-medium">
          Post Code
        </label>
        <Input
          id="postCode"
          type="text"
          placeholder="Filter by post code"
          value={postCode}
          onChange={(e) => setPostCode(e.target.value)}
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

