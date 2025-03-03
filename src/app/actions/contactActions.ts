"use server";

import { contactFormSchema } from "@/lib/validations/contact";
import type { Contact, ContactFilters } from "@/lib/types/contact";
import { apiCall } from "@/lib/helpers/apiHelper";
import type { ActionState } from "@/lib/types/form";
import type { FetchResult, ApiResponse } from "@/lib/types/api"
import { parseFormData } from "@/lib/helpers/formHelper";
import {generatePresignedUrl} from "@/app/actions/uploadActions";



export async function createContact(prevState:ActionState<Contact>,formData: FormData): Promise<ActionState<Contact>> {
  try {
    
    const rawEntries = parseFormData<Contact>(formData);

    const validatedFields = contactFormSchema.safeParse(rawEntries);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Form validation failed. Please fix the errors.",
        data: prevState.data,
        error: validatedFields.error.flatten().fieldErrors,
      
      };
    }   

    const response = await apiCall<Contact>("/contacts", {
      method: "POST",
      body: JSON.stringify(validatedFields.data),
    });


    if (!response.success) {
      return {
        success: false,
        message: response.message as string,
        error: response.error || "Unknown error occurred.",
      
      };
    }

   // revalidatePath("/contacts");
    return { success: true, message: "Contact created successfully.", data: response.data as Contact };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while creating the contact.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}

export async function updateContact(prevState: ActionState<Contact>, formData: FormData): Promise<ActionState<Contact>> {
  try {
    const id = formData.get("id");
    if (!id) {
      return {
        success: false,
        message: "Contact ID is required for updating.",
        error: "Contact ID is missing.",
      };
    }   

   
    const rawEntries = parseFormData<Contact>(formData);


    if (rawEntries.documents) {
      try {
        rawEntries.documents = typeof rawEntries.documents === "string"
        ? JSON.parse(rawEntries.documents)
        : rawEntries.documents;
      } catch (error) {
        return {
          success: false,
          message: "Invalid documents format.",
          error: "Documents must be a valid JSON array." ,
        };
      }
    }

   
    const validatedFields= contactFormSchema.safeParse(rawEntries);

    console.log(JSON.stringify(validatedFields.data));

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Form validation failed. Please fix the errors.",
        error: validatedFields.error.flatten().fieldErrors,
      };
    }

    const response = await apiCall<Contact>(`/contacts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.success) {
      return {
        success: false,
        message: "Failed to update contact. Please try again.",
        error: response.error || "Unknown error occurred.",
      };
    }

    //revalidatePath("/contacts");
    return { success: true, message: "Contact updated successfully.", data: response.data as Contact};
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while updating the contact.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}

export async function deleteContact(id: string): Promise<ActionState<Contact>> {
  try {
    const response = await apiCall<ApiResponse<Contact>>(`/contacts/${id}`, {
      method: "DELETE",
    });

    if (!response.success) {
      return {
        success: false,
        message: "Failed to delete contact. Please try again.",
        error: response.error || "Unknown error occurred.",
      };
    }
   
    return { success: true, message: "Contact deleted successfully."};
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while deleting the contact.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}

export async function getContacts(
  filters: ContactFilters,
  page: number,
  pageSize: number,
): Promise<ActionState< FetchResult<Contact> >> {
  try {
    const queryParams = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== ''  ) {
        queryParams.set(key, value)
      }
    })

    queryParams.set("page", page.toString())
    queryParams.set("pageSize", pageSize.toString())

    //console.log(queryParams);

    const response = await apiCall<Contact>(`/contacts?${queryParams}`)

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to fetch contacts",
        error: response.error || "Unknown error occurred",
      }
    }

    const result: FetchResult<Contact> = {
      records: response.data??[], 
      pagination: response.pagination 
    };
    return {
      success: true,
      message: response.message?? '',
      data: result,
    }
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while fetching contacts.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}



export async function getContact(id: string): Promise<ActionState<Contact>> {
  try {
    const response = await apiCall<Contact>(`/contacts/${id}`);

    if (!response.success) {
      return {
        success: false,
        message: "Failed to fetch contact. Please try again.",
        error: response.error || "Unknown error occurred.",
      
      };
    }

    
    return { success: true, message: "Contact fetched successfully.", data: response.data as Contact};

  
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while fetching the contact.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}

export async function getLoggedInUserContact(): Promise<ActionState<Contact>> {
  try {

    const response = await apiCall<Contact>('/contacts/loggedInUser');   

    if (!response.success) {
      return {
        success: false,
        message: "Failed to fetch contact. Please try again.",
        error: response.error || "Unknown error occurred.",
      
      };
    }

    const contact = response.data as Contact;  

    if (contact.profileImage) {
      try {
        contact.profileImage = await generatePresignedUrl(contact.profileImage);
       
      } catch (urlError) {
        console.error("Failed to generate presigned URL:", urlError);
      }
    }

    return { 
      success: true, 
      message: "Contact fetched successfully.", 
      data: contact
    };
  
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while fetching the contact.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}

