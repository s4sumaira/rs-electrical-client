// types/heightPermit.ts

import { DocumentStatus } from "../helpers/enum";

export interface Equipment {
  stepLadders: boolean;
  mobileScaffold: boolean;
  extensionLadder: boolean;
  mewp: boolean;
  correctFootwear: boolean;
  edgeProtection: boolean;
  safetyNet: boolean;
  ropesHarnesses: boolean;
  otherEquipment?: string;
}

export interface Services {
  smokeDetectors: boolean;
  pipesTanks: boolean;
  electricalOutlets: boolean;
  otherServices?: string;
}

export interface ControlMeasures {
  barriers: boolean;
  banksman: boolean;
  signage: boolean;
  otherMeasures?: string;
}

export interface Environmental {
  weather: boolean;
  groundConditions: boolean;
  storedMaterials: boolean;
  otherEnvironmental?: string;
}

export interface Authorization {
  issuedToName: string;
  issuedToSignature: string;
  issuedToDate: string;
  issuedByName: string;
  issuedBySignature: string;
  issuedByDate: string;
}

export interface HeightPermit extends Record<string, unknown> {
  _id?: string;
  permitNumber: string;
  date: string;
  site: string;
  location: string;
  contractor: string;
  phoneNumber: string;
  validFrom: string;
  validFromTime: string;
  validTo: string;
  validToTime: string;
  descriptionOfWorks: string;
  equipment: Equipment;
  services: Services;
  controlMeasures: ControlMeasures;
  environmental: Environmental;
  authorization: Authorization;
  documentStatus: DocumentStatus;
}

export interface PermitFilters {
  search?: string;
  permitNumber?: string;
  site?: string;
  contractor?: string;
  date?: string;
}

export interface PermitActionState {
  success: boolean;
  data?: HeightPermit | HeightPermit[] | null;
  message?: string;
  error?: string | Record<string, string[]>;
  pending?: boolean;
}