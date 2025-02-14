import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useState } from "react"

interface FilterModalProps {
  onApply: (filters: { name: string; startDate: string ;endDate:string }) => void
  onClose: () => void
  initialFilters: { name: string; startDate: string;endDate:string }
}

export function FilterModal({ onApply, onClose, initialFilters }: FilterModalProps) {
  const [name, setName] = useState(initialFilters.name)
  const [startDate, setStartDate] = useState(initialFilters.startDate)
  const [endDate, setEndDate] = useState(initialFilters.endDate)

  const handleApply = () => {
    console.log('name  ', name, '  start ',startDate, '   end   ' ,endDate );
    onApply({ name, startDate,endDate })
    onClose()
  }

  const formatUKDate = (input: string) => {
    const digits = input.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };
  
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUKDate(e.target.value);
    e.target.value = formatted;
    setStartDate(formatted); 
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUKDate(e.target.value);
    e.target.value = formatted;
    setEndDate(formatted); 
  };

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
          <label htmlFor="startDate" className="text-sm font-medium">
            Start Date
          </label>
          <Input
           id="startDate"
           type="text"   
                  
            onChange={handleStartDateChange}
            placeholder="DD/MM/YYYY"
            maxLength={10} required={false}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="endDate" className="text-sm font-medium">
            End Date
          </label>
          <Input
           id="endDate"
           type="text"           
            onChange={handleEndDateChange}
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
  )
}

