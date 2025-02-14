import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface FilterModalProps {
  onApply: (filters: { projectName: string; inductedBy: string; supervisedBy: string; createdAt: string }) => void;
  onClose: () => void;
  initialFilters: { projectName: string; inductedBy: string; supervisedBy: string; createdAt: string };
}

export function FilterModal({ onApply, onClose, initialFilters }: FilterModalProps) {
  const [projectName, setProjectName] = useState(initialFilters.projectName);
  const [inductedBy, setInductedBy] = useState(initialFilters.inductedBy);
  const [supervisedBy, setSupervisedBy] = useState(initialFilters.supervisedBy);
  const [createdAt, setCreatedAt] = useState(initialFilters.createdAt);

  const handleApply = () => {
    onApply({ projectName, inductedBy, supervisedBy, createdAt });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="projectName" className="text-sm font-medium">Project Name</label>
        <Input
          id="projectName"
          type="text"
          placeholder="Filter by Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="inductedBy" className="text-sm font-medium">Inducted By</label>
        <Input
          id="inductedBy"
          type="text"
          placeholder="Filter by Inducted By"
          value={inductedBy}
          onChange={(e) => setInductedBy(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="supervisedBy" className="text-sm font-medium">Supervised By</label>
        <Input
          id="supervisedBy"
          type="text"
          placeholder="Filter by Supervised By"
          value={supervisedBy}
          onChange={(e) => setSupervisedBy(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="createdAt" className="text-sm font-medium">Created At</label>
        <Input
          id="createdAt"
          type="date"
          value={createdAt}
          onChange={(e) => setCreatedAt(e.target.value)}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button className="bg-btn-cancel hover:bg-btn-cancel-hover text-btn-cancel-fg" onClick={onClose}>
          Discard
        </Button>
        <Button className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg" onClick={handleApply}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
