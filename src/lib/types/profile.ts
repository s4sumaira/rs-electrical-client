// types/profile.ts
import { Contact } from "@/lib/types/contact";

export interface TabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}



export interface ProfileHeaderProps {
    formState: Contact;
    fileInputRef: React.RefObject<HTMLInputElement | null>; // Changed this line
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, type: "profile" | "document") => Promise<void>;
    removeProfilePicture: () => Promise<void>;
    triggerFileInput: () => void;
  }
  

export interface InputFieldProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  id?: string;
  required?: boolean;
  [key: string]: any;
}

export interface SelectFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  [key: string]: any;
}

export interface TabContentProps {
  formState: Contact;
  errors: Record<string, string[] | undefined>;
  getInputProps: (path: string) => InputFieldProps;
  getSelectProps: (path: string) => Omit<SelectFieldProps, 'options'>;
  setFormState: React.Dispatch<React.SetStateAction<Contact>>;
}

export interface ProfileFormProps {
  contact: Contact | null;
  onSave?: (data: Contact) => void;
}