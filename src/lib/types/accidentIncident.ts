import { Project } from "./project";
import { Gender,AccidentType,DocumentStatus } from "../helpers/enum";
import { Contact } from "./contact";



export enum IncidentClassification {
  CONTACT_MACHINERY = "Contact with moving machinery",
  STRUCK_OBJECT = "Struck by moving or falling object",
  STRUCK_VEHICLE = "Struck by a moving vehicle",
  IMPACT_FIXED = "Impact with something fixed or stationery",
  MANUAL_HANDLING = "Manual handling",
  SLIP_TRIP_FALL = "Slip, trip or fall",
  TRAPPED = "Trapped",
  DROWNING_ASPHYXIATION = "Drowning or asphyxiation",
  COSHH = "Coshh",
  FIRE_EXPLOSION = "Fire or Explosion",
  ELECTRICAL = "Electrical",
  OTHER = "Other"
}

export enum PersonAction {
  RETURN_TO_WORK = "Return to work",
  GO_HOME = "Go home",
  GO_TO_GP = "Go to GP",
  GO_TO_HOSPITAL = "Go to Hospital"
}

export interface AccidentIncidentReport extends Record<string, unknown> {
  _id?: string;
  project: Project;
  reportedDate: string;
  injuredPerson:{
    fullName?:string;   
    dob?:string;
    address?:string;
    sex?:Gender;
    age?:number;
    contactType?:string;
    otherEmployerDetails?: string;
  };
  incidentDetails: {
    incidentType: AccidentType;
    firstAidAdministered: boolean;
    firstAidAdministeredBy?: string;
    injuryDetails?: string;
    firstAiderAdvice?: string;
    personAction?: PersonAction;
    activityAtTimeOfIncident: string;
    incidentDescription: string;
    witnesses?: string;
    relevantConditions?: string;
    manualHandlingDetails?: string;
    immediateCause?: string;
    underlyingCause?: string;
    statementProvided: boolean;
    photosTaken: boolean;
    riskAssessmentReviewed?: string;
    immediateActions?: string;
    plannedActions?: string;
  };
  reportingPerson: {
    name: string;
    contactDetails: string;
  };
  receiptDetails?: {
    name: string;
    date: string;
    hseInformed: boolean;
    referenceNumber?: string;
    submissionDate?: string;
    incidentClassification: IncidentClassification;
    otherClassificationDetails?: string;
  };
  documentStatus: DocumentStatus;
}

export interface AccidentIncidentFilters {
  search?: string;
  fromDate?: string;
  toDate?: string;
  incidentType?: string;
  classification?: IncidentClassification;
}

export interface AccidentIncidentActionState {
  success: boolean;
  data?: AccidentIncidentReport | AccidentIncidentReport[] | null;
  message?: string;
  error?: string | Record<string, string[]>;
  pending?: boolean;
}