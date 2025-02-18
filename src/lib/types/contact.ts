import  type{ FileWithDocType} from "@/components/file-uploader"

export enum ContactType {
  EMPLOYEE = 'EMPLOYEE',
  CONTRACTOR = 'CONTRACTOR',
}

export enum DocTypes {
  LABOURER_CARD ='LABOURER CARD (GREEN)' ,
  APPRENTICE_CARD = 'APPRENTICE CARD',
  INSTALLATION_ELECTRICIAN = 'INSTALLATION ELECTRICIAN (GOLD)' ,
  EXPERIENCED_WORKER = 'EXPERIENCED WORKER',
  SITE_MANAGER_CARD= 'SITE MANAGER CARD (BLACK)' ,
  PROJECT_MANAGER_CARD= 'PROJECT MANAGER CARD (BLACK)' ,
  OTHER ='OTHER'

}
 

export interface ContactDocument  {
  _id?: string;
  url?:string;
  contact?:string;
  fileName:string;
  fileType:string;
  fileSize:string;
  docType:string;
  fileKey:string;
  description?:string;
  presignedUrl?: string;
  isSelected?:boolean;
 
}

export interface Contact extends Record<string, unknown> {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  contactType: ContactType;
  ninumber?: string;
  birthDate?: string;
  street?:string;
  city?:string;
  postCode?:string;
  county?:string;
  country?:string;
  company?: string; 
  notes?: string;
  isArchived?: boolean;
  fullName?: string; 
  documents?:ContactDocument[];
  files?: FileWithDocType[];
  profileImage?:string;
}

export interface ContactActionState {
  success: boolean;
  data?: Contact | Contact[] |null;
  message?:string;
  error?: string | Record<string, string[]>;
  pending?: boolean,
}

export interface ContactFilters {
  search?: string
  contactType?: string
  email?: string
}

