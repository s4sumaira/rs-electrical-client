import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import type { SiteInduction } from "@/lib/types/induction"
import { useEffect, useState } from "react"
import { getLoggedInUserContact } from "@/app/actions/contactActions"
import type { Contact } from "@/lib/types/contact"

interface SectionProps {
  formState: Partial<SiteInduction>
  errors: Partial<Record<keyof SiteInduction, string[]>>
  getInputProps: (name: keyof SiteInduction) => any
  getSelectProps: (name: keyof SiteInduction) => any
  setFormState: React.Dispatch<React.SetStateAction<SiteInduction>>
}

export function PersonalInfoSection({ formState, errors, getInputProps, setFormState }: SectionProps) {

  const [contact,setContact] = useState<Contact | null>(null)
  
 

  useEffect(() => {

    const fetchContact = async () => {
      const result = await getLoggedInUserContact();
      
      if (result.success && result.data) {
        setContact(result.data);
        
        const contact :Contact = result.data;
        
        setFormState((prevState) => ({
          ...prevState,
          inductedPerson: {
            ...prevState.inductedPerson,
            _id: contact._id,
          }
        }));
        setFormState((prevState) => ({
          ...prevState,
          fullName: contact.fullName,
          phone: contact.phone,
          company: contact.company,
        }));

      } else {
        console.log(result.error || 'Failed to load contact.');
      }
    };  

    if (!formState._id){
    fetchContact();
    }

  }, []);

  return (
    <div className="space-y-6">
      <Card> 
        <CardContent className="space-y-6">
        <div className="space-y-4">       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              {...getInputProps("fullName")}
              required={true}
            />
            {errors["fullName"] && (
              <p className="text-sm text-red-500">{errors["fullName"][0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
                id="phone"
                {...getInputProps("phone")}
                //onChange={handlePhoneChange}
                placeholder="+44 XXX XXXX XXXX"
                className="w-full"
              />
            {errors["phone"] && <p className="text-sm text-red-500">{errors["phone"][0]}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4">       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              {...getInputProps("company")}
              aria-describedby={errors["company"] ? "fullName-error" : undefined}
            />
            {errors["company"] && (
              <p className="text-sm text-red-500">{errors["company"][0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="trade">Trade</Label>
            <Input {...getInputProps("trade")} />
            {errors["trade"] && <p className="text-sm text-red-500">{errors["trade"][0]}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
            <Input
              {...getInputProps("emergencyContact.name")}
              // onChange={(e) =>
              //   setFormState((prev) => ({
              //     ...prev,
              //     emergencyContact: { ...prev.emergencyContact, name: e.target.value },
              //   }))
              // }
            />
            {errors["emergencyContact.name"] && (
              <p className="text-sm text-red-500">{errors["emergencyContact.name"][0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
            <Input
              {...getInputProps("emergencyContact.phoneNumber")}
               placeholder="+44 XXX XXXX XXXX"
              // onChange={(e) =>
              //   setFormState((prev) => ({
              //     ...prev,
              //     emergencyContact: { ...prev.emergencyContact, phoneNumber: e.target.value },
              //   }))
              // }
            />
            {errors["emergencyContact.phoneNumber"] && (
              <p className="text-sm text-red-500">{errors["emergencyContact.phoneNumber"][0]}</p>
            )}
          </div>
        </div>

       </div>
      </CardContent>
      </Card>
      
      <Card className="border-0">
        <CardHeader className="py-2">
          <h3 className="text-center font-semibold">Right to work in the UK</h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-[1fr,auto,auto]">
            <div className="p-4">
              <p>Do you have the right to work in the UK?</p>
            </div>
            <div className=" p-4 min-w-[100px] flex items-center justify-center">
              <RadioGroup
                value={formState.rightToWorkInUK ? "yes" : "no"}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    rightToWorkInUK: value === "yes",
                    rightToWorkDetails: value === "yes" ? "" : prev.rightToWorkDetails,
                  }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
              </RadioGroup>
            </div>
            <div className=" p-4 min-w-[100px] flex items-center justify-center">
              <RadioGroup
                value={formState.rightToWorkInUK ? "yes" : "no"}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    rightToWorkInUK: value === "yes",
                    rightToWorkDetails: value === "yes" ? "" : prev.rightToWorkDetails,
                  }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          {!formState.rightToWorkInUK && (
            <div className="p-4">
              <Label htmlFor="rightToWorkDetails">If No, please detail</Label>
              <Textarea
                id="rightToWorkDetails"
                className="mt-2"
                {...getInputProps("rightToWorkDetails")}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    rightToWorkDetails: e.target.value,
                  }))
                }
              />
              {errors.rightToWorkDetails && <p className="text-sm text-red-500">{errors.rightToWorkDetails[0]}</p>}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="text-sm text-muted-foreground">
          All fields are required.
        </div>
    </div>
  )
}

