// validations/heightPermit.ts

import { z } from "zod";

const equipmentSchema = z.object({
  stepLadders: z.boolean(),
  mobileScaffold: z.boolean(),
  extensionLadder: z.boolean(),
  mewp: z.boolean(),
  correctFootwear: z.boolean(),
  edgeProtection: z.boolean(),
  safetyNet: z.boolean(),
  ropesHarnesses: z.boolean(),
  otherEquipment: z.string().optional()
}).refine(data => 
  Object.values(data).some(value => value === true || (typeof value === 'string' && value.length > 0)),
  { message: "At least one equipment option must be selected" }
);

const servicesSchema = z.object({
  smokeDetectors: z.boolean(),
  pipesTanks: z.boolean(),
  electricalOutlets: z.boolean(),
  otherServices: z.string().optional()
});

const controlMeasuresSchema = z.object({
  barriers: z.boolean(),
  banksman: z.boolean(),
  signage: z.boolean(),
  otherMeasures: z.string().optional()
}).refine(data => 
  Object.values(data).some(value => value === true || (typeof value === 'string' && value.length > 0)),
  { message: "At least one control measure must be selected" }
);

const environmentalSchema = z.object({
  weather: z.boolean(),
  groundConditions: z.boolean(),
  storedMaterials: z.boolean(),
  otherEnvironmental: z.string().optional()
});

const authorizationSchema = z.object({
  issuedToName: z.string().min(1, "Name is required"),
  issuedToSignature: z.string().min(1, "Signature is required"),
  issuedToDate: z.string().min(1, "Date is required"),
  issuedByName: z.string().min(1, "Name is required"),
  issuedBySignature: z.string().min(1, "Signature is required"),
  issuedByDate: z.string().min(1, "Date is required")
});

export const heightPermitFormSchema = z.object({
  permitNumber: z.string().min(1, "Permit number is required"),
  date: z.string().min(1, "Date is required"),
  site: z.string().min(1, "Site is required"),
  location: z.string().min(1, "Location is required"),
  contractor: z.string().min(1, "Contractor name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  validFrom: z.string().min(1, "Valid from date is required"),
  validFromTime: z.string().min(1, "Valid from time is required"),
  validTo: z.string().min(1, "Valid to date is required"),
  validToTime: z.string().min(1, "Valid to time is required"),
  descriptionOfWorks: z.string().min(1, "Description of works is required"),
  equipment: equipmentSchema,
  services: servicesSchema,
  controlMeasures: controlMeasuresSchema,
  environmental: environmentalSchema,
  authorization: authorizationSchema
});