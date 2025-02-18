"use server";


import { weeklyInspectionFormSchema } from "@/lib/validations/weeklyInspection"; 
import type { WeeklyCheck,InspectionFilters,InspectionActionState } from "@/lib/types/weeklyInspection"; 
import { apiCall } from "@/lib/helpers/apiHelper";
import type { ActionState } from "@/lib/types/form";
import type { FetchResult, ApiResponse } from "@/lib/types/api"
import { parseFormData } from "@/lib/helpers/formHelper";
import { Project } from "@/lib/types/project";



export async function createWeeklyInspection(prevState:ActionState<WeeklyCheck>,formData: FormData): Promise<ActionState<WeeklyCheck>> {
  try {
        
    const parsedEntries = parseFormData<WeeklyCheck>(formData);

    const validatedFields = weeklyInspectionFormSchema.safeParse(parsedEntries);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Form validation failed. Please fix the errors.",
        data: prevState.data,
        error: validatedFields.error.flatten().fieldErrors,
      };
    }

    //console.log(JSON.stringify(validatedFields.data));

    const response = await apiCall<WeeklyCheck>("/weeklyinspections", {
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
    return { success: true, message: "Project created successfully.", data: response.data as WeeklyCheck };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while creating the project.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}

export async function updateWeeklyInspection(prevState:ActionState<WeeklyCheck>,formData: FormData): Promise<ActionState<WeeklyCheck>> {
  try {
        
    const parsedEntries = parseFormData<WeeklyCheck>(formData);

    const validatedFields = weeklyInspectionFormSchema.safeParse(parsedEntries);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Form validation failed. Please fix the errors.",
        data: prevState.data,
        error: validatedFields.error.flatten().fieldErrors,
      };
    }

    //console.log(JSON.stringify(validatedFields.data));

    const response = await apiCall<WeeklyCheck>("/weeklyinspections", {
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
    return { success: true, message: "Project created successfully.", data: response.data as WeeklyCheck };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while creating the project.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}

export async function getWeeklyInspections(
  filters: InspectionFilters,
  page: number,
  pageSize: number,
): Promise<ActionState< FetchResult<WeeklyCheck> >> {
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

    const response = await apiCall<WeeklyCheck>(`/weeklyinspections?${queryParams}`)

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to fetch inspections",
        error: response.error || "Unknown error occurred",
      }
    }

    const result: FetchResult<WeeklyCheck> = {
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
      message: "An unexpected error occurred while fetching inspections.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
   
    const response = await apiCall<Project>('/projects');
       
    if (!response.success || !Array.isArray(response.data)) {
      console.error("Invalid project data received", response);
      return [];
    }

    return response.data;

   
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}


