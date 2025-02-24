import { Project } from "./project";
import { DocumentStatus } from "../helpers/enum";

export interface CheckItem {
  status: boolean;
  details?: string;
}

interface InspectionCompletion {
  inspectorName: string;
  signature:string;
  signedDate?: Date;
}

export interface WeeklyCheck extends Record<string, unknown>{
  _id?: string;
  project: Project;
  jobNumber:string;
  date:string;
  supplier:string;
  makeModel:string;
  wheelLugs?: CheckItem;
  batteryCondition?: CheckItem;
  warningStickers?: CheckItem;
  hosesAndFittings?: CheckItem;
  groundControls?: CheckItem;
  lanyardAnchorage?: CheckItem;
  controlsFunctions?: CheckItem;
  liftingAccessories?: CheckItem;
  scrubberCondition?: CheckItem;
  inspectionCompletion?: InspectionCompletion;
  documentStatus?:DocumentStatus;
}

export interface InspectionActionState {
  success: boolean;
  data?: WeeklyCheck | WeeklyCheck[] |null;
  message?:string;
  error?: string | Record<string, string[]>;
  pending?: boolean,
}

export interface InspectionFilters {
  search?: string
  jobNumber?: string  
  supplier?:string  
  makeModel?:string
  date?:string
}
