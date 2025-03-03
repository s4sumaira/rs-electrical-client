import { z } from "zod"

export const createUserFormSchema = z
  .object({
    id: z.string().optional().transform(val => val?.trim() === "" ? undefined : val),
    name: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(50, "Username must not exceed 50 characters"),
    email: z.string().email("Invalid email address"),   
    password: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val)) 
    .refine(
      (val) => !val || val.length >= 8,
      { message: "Password must be at least 8 characters long" }
    )
    .refine(
      (val) => !val || /[A-Z]/.test(val), 
      { message: "Password must contain at least one uppercase letter" }
    )
    .refine(
      (val) => !val || /[a-z]/.test(val), 
      { message: "Password must contain at least one lowercase letter" }
    )
    .refine(
      (val) => !val || /[0-9]/.test(val),
      { message: "Password must contain at least one number" }
    ),    
    role:  z.string().min(1, "Please select role"),  
    contact: z.string().min(1, "Contact ID is required"),
    isActive: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === "boolean") return val // Keep boolean values as they are
      if (typeof val === "string") return val.toLowerCase() === "true" // Convert string to boolean
      return undefined // If undefined or empty, keep it undefined
    }),
    lastLogin: z.date().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })





  export const updateUserFormSchema = z
  .object({  
    name: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(50, "Username must not exceed 50 characters"),
    email: z.string().email("Invalid email address"),  
    password: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val)) 
    .optional()
    .refine(
      (val) => !val || val.length >= 8, 
      { message: "Password must be at least 8 characters long" }
    )
    .refine(
      (val) => !val || /[A-Z]/.test(val), 
      { message: "Password must contain at least one uppercase letter" }
    )
    .refine(
      (val) => !val || /[a-z]/.test(val), 
      { message: "Password must contain at least one lowercase letter" }
    )
    .refine(
      (val) => !val || /[0-9]/.test(val), 
      { message: "Password must contain at least one number" }
    ),  
    role: z.string().min(1, "Please select a valid role"),
    // role: z.object({
    //   _id: z.string().min(1, "Role selection is required")
    // }),      
   
    contact: z.string().min(1, "Contact ID is required"),
    isActive: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === "boolean") return val // Keep boolean values as they are
      if (typeof val === "string") return val.toLowerCase() === "true" // Convert string to boolean
      return undefined // If undefined or empty, keep it undefined
    }),
    lastLogin: z.date().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
 
