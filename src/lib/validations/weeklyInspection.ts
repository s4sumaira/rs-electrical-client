import { z } from "zod";

// Helper function to validate CheckItem
// const checkItemSchema = z.object({
//   status: z.enum(["YES", "NO"]),
//   details: z.string().optional().or(
//     z.string().min(1, "Details are required when status is No")
//   ),
// }).refine(data => data.status === "NO"  && data.details== "", {
//   message: "Details are required when status is No",
//   path: ["details"],
// });

const checkItemSchema = z.object({
  status: z.enum(["YES", "NO"]),
  details: z.string().optional(), // details is optional by default
}).refine((data) => {
  // Check if status is "NO", then ensure details is filled (not empty or undefined)
  return data.status === "YES" || (data.status === "NO" && data.details?.trim() !== "");
}, {
  message: "Details are required when status is 'NO'",
  path: ["details"],
});

export const weeklyInspectionFormSchema = z.object({
  project: z.object({
     _id: z.string().min(1, "Project selection is required"),
   }),
  jobNumber: z.string().min(1, "Job number is required"),
  date: z.string().min(1, "Date is required"),
  supplier: z.string().min(1, "Supplier/Hirer is required"),
  makeModel: z.string().min(1, "Make & Model is required"),
  
  // Apply checkItemSchema to all CheckItem fields
  wheelLugs: checkItemSchema,
  batteryCondition: checkItemSchema,
  warningStickers: checkItemSchema,
  hosesAndFittings: checkItemSchema,
  groundControls: checkItemSchema,
  lanyardAnchorage: checkItemSchema,
  controlsFunctions: checkItemSchema,
  liftingAccessories: checkItemSchema,
  scrubberCondition: checkItemSchema,

  // Inspection completion validation
  inspectorName: z.string().min(1, "Completed by is required"),
  signature: z.string().min(1, "Signature is required"),
  signedDate: z.string().optional(),
});
