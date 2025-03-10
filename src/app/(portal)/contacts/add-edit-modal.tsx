"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Contact, ContactType } from "@/lib/types/contact";
import { createContact, updateContact } from "@/app/actions/contactActions";
import { Loader2 } from "lucide-react";
import { ModalFooter } from "@/components/modal";
import { useForm } from "@/hooks/useForm";
import { SearchableSelect } from "@/components/searchable-select";
import { Card, CardContent } from "@/components/ui/card";
import { formatUKDate } from "@/lib/utils";

interface ContactFormProps {
  onClose: () => void;
  onSuccess?: (data: Contact, message: string) => void;
  onError?: (error: string) => void;
  currentContact: Contact | null;
}

export function ContactForm({ onClose, onSuccess, onError, currentContact }: ContactFormProps) {
  const initialValues: Contact = {
    _id: currentContact?._id ?? "",
    firstName: currentContact?.firstName ?? "",
    lastName: currentContact?.lastName ?? "",
    email: currentContact?.email ?? "",
    phone: currentContact?.phone ?? "",
    jobTitle: currentContact?.jobTitle ?? "",
    contactType: currentContact?.contactType ?? ContactType.EMPLOYEE,
    ninumber: currentContact?.ninumber ?? "",
    birthDate: currentContact?.birthDate ?? "",
      //? new Date(currentContact.birthDate).toLocaleDateString('en-GB').split('/').join('/') : "",
    street: currentContact?.street ?? "",
    city: currentContact?.city ?? "",
    postCode: currentContact?.postCode ?? "",
    county: currentContact?.county ?? "",
    country: currentContact?.country ?? "United Kingdom",
    company: currentContact?.company ?? "",
    notes: currentContact?.notes ?? "",
    isArchived: currentContact?.isArchived ?? false,
  };

  const { formState, errors, isLoading, handleSubmit, getInputProps, getSelectProps } = useForm<Contact>({
    initialValues,
  submitAction: async (state, formData) => {
      return currentContact ? updateContact(state, formData) : createContact(state, formData)
    },   
    onSuccess: (data, message) => {
      onSuccess?.(data, message);
    },
    onError: (error) => {
      onError?.(typeof error === "string" ? error : "Form validation failed");
   
    },
   
    resetOnSuccess: !currentContact,
  });

  // const formatUKDate = (input: string) => {
  //   const digits = input.replace(/\D/g, '');
  //   if (digits.length <= 2) return digits;
  //   if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  //   return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  // };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUKDate(e.target.value);
    e.target.value = formatted;
    getInputProps("birthDate").onChange(e);
  };

  const contactTypeOptions = Object.entries(ContactType).map(([label, value]) => ({
    label: label.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),  // Format label
    value: value
  }))

  return (
    <>
      

      <div className="flex-1 overflow-y-auto px-6">
        <form id="contact-form" action={handleSubmit} className="space-y-6">
          {currentContact && <input type="hidden" name="id" value={currentContact._id} />}

          {/* Personal Information Card */}
          <Card>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    First Name <span className="text-red-500 text-lg font-medium">*</span>
                  </label>
                  <Input {...getInputProps("firstName")} required />
                  {errors.firstName && (
                    <p id="firstName-error" className="text-sm text-red-500">{errors.firstName[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Last Name <span className="text-red-500 text-lg font-medium">*</span>
                  </label>
                  <Input {...getInputProps("lastName")} required />
                  {errors.lastName && (
                    <p id="lastName-error" className="text-sm text-red-500">{errors.lastName[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="birthDate" className="text-sm font-medium">
                    Birth Date
                  </label>
                  <Input
                    {...getInputProps("birthDate")}
                    onChange={handleDateChange}
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                    required={false}
                  />
                  {errors.birthDate && (
                    <p id="birthDate-error" className="text-sm text-red-500">{errors.birthDate[0]}</p>
                  )}
                </div>
              </div>
           
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-red-500 text-lg font-medium">*</span>
                  </label>
                  <Input type="email" {...getInputProps("email")} />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-red-500">{errors.email[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone <span className="text-red-500 text-lg font-medium">*</span>
                  </label>
                  <Input type="tel" {...getInputProps("phone")} />
                  {errors.phone && (
                    <p id="phone-error" className="text-sm text-red-500">{errors.phone[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="ninumber" className="text-sm font-medium">
                    NI Number
                  </label>
                  <Input 
                    {...getInputProps("ninumber")} 
                    maxLength={9}
                    placeholder="AB123456C"
                    required={false}
                    onChange={(e) => {
                      const formatted = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                      e.target.value = formatted;
                      getInputProps("ninumber").onChange(e);
                    }}
                  />
                  {errors.ninumber && (
                    <p id="ninumber-error" className="text-sm text-red-500">{errors.ninumber[0]}</p>
                  )}
                </div>
              </div>
            
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">
                    Company <span className="text-red-500 text-lg font-medium">*</span>
                  </label>
                  <Input {...getInputProps("company")} />
                  {errors.company && (
                    <p id="company-error" className="text-sm text-red-500">{errors.company[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="jobTitle" className="text-sm font-medium">
                    Job Title <span className="text-red-500 text-lg font-medium">*</span>
                  </label>
                  <Input {...getInputProps("jobTitle")} />
                  {errors.jobTitle && (
                    <p id="jobTitle-error" className="text-sm text-red-500">{errors.jobTitle[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="contactType" className="text-sm font-medium">
                    Contact Type
                  </label>
                  <SearchableSelect
                    {...getSelectProps("contactType")}
                    options={contactTypeOptions}
                    placeholder="Select contact type..."
                  />
                  {errors.contactType && (
                    <p id="contactType-error" className="text-sm text-red-500">{errors.contactType[0]}</p>
                  )}
                </div>
              </div>
           
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="street" className="text-sm font-medium">Street</label>
                  <Input {...getInputProps("street")} required={false}/>
                  {errors.street && (
                    <p id="street-error" className="text-sm text-red-500">{errors.street[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">City</label>
                  <Input {...getInputProps("city")} required={false} />
                  {errors.city && (
                    <p id="city-error" className="text-sm text-red-500">{errors.city[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="county" className="text-sm font-medium">County</label>
                  <Input {...getInputProps("county")} required={false} />
                  {errors.county && (
                    <p id="county-error" className="text-sm text-red-500">{errors.county[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="postCode" className="text-sm font-medium">Post Code</label>
                  <Input {...getInputProps("postCode")} required={false}/>
                  {errors.postCode && (
                    <p id="postCode-error" className="text-sm text-red-500">{errors.postCode[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="country" className="text-sm font-medium">Country</label>
                  <Input {...getInputProps("country")} required={false} />
                  {errors.country && (
                    <p id="country-error" className="text-sm text-red-500">{errors.country[0]}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      <ModalFooter>
        <Button type="button" onClick={onClose} className="bg-btn-cancel hover:bg-btn-cancel-hover text-btn-cancel-fg">
          {currentContact ? "Cancel" : "Discard"}
        </Button>

        <Button 
          type="submit"
          form="contact-form"
          disabled={isLoading} 
          className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {currentContact ? "Updating..." : "Creating..."}
            </>
          ) : currentContact ? (
            "Update Contact"
          ) : (
            "Create Contact"
          )}
        </Button>
      </ModalFooter>
    </>
  );
}