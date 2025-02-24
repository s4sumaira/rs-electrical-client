import { z } from "zod";

const dailyCheckItemSchema = z.object({
  status: z.boolean(),
  details: z.string().optional()
}).refine((data) => {
  return data.status === true || (data.status === false && data.details?.trim() !== "");
}, {
  message: "Details are required when status is false",
  path: ["details"],
});

const dailyInspectionDaySchema = z.object({
  generalCondition: dailyCheckItemSchema,
  brakes: dailyCheckItemSchema,
  tyres: dailyCheckItemSchema,
  coolantLubricant: dailyCheckItemSchema,
  pinsLockingDevices: dailyCheckItemSchema,
  hydraulicLeaks: dailyCheckItemSchema,
  stabilisersRiggers: dailyCheckItemSchema,
  controlInstrument: dailyCheckItemSchema,
  alarms: dailyCheckItemSchema,
  accessGate: dailyCheckItemSchema,
  coolantLubricant2: dailyCheckItemSchema,
  wheelCovers: dailyCheckItemSchema,
});

export const dailyInspectionFormSchema = z.object({
  project: z.object({
    _id: z.string().min(1, "Project selection is required"),
  }),
  jobNumber: z.string().min(1, "Job number is required"),
  makeModel: z.string().min(1, "Make & Model is required"),
  supplier: z.string().min(1, "Supplier/Hirer is required"),
  weekStartDate: z.string().min(1, "Week start date is required"),
  
  monday: dailyInspectionDaySchema,
  tuesday: dailyInspectionDaySchema,
  wednesday: dailyInspectionDaySchema,
  thursday: dailyInspectionDaySchema,
  friday: dailyInspectionDaySchema,
  saturday: dailyInspectionDaySchema,
  sunday: dailyInspectionDaySchema,

  inspectorName: z.string().min(1, "Inspector name is required"),
  documentStatus: z.enum(["SUBMITTED", "APPROVED", "REJECTED"]).optional(),
});