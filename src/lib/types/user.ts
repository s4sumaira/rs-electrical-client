
  export interface Role{
    _id:string;
    name:string;
  }
  
  export interface User {
    _id: string;
    name: string;
    email: string;
    password?: string;
    confirmPassword?: string; 
    role: Role | any;
    contact: string;
    isActive?: boolean;
    lastLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }
  