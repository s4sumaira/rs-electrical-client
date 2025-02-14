import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TabContentProps } from "@/lib/types/profile";
import { formatUKDate } from "@/lib/utils";

export const PersonalInfo: React.FC<TabContentProps> = ({ 
  formState, 
  errors, 
  getInputProps 
}) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUKDate(e.target.value);
    e.target.value = formatted;
    getInputProps("birthDate").onChange(e);
  };

  const handleNINumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    e.target.value = formatted;
    getInputProps("ninumber").onChange(e);
  };

  return (
    <Card>
      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input {...getInputProps("firstName")} required />
          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input {...getInputProps("lastName")} required />
          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate">Birth Date</Label>
          <Input 
            {...getInputProps("birthDate")}
            onChange={handleDateChange}
            placeholder="DD/MM/YYYY"
            maxLength={10}
            required={false}
          />
          {errors.birthDate && <p className="text-sm text-red-500">{errors.birthDate[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="ninumber">NI Number</Label>
          <Input 
            {...getInputProps("ninumber")}
            maxLength={9}
            placeholder="AB123456C"
            onChange={handleNINumberChange}
            required={false}
          />
          {errors.ninumber && <p className="text-sm text-red-500">{errors.ninumber[0]}</p>}
        </div>
      </CardContent>
    </Card>
  );
};