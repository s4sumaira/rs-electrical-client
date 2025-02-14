// export interface TimeEntry {
//   checkIn?: Date;
//   checkOut?: Date; 
//   reason?: string;
//   user :UserReference;
//   date:Date;
//   isActive: boolean;
// }

export interface UserReference {
  _id: string;
  name:string;
  email :string
}

export interface TimeSheet extends Record<string, unknown> {
  _id: string;
  userId: UserReference;  
  date: Date;
  checkIn?:Date;
  checkOut?:Date;
  reason?: string; 
  isActive: boolean;
  checkInTime?:string;
  checkOutTime?:string;
  isOnSite?:boolean;
}

export interface TimeSheetActionState {
  success: boolean;
  data?: TimeSheet | TimeSheet[] | null;
  message?: string;
  error?: string | Record<string, string[]>;
  pending?: boolean;
}

export interface TimeSheetFilters {
  name?: string;
  startDate?: string;
  endDate?: string;  
}
