import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card,CardContent } from "@/components/ui/card"

import { useState } from "react"

interface FilterModalProps {
  onApply: (filters: { supplier: string; jobNumber: string ; date:string }) => void
  onClose: () => void
  initialFilters: { supplier: string; jobNumber: string; date:string }
}

export function FilterModal({ onApply, onClose, initialFilters }: FilterModalProps) {
  const [supplier, setSupplier] = useState(initialFilters.supplier)
  const [jobNumber, setJobNumber] = useState(initialFilters.jobNumber)
  const [date, setDate] = useState(initialFilters.date)

  const handleApply = () => {
    onApply({ supplier, jobNumber ,date})
    onClose()
  }

  const formatUKDate = (input: string) => {
    const digits = input.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUKDate(e.target.value);
    e.target.value = formatted;
    setDate(formatted); 
  };

  return (
    <Card>
      <CardContent>
      <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="jobNumber" className="text-sm font-medium">
          Job #
        </label>
        <Input
          id="jobNumber"
          type="text"
          placeholder="Filter by job #"
          value={jobNumber}
          onChange={(e) => setJobNumber(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="supplier" className="text-sm font-medium">
          Supplier
        </label>
        <Input
          id="supplier"
          type="text"
          placeholder="Filter by supplier"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
        />
      </div>
      <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium">
            Inspection Date
          </label>
          <Input
           id="date"
           type="text"   
                  
            onChange={handleDateChange}
            placeholder="DD/MM/YYYY"
            maxLength={10} required={false}
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

