import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card,CardContent } from "@/components/ui/card"

import { useState } from "react"

interface FilterModalProps {
  onApply: (filters: { supplier: string; jobNumber: string }) => void
  onClose: () => void
  initialFilters: { supplier: string; jobNumber: string }
}

export function FilterModal({ onApply, onClose, initialFilters }: FilterModalProps) {
  const [supplier, setSupplier] = useState(initialFilters.supplier)
  const [jobNumber, setJobNumber] = useState(initialFilters.jobNumber)

  const handleApply = () => {
    onApply({ supplier, jobNumber })
    onClose()
  }

  return (
    <Card>
      <CardContent>
      <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Filter by job #"
          value={jobNumber}
          onChange={(e) => setJobNumber(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="postCode" className="text-sm font-medium">
          Post Code
        </label>
        <Input
          id="postCode"
          type="text"
          placeholder="Filter by supplier"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button className="bg-btn-cancel hover:bg-btn-cancel-hover text-btn-cancel-fg"  onClick={onClose}>
          Discard
        </Button>
        <Button className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg" onClick={handleApply}>Apply Filters</Button>
      </div>
    </div>
      </CardContent>
    </Card>
   
  )
}

