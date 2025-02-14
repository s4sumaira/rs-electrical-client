// components/profile/constants.ts
import { Contact, ContactType } from "@/lib/types/contact";


export const initialValues: Contact = {
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  jobTitle: "",
  contactType: ContactType.EMPLOYEE,
  ninumber: "",
  birthDate: "",
  street: "",
  city: "",
  postCode: "",
  county: "",
  country: "",
  company: "",
  notes: "",
  isArchived: false,
  profileImage: "",
  documents: [],
  files: []
};