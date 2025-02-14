import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TabContentProps } from "@/lib/types/profile";

export const ContactInfo: React.FC<TabContentProps> = ({ 
    formState, 
    errors, 
    getInputProps 
  }) => (
    <Card>
      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input type="email" {...getInputProps("email")} required />
          {errors.email && <p className="text-sm text-red-500">{errors.email[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input type="tel" {...getInputProps("phone")} required={false} />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="street">Street</Label>
          <Input {...getInputProps("street")} required={false} />
          {errors.street && <p className="text-sm text-red-500">{errors.street[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input {...getInputProps("city")} required={false} />
          {errors.city && <p className="text-sm text-red-500">{errors.city[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="postCode">Post Code</Label>
          <Input {...getInputProps("postCode")} required={false} />
          {errors.postCode && <p className="text-sm text-red-500">{errors.postCode[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="county">County</Label>
          <Input {...getInputProps("county")} required={false} />
          {errors.county && <p className="text-sm text-red-500">{errors.county[0]}</p>}
        </div>
      </CardContent>
    </Card>
  );