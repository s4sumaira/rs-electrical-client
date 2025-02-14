"use server"
import { updateUserFormSchema, createUserFormSchema } from "@/lib/validations/user"
import type { User ,Role} from "@/lib/types/user"
import { apiCall } from "@/lib/helpers/apiHelper"
import type { ActionState } from "@/lib/types/form"

export async function createUser(prevState: ActionState<User>, formData: FormData): Promise<ActionState<User>> {
  try {
    const rawEntries = Object.fromEntries(formData)
    const validatedFields = createUserFormSchema.safeParse(rawEntries)  

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



    const rawData = Object.fromEntries(formData)   
    console.log(rawData);

    const validatedFields = updateUserFormSchema.safeParse(rawData)

    console.log("validatedFields",validatedFields.data);
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

