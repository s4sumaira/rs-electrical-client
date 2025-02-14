import * as z from "zod"

export const projectFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    
    // For array of IDs with minimum 1 selection
    supervisedBy: z
      .array(z.string())
      .min(1, "At least one supervisor must be selected.")
      .refine((ids) => ids.every((id) => id.length > 0), {
        message: "Invalid supervisor ID detected."
      }),
    
    // For array of IDs with minimum 1 selection
    inductedBy: z
      .array(z.string())
      .min(1, "At least one inductor must be selected.")
      .refine((ids) => ids.every((id) => id.length > 0), {
        message: "Invalid inductor ID detected."
      }),
    
    street: z.string().min(2, "Street must be at least 2 characters."),
    city: z.string().min(2, "City must be at least 2 characters."),
    county: z.string().optional(),
    postCode: z.string().min(2, "Post code must be at least 6 characters."),
    country: z.string().optional(),
  })
  
  // Type inference
  export type Project = z.infer<typeof projectFormSchema>

export type ProjectFormValues = z.infer<typeof projectFormSchema>

