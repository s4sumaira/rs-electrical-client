import * as z from "zod";


export const checkInSchema = z.object({
  email: z.string().min(2, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  note: z.string().optional(),
  isOnSite: z
      .union([z.boolean(), z.string()])
      .optional()
      .transform((val) => {
        if (typeof val === "boolean") return val 
        if (typeof val === "string") return val.toLowerCase() === "true" 
        return undefined 
      }),
  
});

export const checkOutSchema = z.object({
  email: z.string().min(2, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  note: z.string().optional(),
  isOnSite: z
  .union([z.boolean(), z.string()])
  .optional()
  .transform((val) => {
    if (typeof val === "boolean") return val 
    if (typeof val === "string") return val.toLowerCase() === "true" 
    return undefined 
  })
});
