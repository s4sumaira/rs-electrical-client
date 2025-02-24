  import { z } from "zod";
  import { StatusValues } from "../helpers/enum"; 

  const signatureInfoSchema = z.object({
    name: z.string().optional(),
    position: z.string().optional(),
    signature: z.string().optional(),
    date: z.string().optional()
  })

  const optionalSignatureInfoSchema = z.object({
    name: z.string().optional(),
    position: z.string().optional(),
    signature: z.string().optional(),
    date: z.string().optional()
  }).superRefine((data, ctx) => {
    const { name, position, signature, date } = data;
    // Check if all fields are empty (meaning user left it blank)
    const isEmpty = [name, position, signature, date].every(
      (field) => !field || field.trim() === ""
    );
    // Check if all fields are filled in
    const isComplete = [name, position, signature, date].every(
      (field) => field && field.trim() !== ""
    );
    if (!isEmpty && !isComplete) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "If any signature field is provided, then all fields are required.",
      });
    }
  });

  // Similar approach for finalInspection, which includes an extra field
  const optionalFinalInspectionSchema = z.object({
    name: z.string().optional(),
    position: z.string().optional(),
    signature: z.string().optional(),
    date: z.string().optional(),
    completedAfterHours: z.string().optional(),
  }).superRefine((data, ctx) => {
    const { name, position, signature, date, completedAfterHours } = data;
    const fields = [name, position, signature, date, completedAfterHours];
    const isEmpty = fields.every((field) => !field || field.trim() === "");
    const isComplete = fields.every((field) => field && field.trim() !== "");
    if (!isEmpty && !isComplete) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "If any final inspection field is provided, then all fields are required.",
      });
    }
  });


  export const hotWorkPermitSchema = z.object({
      project: z.object({
        _id: z.string().min(1, "Project selection is required")
      }),
      companyName: z.string().min(1, "Company name is required"),
      location: z.string().min(1, "Location is required"),
      jobNumber: z.string().min(1, "Job number is required"),
      supervisor: z.object({
        _id: z.string().min(1, "Supervisor selection is required")
      }),
      permitNumber: z.string().optional(),
      equipmentUsed: z.string().min(1, "Equipment details are required"),
      startTime: z.string().min(1, "Start time is required"),
      endTime: z.string().min(1, "End time is required"),
      dateOfWorks: z.string().min(1, "Date of works is required"),
    
      // Precautions checklist validation
      ceaseBeforeShiftEnd: z.nativeEnum(StatusValues),
      servicesIsolated: z.nativeEnum(StatusValues),
      smokeDetectorsIsolated: z.nativeEnum(StatusValues),
      fireExtinguisherAvailable: z.nativeEnum(StatusValues),
      ppeProvided: z.nativeEnum(StatusValues),
      cylindersSecured: z.nativeEnum(StatusValues),
      valvesCondition: z.nativeEnum(StatusValues),
      flashbackArrestors: z.nativeEnum(StatusValues),
      cylindersStorage: z.nativeEnum(StatusValues),
      lpgStorage: z.nativeEnum(StatusValues),
      weldingStandards: z.nativeEnum(StatusValues),
      spentRodsImmersed: z.nativeEnum(StatusValues),
      areaCleanAndTidy: z.nativeEnum(StatusValues),
      riserShaftSafety: z.nativeEnum(StatusValues),
      postWorkInspection: z.nativeEnum(StatusValues),
    
      // Operator requirements validation
      understandPermit: z.nativeEnum(StatusValues),
      possessPermit: z.nativeEnum(StatusValues),
      stopWorkIfRequired: z.nativeEnum(StatusValues),
      reportHazards: z.nativeEnum(StatusValues),
      ensureAccess: z.nativeEnum(StatusValues),
    
      // Signatures validation
      contractorConfirmation: signatureInfoSchema,
      operatorConfirmation: optionalSignatureInfoSchema,
      managementAuthorization: optionalSignatureInfoSchema,
      operatorCancellation: optionalSignatureInfoSchema,
      managementCancellation: optionalSignatureInfoSchema,
      finalInspection: optionalFinalInspectionSchema
    }).refine(
      (data) => {
        const startTime = new Date(`1970-01-01T${data.startTime}`);
        const endTime = new Date(`1970-01-01T${data.endTime}`);
        return endTime > startTime;
      },
      {
        message: "End time must be after start time",
        path: ["endTime"]
      }
    );