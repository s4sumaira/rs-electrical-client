"use server";


import { weeklyInspectionFormSchema } from "@/lib/validations/weeklyInspection"; 
import type { WeeklyCheck,InspectionFilters,InspectionActionState } from "@/lib/types/weeklyInspection"; 
import { apiCall } from "@/lib/helpers/apiHelper";
import type { ActionState } from "@/lib/types/form";
import type { FetchResult, ApiResponse } from "@/lib/types/api"
import { parseFormData } from "@/lib/helpers/formHelper";
import { Project } from "@/lib/types/project";
import { DocumentStatus } from "@/lib/helpers/enum";



export async function createWeeklyInspection(prevState:ActionState<WeeklyCheck>,formData: FormData): Promise<ActionState<WeeklyCheck>> {
  try {

  //  console.log(formData);
        
   
     const transformedData = {

      project:  formData.get("project._id"),
      jobNumber:formData.get("jobNumber"),
      date:formData.get("date"),
      supplier:formData.get("supplier"),
      makeModel:formData.get("makeModel"),
      documentStatus:formData.get("documentStatus"),
      wheelLugs: {
        status: formData.get("wheelLugs.status") === "true",
        details: (formData.get("wheelLugs.details") as string) || "",
      },
      batteryCondition: {
        status: formData.get("batteryCondition.status") === "true",
        details: (formData.get("batteryCondition.details") as string) || "",
      },
      warningStickers: {
        status: formData.get("warningStickers.status") === "true",
        details: (formData.get("warningStickers.details") as string) || "",
      },
      hosesAndFittings: {
        status: formData.get("hosesAndFittings.status") === "true",
        details: (formData.get("hosesAndFittings.details") as string) || "",
      },
      groundControls: {
        status: formData.get("groundControls.status") === "true",
        details: (formData.get("groundControls.details") as string) || "",
      },
      lanyardAnchorage: {
        status: formData.get("lanyardAnchorage.status") === "true",
        details: (formData.get("lanyardAnchorage.details") as string) || "",
      },
      controlsFunctions: {
        status: formData.get("controlsFunctions.status") === "true",
        details: (formData.get("controlsFunctions.details") as string) || "",
      },
      liftingAccessories: {
        status: formData.get("liftingAccessories.status") === "true",
        details: (formData.get("liftingAccessories.details") as string) || "",
      },
      scrubberCondition: {
        status: formData.get("scrubberCondition.status") === "true",
        details: (formData.get("scrubberCondition.details") as string) || "",
      },
      inspectionCompletion: {
        inspectorName: (formData.get("inspectionCompletion.inspectorName") as string) || "",
        signature: (formData.get("inspectionCompletion.signature") as string) || "",
        signedDate: new Date(),
      },
    };

    console.log("Transformed Data:", JSON.stringify(transformedData));
 

    const response = await apiCall<WeeklyCheck>("/weeklyinspection", {
      method: "POST",
      body: JSON.stringify(transformedData),
    });


    if (!response.success) {
      return {
        success: false,
        message: response.message as string,
        error: response.error || "Unknown error occurred.",
      
      };
    }

   
    return { success: true, message: "Weekly inspection submitted successfully.", data: response.data as WeeklyCheck };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while submitting the inspection.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}

export async function updateWeeklyInspection(prevState:ActionState<WeeklyCheck>,formData: FormData): Promise<ActionState<WeeklyCheck>> {
  try {

    //console.log(formData);

    const id =formData.get('_id');
        
    const transformedData = {

      project:  formData.get("project._id"),
      jobNumber:formData.get("jobNumber"),
      date:formData.get("date"),
      supplier:formData.get("supplier"),
      makeModel:formData.get("makeModel"),
      documentStatus:formData.get("documentStatus"),
      wheelLugs: {
        status: formData.get("wheelLugs.status") === "true",
        details: (formData.get("wheelLugs.details") as string) || "",
      },
      batteryCondition: {
        status: formData.get("batteryCondition.status") === "true",
        details: (formData.get("batteryCondition.details") as string) || "",
      },
      warningStickers: {
        status: formData.get("warningStickers.status") === "true",
        details: (formData.get("warningStickers.details") as string) || "",
      },
      hosesAndFittings: {
        status: formData.get("hosesAndFittings.status") === "true",
        details: (formData.get("hosesAndFittings.details") as string) || "",
      },
      groundControls: {
        status: formData.get("groundControls.status") === "true",
        details: (formData.get("groundControls.details") as string) || "",
      },
      lanyardAnchorage: {
        status: formData.get("lanyardAnchorage.status") === "true",
        details: (formData.get("lanyardAnchorage.details") as string) || "",
      },
      controlsFunctions: {
        status: formData.get("controlsFunctions.status") === "true",
        details: (formData.get("controlsFunctions.details") as string) || "",
      },
      liftingAccessories: {
        status: formData.get("liftingAccessories.status") === "true",
        details: (formData.get("liftingAccessories.details") as string) || "",
      },
      scrubberCondition: {
        status: formData.get("scrubberCondition.status") === "true",
        details: (formData.get("scrubberCondition.details") as string) || "",
      },
      inspectionCompletion: {
        inspectorName: (formData.get("inspectionCompletion.inspectorName") as string) || "",
        signature: (formData.get("inspectionCompletion.signature") as string) || "",
        signedDate: new Date(),
      },
    };

    const response = await apiCall<WeeklyCheck>(`/weeklyinspection/${id}`, {
      method: "PATCH",
      body: JSON.stringify(transformedData),
    });


    if (!response.success) {
      return {
        success: false,
        message: response.message as string,
        error: response.error || "Unknown error occurred.",
      
      };
    }

    //revalidatePath("/projects");
    return { success: true, message: "Inspection updated successfully.", data: response.data as WeeklyCheck };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while submitting the inspection.",
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

    const response = await apiCall<WeeklyCheck>(`/weeklyinspection?${queryParams}`)

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


