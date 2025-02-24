import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface FilterModalProps {
  onApply: (filters: { permitNumber: string; site: string; contractor: string; date: string }) => void;
  onClose: () => void;
  initialFilters: { permitNumber: string; site: string; contractor: string; date: string };
}

export function FilterModal({ onApply, onClose, initialFilters }: FilterModalProps) {
  const [permitNumber, setPermitNumber] = useState(initialFilters.permitNumber);
  const [site, setSite] = useState(initialFilters.site);
  const [contractor, setContractor] = useState(initialFilters.contractor);
  const [date, setDate] = useState(initialFilters.date);

  const handleApply = () => {
    onApply({ permitNumber, site, contractor, date });
    onClose();
  };

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
            <label htmlFor="permitNumber" className="text-sm font-medium">
              Permit Number
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
            <label htmlFor="site" className="text-sm font-medium">
              Site
            </label>
            <Input
              id="site"
              type="text"
              placeholder="Filter by site"
              value={site}
              onChange={(e) => setSite(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contractor" className="text-sm font-medium">
              Contractor
            </label>
            <Input
              id="contractor"
              type="text"
              placeholder="Filter by contractor"
              value={contractor}
              onChange={(e) => setContractor(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              Date
            </label>
            <Input
              id="date"
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
  );
}