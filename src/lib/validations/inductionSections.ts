// lib/validations/inductionSections.ts
import * as z from "zod"

// 1. Project Details Section Schema
export const projectDetailsSchema = z.object({
  project: z.object({
    _id: z.string().min(1, "Project selection is required"),
  }),
  inductedBy: z.object({
    _id: z.string().min(1, "InductedBy selection is required"),  
  }),
  supervisedBy: z.object({
    _id: z.string().min(1, "SupervisedBy selection is required"),  
  }),
})

// 2. Personal Information Section Schema

export const personalInfoSchema = z.object({
  
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone is required"),
  company: z.string().min(1, "Company is required"),
  trade: z.string().min(1, "Trade is required"),
  emergencyContact: z.object({
        name: z.string().min(1, "Emergency contact name is required"),
        phoneNumber: z.string().min(1, "Emergency contact phone is required")
          .regex(/^[\d\s+()-]+$/, "Please enter a valid phone number"),
      }),
  rightToWorkInUK: z.boolean(),
  rightToWorkDetails: z.string().optional(),
}).superRefine((data, ctx) => {
  if (!data.rightToWorkInUK && (!data.rightToWorkDetails || data.rightToWorkDetails.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['rightToWorkDetails'],
      message: "Please provide details about your right to work status",
    });
  }
});



// 3. Emergency Contact Section Schema
// export const emergencyContactSchema = z.object({
//   emergencyContact: z.object({
//     name: z.string().min(1, "Emergency contact name is required"),
//     phoneNumber: z.string().min(1, "Emergency contact phone is required")
//       .regex(/^[\d\s+()-]+$/, "Please enter a valid phone number"),
//   }),
// })

// 3. Occupational Health Section Schema
export const occupationalHealthSchema = z.object({
  occupationalHealth: z.object({
    hasCondition: z.boolean(),
    epilepsy: z.boolean().optional(),
    deafness: z.boolean().optional(),
    asthma: z.boolean().optional(),
    heartConditions: z.boolean().optional(),
    details: z.string().optional(),
    requiresMedication: z.boolean(),
    medicationDetails: z.string().optional(),
    nightWorkAssessment: z.boolean(),
  }).refine(
    (data) => {
      // If has condition is true, require at least one condition
      if (data.hasCondition) {
        return data.epilepsy || data.deafness || data.asthma || data.heartConditions;
      }
      return true;
    },
    { message: "Please select at least one medical condition" }
  ).refine(
    (data) => {
      // If has condition is true, require details
      if (data.hasCondition) {
        return data.details && data.details.length > 0;
      }
      return true;
    },
    { message: "Medical condition details are required when conditions are present" }
  ).refine(
    (data) => {
      // If requires medication is true, require medication details
      if (data.requiresMedication) {
        return data.medicationDetails && data.medicationDetails.length > 0;
      }
      return true;
    },
    { message: "Medication details are required when medication is needed" }
  ),
})

// 4. Compliance Section Schema
export const complianceSchema = z.object({
  compliance: z.object({
    // CSCS Card
    hasCSCSCard: z.boolean(),
    cardType: z.string().optional(),
    cardNumber: z.string().optional(),
    
    // Asbestos Awareness
    hasAsbestosAwareness: z.boolean(),
    asbestosCompletionDate: z.string().optional(),    
    
    // Other Qualifications
    hasOtherQualifications: z.boolean(),
    otherQualificationsDetails: z.string().optional(),
    
    // Under 18
    isUnder18: z.boolean(),
    under18Details: z.string().optional(),
  }).superRefine((data, ctx) => {
    // CSCS Card Validation
    if (data.hasCSCSCard) {
      if (!data.cardType || data.cardType.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Card type is required when CSCS card is held",
          path: ['cardType'],
        });
      }
      if (!data.cardNumber || data.cardNumber.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Card number is required when CSCS card is held",
          path: ['cardNumber'],
        });
      }
    }

    // Asbestos Awareness Validation
    if (!data.hasAsbestosAwareness && !data.asbestosCompletionDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify when you will complete the Asbestos Awareness Certificate",
        path: ['asbestosCompletionDate'],
      });
    }

    // Other Qualifications Validation
    if (data.hasOtherQualifications && (!data.otherQualificationsDetails || data.otherQualificationsDetails.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide details of your other qualifications",
        path: ['otherQualificationsDetails'],
      });
    }

    // Under 18 Validation
    if (data.isUnder18 && (!data.under18Details || data.under18Details.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide mentor and risk assessment details",
        path: ['under18Details'],
      });
    }
  })
});

// 5. Documents Section Schema
export const documentsSchema = z.object({

  documents:z.array( z.object({
    _id:z.string(),
    isSelected: z.boolean(),  

  })).optional(),
  
  })
  

// 6. Risk Assessment Section Schema
export const riskAssessmentSchema = z.object({
  riskAssessment: z.object({
    briefed: z.boolean(),
    understood: z.boolean(),
  }).refine(
    (data) => data.briefed === true,
    { message: "You must be briefed on the risk assessment" }
  ).refine(
    (data) => data.understood === true,
    { message: "You must confirm understanding of the risk assessment" }
  ),
})




// 7. Confirmation Section Schema
export const confirmationSchema = z.object({
  inductionCompleted: z.boolean(),
  confirmation: z.object({
    signature: z.string().min(1, "Please provide your signature"),
    signedAt: z.date()
  }).optional()
}).superRefine((data, ctx) => {

 if (!data.inductionCompleted) {
    
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Your confirmation is required for submission, please tick the checkbox",
      path: ['inductionCompleted']
    });
  
}

  if (data.inductionCompleted) {
    if (!data.confirmation?.signature) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Signature is required to complete the induction",
        path: ['confirmation', 'signature']
      });
    }
  }
 
});

// Full schema array
export const sectionSchemas = [
  projectDetailsSchema,
  personalInfoSchema,
  occupationalHealthSchema,
  complianceSchema,
  documentsSchema,
  riskAssessmentSchema, 
  confirmationSchema,
] as const




