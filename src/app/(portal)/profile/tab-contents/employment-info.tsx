import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ContactType } from "@/lib/types/contact";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TabContentProps } from "@/lib/types/profile";

export const EmploymentInfo: React.FC<TabContentProps> = ({ 
  formState, 
  errors, 
  getInputProps,
  getSelectProps 
}) => (
  <Card>
    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input {...getInputProps("jobTitle")} required={false} />
        {errors.jobTitle && <p className="text-sm text-red-500">{errors.jobTitle[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input {...getInputProps("company")} required={false} />
        {errors.company && <p className="text-sm text-red-500">{errors.company[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactType">Contact Type</Label>
        <Select {...getSelectProps("contactType")}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ContactType.EMPLOYEE}>Employee</SelectItem>
            <SelectItem value={ContactType.CONTRACTOR}>Contractor</SelectItem>
          </SelectContent>
        </Select>
        {errors.contactType && <p className="text-sm text-red-500">{errors.contactType[0]}</p>}
      </div>
      <div className="col-span-2 space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea {...getInputProps("notes")} required={false} />
        {errors.notes && <p className="text-sm text-red-500">{errors.notes[0]}</p>}
      </div>
    </CardContent>
  </Card>
);