import * as z from "zod"
import { ContactType } from "@/lib/types/contact"

export const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(11,"Please fill a valid phone number."),
  company: z.string().min(3,"Company name is required."),
  jobTitle: z.string().min(3,"Job title must be entered."),
  contactType: z.nativeEnum(ContactType),
  notes: z.string().optional(),
  ninumber: z.string().optional(),
  birthDate: z.string().optional(),
  isActive: z.boolean().default(true),
  street: z.string().optional(),
    city: z.string().optional(),
    county: z.string().optional(),
    postCode: z.string().optional(),
    country: z.string().optional(),
  // address: z.object({
  //   street: z.string().optional(),
  //   city: z.string().optional(),
  //   county: z.string().optional(),
  //   postalCode: z.string().optional(),
  //   country: z.string().optional(),
  // }).optional(),
  //profileImage: z.string().url("Invalid URL").optional(),
  documents:z.array( z.object({
          name: z.string().optional(),
          // description: z.string().optional(),
          // url: z.string().url("Invalid URL").optional(),
        })).optional(),
  files:z.array( z.object({
    name: z.string().optional(),
    // description: z.string().optional(),
    // url: z.string().url("Invalid URL").optional(),
  })).optional(),
  
  

})

export type ContactFormValues = z.infer<typeof contactFormSchema>

