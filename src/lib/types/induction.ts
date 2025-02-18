import { ContactDocument } from "./contact" 

export enum InductionStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    IN_REVIEW = "IN_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
  }
  
  interface Contact {
    _id: string
    fullName?: string
  }

  interface Project {
    _id:string
    name: string
   
  }
  
  
  // Emergency contact is now part of personal information
  interface EmergencyContact {
    name: string
    phoneNumber: string
  }
  
  
  
  interface OccupationalHealth {
    hasCondition: boolean
    epilepsy: boolean
    deafness: boolean
    asthma: boolean
    heartConditions: boolean
    details?: string
    requiresMedication: boolean
    medicationDetails?: string
    nightWorkAssessment?: boolean
  }
  
  interface Compliance {
    hasCSCSCard: boolean
    cardType?: string
    cardNumber?: string
    hasAsbestosAwareness: boolean
    asbestosCompletionDate?: Date
    hasOtherQualifications: boolean
    otherQualificationsDetails?:string
    isUnder18: boolean
    under18Details?: string
  }
  
  interface RiskAssessment {
    briefed: boolean
    understood: boolean
  }
  
  // interface Document {
  //   filename: string
  //   path: string
  //   uploadedAt: Date
  //   type: string
  // }
  
  interface Confirmation {
    signature: string
    signedAt?: Date
  }
  
  export interface SiteInduction extends Record<string, unknown> {
    _id?: string
    inductionNumber: string
    project: Project
    inductedPerson: Contact,
    inductedBy:Contact,
    supervisedBy:Contact,
    emergencyContact: EmergencyContact 
    rightToWorkInUK: boolean
    rightToWorkDetails?: string
    status: InductionStatus
    occupationalHealth: OccupationalHealth
    compliance: Compliance
    riskAssessment: RiskAssessment
    documents?: ContactDocument[] |any[]
    //statusHistory: StatusHistoryEntry[]
    inductionCompleted: boolean
    confirmation?: Confirmation
   createdAt?:string;
  }
  
  // Update the initial state type to match the new structure
  export const initialInductionState: SiteInduction = {
    _id: "",
    status: InductionStatus.SUBMITTED,
    inductionNumber: "",
    project: { _id:"",name: "" },
    inductedPerson: { _id: "", fullName: "" },
    inductedBy:{ _id: "", fullName: ""},
    supervisedBy:{ _id: "", fullName: ""},
    emergencyContact: { name: "", phoneNumber: "" },
    rightToWorkInUK: true,
    rightToWorkDetails: "",
    occupationalHealth: {
      hasCondition: false,
      epilepsy: false,
      deafness: false,
      asthma: false,
      heartConditions: false,
      details:"",
      requiresMedication: false,
      medicationDetails: "",
      nightWorkAssessment:false
    },
    compliance: {
      hasCSCSCard: true,
      hasAsbestosAwareness: false,
      isUnder18: false,
      hasOtherQualifications:false
    },
    riskAssessment: {
      briefed: false,
      understood: false,
    },
    trade:"",
    inductionCompleted: false,
  }
  
  
  export interface SiteInductionFilters {
      search?: string;
      status?: InductionStatus;
      projectName?: string;
      inductionNumber?: string;
      inductedBy?: string;
      inductedPerson?: string;
    }
  