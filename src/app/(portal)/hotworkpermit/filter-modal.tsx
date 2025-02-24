import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

interface FilterModalProps {
  onApply: (filters: {
    jobNumber: string
    companyName: string
    dateOfWorks: string
    permitNumber: string
  }) => void
  onClose: () => void
  initialFilters: {
    jobNumber: string
    companyName: string
    dateOfWorks: string
    permitNumber: string
  }
}

export function FilterModal({ onApply, onClose, initialFilters }: FilterModalProps) {
  const [jobNumber, setJobNumber] = useState(initialFilters.jobNumber)
  const [companyName, setCompanyName] = useState(initialFilters.companyName)
  const [dateOfWorks, setDateOfWorks] = useState(initialFilters.dateOfWorks)
  const [permitNumber, setPermitNumber] = useState(initialFilters.permitNumber)

  const handleApply = () => {
    onApply({
      jobNumber,
      companyName,
      dateOfWorks,
      permitNumber
    })
    onClose()
  }

  const formatUKDate = (input: string) => {
    const digits = input.replace(/\D/g, '')
    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUKDate(e.target.value)
    e.target.value = formatted
    setDateOfWorks(formatted)
  }

  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="permitNumber" className="text-sm font-medium">
              Permit #
            </label>
            <Input
              id="permitNumber"
              type="text"
              placeholder="Filter by permit number"
              value={permitNumber}
              onChange={(e) => setPermitNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="jobNumber" className="text-sm font-medium">
              Job #
            </label>
            <Input
              id="jobNumber"
              type="text"
              placeholder="Filter by job number"
              value={jobNumber}
              onChange={(e) => setJobNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="companyName" className="text-sm font-medium">
              Company
            </label>
            <Input
              id="companyName"
              type="text"
              placeholder="Filter by company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="dateOfWorks" className="text-sm font-medium">
              Date of Works
            </label>
            <Input
              id="dateOfWorks"
              type="text"
              onChange={handleDateChange}
              placeholder="DD/MM/YYYY"
              maxLength={10}
              required={false}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              className="bg-btn-cancel hover:bg-btn-cancel-hover text-btn-cancel-fg"
              onClick={onClose}
            >
              Discard
            </Button>
            <Button
              className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
              onClick={handleApply}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}