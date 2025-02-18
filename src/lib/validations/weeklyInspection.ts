import { z } from "zod";

// Helper function to validate CheckItem
const checkItemSchema = z.object({
  status: z.enum(["yes", "no"]),
  details: z.string().optional().or(
    z.string().min(1, "Details are required when status is No")
  ),
}).refine(data => data.status === "yes" || data.details, {
  message: "Details are required when status is No",
  path: ["details"],
});

export const weeklyInspectionFormSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
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
