export interface Address {
  street: string;
  city: string;
  county?: string;
  postalCode: string;
  country: string;
}
export interface SupervisedBy {
  _id: string
  fullName: string;
}
  export interface InductedBy {
    _id: string
    fullName: string;
}

export interface Project extends Record<string, unknown> {
  _id: string;
  name: string;    
  supervisedBy?:SupervisedBy[] | any[];
  inductedBy?:InductedBy[] |any[];
  isArchived?: boolean;
  street: string; 
  city:string,
  postCode:string,
  county?:string,
  country?:string,
  fullAddress?:string
}

export interface ProjectActionState {
  success: boolean;
  data?: Project | Project[] |null;
  message?:string;
  error?: string | Record<string, string[]>;
  pending?: boolean,
}

export interface ProjectFilters {
  search?: string
  name?: string  
  postCode?:string  
}