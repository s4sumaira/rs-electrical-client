import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { IncidentClassification } from "@/lib/types/accidentIncident"
import { AccidentType } from "@/lib/helpers/enum"

interface FilterModalProps {
  onApply: (filters: { 
    search: string; 
    fromDate: string; 
    toDate: string; 
    incidentType: string;
    incidentClassification: string;
  }) => void;
  onClose: () => void;
  initialFilters: { 
    search: string; 
    fromDate: string; 
    toDate: string; 
    incidentType: string;
    incidentClassification: string;
  };
}

export function AccidentIncidentFilterModal({ onApply, onClose, initialFilters }: FilterModalProps) {
  const [search, setSearch] = useState(initialFilters.search);
  const [fromDate, setFromDate] = useState(initialFilters.fromDate);
  const [toDate, setToDate] = useState(initialFilters.toDate);
  const [incidentType, setIncidentType] = useState(initialFilters.incidentType);
  const [incidentClassification, setIncidentClassification] = useState(initialFilters.incidentClassification);

  const handleApply = () => {
    onApply({ search, fromDate, toDate, incidentType, incidentClassification });
    onClose();
  };

  return (
    <Card>
      <CardContent>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="search" className="text-sm font-medium">
              Search
            </label>
            <Input
              id="search"
              type="text"
              placeholder="Search by name, project, etc."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="fromDate" className="text-sm font-medium">
                From Date
              </label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="toDate" className="text-sm font-medium">
                To Date
              </label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Incident Type
              </label>
              <Select value={incidentType} onValueChange={setIncidentType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {Object.values(AccidentType).map((accidentType) => (
                    <SelectItem key={accidentType} value={accidentType}>
                      {accidentType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="classification" className="text-sm font-medium">
                Classification
              </label>
              <Select value={incidentClassification} onValueChange={setIncidentClassification}>
                <SelectTrigger>
                  <SelectValue placeholder="All Classifications" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classifications</SelectItem>
                  {Object.values(IncidentClassification).map((classType) => (
                    <SelectItem key={classType} value={classType}>
                      {classType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              className="bg-btn-cancel hover:bg-btn-cancel-hover text-btn-cancel-fg" 
              onClick={onClose}
            >
              Cancel
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