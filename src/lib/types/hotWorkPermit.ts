import { Project } from "./project";
import { DocumentStatus } from "../helpers/enum";
import { Contact } from "./contact";
import { StatusValues } from "../helpers/enum";


interface SignatureInfo {
  name?: string;
  position?: string;
  signature?: string;
  date?: Date;
}

export interface WorkIncludes{
  brazing:boolean;
  torchCutting:boolean;
  grinding:boolean;
  soldering:boolean;
  welding:boolean;
}

export interface HotWorkPermit extends Record<string, unknown>{
  _id?: string;
  project: Project;
  companyName: string;
  location: string;
  jobNumber: string;
  supervisor?: Contact;
  permitNumber?: string;
  equipmentUsed: string;
  startTime: string;
  endTime: string;
  dateOfWorks: string;

  // work Includes 
  workIncludes :WorkIncludes;
  
  // Precautions checklist
  ceaseBeforeShiftEnd: StatusValues;
  servicesIsolated: StatusValues;
  smokeDetectorsIsolated: StatusValues;
  fireExtinguisherAvailable: StatusValues;
  ppeProvided: StatusValues;
  cylindersSecured: StatusValues;
  valvesCondition: StatusValues;
  flashbackArrestors: StatusValues;
  cylindersStorage: StatusValues;
  lpgStorage: StatusValues;
  weldingStandards: StatusValues;
  spentRodsImmersed: StatusValues;
  areaCleanAndTidy: StatusValues;
  riserShaftSafety: StatusValues;
  postWorkInspection: StatusValues;
  
  // Operator requirements
  understandPermit: StatusValues;
  possessPermit: StatusValues;
  stopWorkIfRequired: StatusValues;
  reportHazards: StatusValues;
  ensureAccess: StatusValues;

  // Signatures
  contractorConfirmation: SignatureInfo;
  operatorConfirmation?: SignatureInfo;
  managementAuthorization?: SignatureInfo;
  operatorCancellation?: SignatureInfo;
  managementCancellation?: SignatureInfo;
  finalInspection?: SignatureInfo & {
    completedAfterHours: string;
  };
  
  documentStatus: DocumentStatus;
}

export interface PermitFilters {
  search?: string;
  jobNumber?: string;
  companyName?: string;
  dateOfWorks?: string;
  permitNumber?: string;

}

export interface PermitActionState {
  success: boolean;
  data?: HotWorkPermit | HotWorkPermit[] | null;
  message?: string;
  error?: string | Record<string, string[]>;
  pending?: boolean;
}