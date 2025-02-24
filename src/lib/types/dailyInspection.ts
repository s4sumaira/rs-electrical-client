import { Project } from "./project";
import { DocumentStatus } from "../helpers/enum";

export interface DailyCheckItem {
  status: boolean;
  details?: string;
}

export interface DailyInspectionDay {
  generalCondition: DailyCheckItem;
  brakes: DailyCheckItem;
  tyres: DailyCheckItem;
  coolantLubricant: DailyCheckItem;
  pinsLockingDevices: DailyCheckItem;
  hydraulicLeaks: DailyCheckItem;
  stabilisersRiggers: DailyCheckItem;
  controlInstrument: DailyCheckItem;
  alarms: DailyCheckItem;
  accessGate: DailyCheckItem;
  coolantLubricant2: DailyCheckItem;
  wheelCovers: DailyCheckItem;
}

export interface DailyInspection extends Record<string, unknown>{
  _id?: string;
  project: Project;
  jobNumber: string;
  makeModel: string;
  supplier: string;
  monday: DailyInspectionDay;
  tuesday: DailyInspectionDay;
  wednesday: DailyInspectionDay;
  thursday: DailyInspectionDay;
  friday: DailyInspectionDay;
  saturday: DailyInspectionDay;
  sunday: DailyInspectionDay;
  inspectorName: string;
  weekStartDate: string;
  documentStatus: DocumentStatus;
}

export interface InspectionActionState {
  success: boolean;
  data?: DailyInspection | DailyInspection[] |null;
  message?:string;
  error?: string | Record<string, string[]>;
  pending?: boolean,
}

export interface DailyInspectionFilters {
  search?: string;
  jobNumber?: string;
  supplier?: string;
  weekStartDate?: string;
}