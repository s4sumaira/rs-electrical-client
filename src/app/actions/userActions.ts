"use server"
import { updateUserFormSchema, createUserFormSchema } from "@/lib/validations/user"
import type { User ,Role} from "@/lib/types/user"
import { apiCall } from "@/lib/helpers/apiHelper"
import type { ActionState } from "@/lib/types/form"

export async function createUser(prevState: ActionState<User>, formData: FormData): Promise<ActionState<User>> {
  try {
    const rawEntries = Object.fromEntries(formData)

    const { "role._id": roleId, ...rest } = rawEntries;
    const processedEntries = {
      ...rest,
      role: roleId || rawEntries.role,
    };

   
    console.log("Processed entries:", JSON.stringify(processedEntries));

    const validatedFields = createUserFormSchema.safeParse(processedEntries);

    

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Form validation failed. Please fix the errors.",
        data: prevState.data,
        error: validatedFields.error.flatten().fieldErrors,
      }
    }  
    
   
    const response = await apiCall<User>("/users", {
      method: "POST",
      body: JSON.stringify(validatedFields.data),
    })

  
    if (!response.success) {
      return {
        success: false,
        message: response.message as string,
        error: response.error || "Unknown error occurred.",
      }
    }

   
    return { success: true, message: "User created successfully.", data: response.data as User }
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while creating the user.",
      error: error instanceof Error ? error.message : "Unknown error.",
    }
  }
}

export async function updateUser(prevState: ActionState<User>, formData: FormData): Promise<ActionState<User>> {
  try {
    const id = formData.get("id")
    if (!id) {
      return {
        success: false,
        message: "User ID is required for updating.",
        error: "User ID is missing.",
      }
    }


   //formData.set("role",formData.get("role._id"))
 // Create a transformed data object with the correct structure
 const rawData = Object.fromEntries(formData);
 console.log("Raw form data:", rawData);
 
 // Transform the data to match your schema
 const transformedData = {
   id: rawData.id,
   name: rawData.name,
   email: rawData.email,
   password: rawData.password,
   // Use role._id as the role value since your schema expects a string
   role: rawData['role._id'],
   contact: rawData.contact || rawData.contactId, // Use whichever is available
   isActive: rawData.isActive
 };
 
 console.log("Transformed data:", transformedData);

 const validatedFields = updateUserFormSchema.safeParse(transformedData);
    if (!validatedFields.success) {
      return {
        success: false,
        message: "Form validation failed. Please fix the errors.",
        error: validatedFields.error.flatten().fieldErrors
      }
    }

   

    const response = await apiCall<User>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(validatedFields.data),
    })

    if (!response.success) {
      return {
        success: false,
        message: "Failed to update user. Please try again.",
        error: response.error || "Unknown error occurred.",
      }
    }

    return { success: true, message: "User updated successfully.", data: response.data as User }
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while updating the user.",
      error: error instanceof Error ? error.message : "Unknown error.",
    }
  }
}

export async function getUser(contactId: string): Promise<User | null> {
  try {
    const response = await apiCall<User>(`/users/contact/${contactId}`)

    if (!response.success) {
      console.log("Error fetching user:", response)
      return null

    }

    return response.data as User
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}


export async function getRoles(): Promise<Role[]> {
  try {
   
    const response = await apiCall<Role>('/roles');
       
    if (!response.success || !Array.isArray(response.data)) {
      console.error("Invalid role data received", response);
      return [];
    }

    return response.data;

   
  } catch (error) {
    console.error("Error fetching roles:", error)
    return []
  }
}

