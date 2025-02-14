"use server";


import { projectFormSchema } from "@/lib/validations/project"; 
import type { Project,ProjectFilters } from "@/lib/types/project"; 
import { apiCall } from "@/lib/helpers/apiHelper";
import type { ActionState } from "@/lib/types/form";
import type { FetchResult, ApiResponse } from "@/lib/types/api"
import { parseFormData } from "@/lib/helpers/formHelper";



export async function createProject(prevState:ActionState<Project>,formData: FormData): Promise<ActionState<Project>> {
  try {
        
    const parsedEntries = parseFormData<Project>(formData);

    const validatedFields = projectFormSchema.safeParse(parsedEntries);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Form validation failed. Please fix the errors.",
        data: prevState.data,
        error: validatedFields.error.flatten().fieldErrors,
      };
    }

    //console.log(JSON.stringify(validatedFields.data));

    const response = await apiCall<Project>("/projects", {
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

    //revalidatePath("/projects");
    return { success: true, message: "Project created successfully.", data: response.data as Project };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while creating the project.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}

export async function updateProject(prevState: ActionState<Project>, formData: FormData): Promise<ActionState<Project>> {
  try {
    const id = formData.get("id");
    if (!id) {
      return {
        success: false,
        message: "Project ID is required for updating.",
        error: "Project ID is missing.",
      };
    }

    const parsedEntries = parseFormData<Project>(formData);
    const validatedFields = projectFormSchema.safeParse(parsedEntries);

   // console.log(validatedFields);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Form validation failed. Please fix the errors.",
        error: validatedFields.error.flatten().fieldErrors,
      };
    }

    const response = await apiCall<Project>(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.success) {
      return {
        success: false,
        message: "Failed to update project. Please try again.",
        error: response.error || "Unknown error occurred.",
      };
    }

    //revalidatePath("/projects");
    return { success: true, message: "Project updated successfully.", data: response.data as Project};
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while updating the project.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}

export async function deleteProject(id: string): Promise<ActionState<Project>> {
  try {
  
    const response = await apiCall<ApiResponse<Project>>(`/projects/${id}`, {
      method: "DELETE",
    });

    if (!response.success) {
      return {
        success: false,
        message: "Failed to delete project. Please try again.",
        error: response.error || "Unknown error occurred.",
      };
    }
    
    return { success: true, message: "Project deleted successfully."};
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while deleting the project.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}

export async function getProjects(
  filters: ProjectFilters,
  page: number,
  pageSize: number,
): Promise<ActionState< FetchResult<Project> >> {
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

    const response = await apiCall<Project>(`/projects?${queryParams}`)

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to fetch projects",
        error: response.error || "Unknown error occurred",
      }
    }

    const result: FetchResult<Project> = {
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
      message: "An unexpected error occurred while fetching projects.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}



export async function getProject(id: string): Promise<ActionState<Project>> {
  try {
    const response = await apiCall<Project>(`/projects/${id}`);

    if (!response.success) {
      return {
        success: false,
        message: "Failed to fetch project. Please try again.",
        error: response.error || "Unknown error occurred.",
      
      };
    }

    return { success: true, message: "Project fetched successfully.", data: response.data as Project};
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while fetching the project.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}
