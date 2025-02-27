// types/heightPermit.ts

import { DocumentStatus } from "../helpers/enum";
import { Project } from "./project";

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

export interface ConfirmationStatus{
  issuedTo?: boolean,
  issuedBy?: boolean,
  cancelledBy?:boolean,
  signedOffBy?:boolean

}

export interface Authorization {
  issuedToName: string;
  issuedToSignature: string;
  issuedToDate: string;
  issuedByName: string;
  issuedBySignature: string;
  issuedByDate: string;
}

export interface CancellationOrCompletion {
  cancelledByName?: string;
  cancelledBySignature?: string;
  cancelledByDate?: string;
  cancellationReason?: string; 
  cancellationDate?: string;
  cancellationTime?: string;
}

export interface FinalSignOff{
  signedOffByName:string;
  signedOffBySignature:string;
  signedOffByDate:string;
}

export interface HeightPermit extends Record<string, unknown> {
  _id?: string;
  permitNumber?: string;
  issueDate?:string;
  lastReviewedDate?:string;
  nextReviewDate?:string;
  date: string;
  project: Project;
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
  confirmationStatus:ConfirmationStatus;
  authorization: Authorization;
  cancellation:CancellationOrCompletion;
  finalSignOff:FinalSignOff;
  documentStatus: DocumentStatus;
}

export interface PermitFilters {
  search?: string;
  permitNumber?: string;
  project?: string;
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