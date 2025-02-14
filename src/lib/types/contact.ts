import  type{ FileWithDocType} from "@/components/file-uploader"

export enum ContactType {
  EMPLOYEE = 'EMPLOYEE',
  CONTRACTOR = 'CONTRACTOR',
}

export enum DocType {
  LABOURER_CARD = 'LABOURER_CARD',
  APPRENTICE_CARD = 'APPRENTICE_CARD',
  INSTALLATION_ELECTRICIAN='INSTALLATION_ELECTRICIAN',
  EXPERIENCED_WORKER='EXPERIENCED_WORKER',
  SITE_MANAGER='SITE_MANAGER',
  PROJECT_MANAGER='PROJECT_MANAGER',
  OTHER='OTHER'

}
 

export interface ContactDocument  {
  _id?: string;
  url?:string;
  contact?:Contact;
  //file?: FileWithDocType;
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

