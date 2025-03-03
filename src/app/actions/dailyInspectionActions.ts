"use server";


import type { DailyInspection, DailyInspectionFilters, DailyInspectionDay } from "@/lib/types/dailyInspection";
import type { ActionState } from "@/lib/types/form";
import type { FetchResult } from "@/lib/types/api";
import { apiCall } from "@/lib/helpers/apiHelper";
import { DocumentStatus } from "@/lib/helpers/enum";
import { Project } from "@/lib/types/project";

type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
type CheckItemKey = keyof DailyInspectionDay;

const inspectionItems: CheckItemKey[] = [
  "generalCondition",
  "brakes",
  "tyres",
  "coolantLubricant",
  "pinsLockingDevices",
  "hydraulicLeaks",
  "stabilisersRiggers",
  "controlInstrument",
  "alarms",
  "accessGate",
  "coolantLubricant2",
  "wheelCovers",
];

const days: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];


export async function createDailyInspection(
  prevState: ActionState<DailyInspection>,
  formData: FormData
): Promise<ActionState<DailyInspection>> {
  try {

    const transformedData = await transformInspectionData(formData)

    if (!formData.get('_id')) {
      const response = await apiCall<DailyInspection>("/dailyinspection", {
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

      return {
        success: true,
        message: "Daily inspection submitted successfully.",
        data: response.data as DailyInspection,
      };
    }

    // update section code 
    const id = formData.get('_id');
    const response = await apiCall<DailyInspection>(`/dailyinspection/${id}`, {
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
    return { success: true, message: "Inspection updated successfully.", data: response.data as DailyInspection };

  }
  catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while submitting the inspection.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}

export async function transformInspectionData(data: Record<string, any>) {
  const transformedDays = days.reduce((acc, day) => {
    acc[day] = transformDailyInspectionDay(data, day);
    return acc;
  }, {} as Record<DayKey, DailyInspectionDay>);

  return {
    _id: data._id || undefined,
    project: data.get("project._id"),
    jobNumber: data.get('jobNumber'),
    weekStartDate: data.get("weekStartDate"),
    supplier: data.get("supplier"),
    makeModel: data.get("makeModel"),
    inspectorName: data.get("inspectorName"),
    documentStatus: data.get("documentStatus") as DocumentStatus,
    ...transformedDays,
  };
}

function transformDailyInspectionDay(data: Record<string, any>, day: DayKey): DailyInspectionDay {
  return inspectionItems.reduce((acc, item) => {
    acc[item] = {
      status: data.get(`${day}.${item}.status`) === "true",
      details: data.get(`${day}.${item}.details`) || "",
    };
    return acc;
  }, {} as DailyInspectionDay);
}


export async function getDailyInspections(
  filters: DailyInspectionFilters,
  page: number,
  pageSize: number,
): Promise<ActionState<FetchResult<DailyInspection>>> {
  try {
    const queryParams = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.set(key, value)
      }
    })

    queryParams.set("page", page.toString())
    queryParams.set("pageSize", pageSize.toString())

    //console.log(queryParams);

    const response = await apiCall<DailyInspection>(`/dailyinspection?${queryParams}`)

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to fetch inspections",
        error: response.error || "Unknown error occurred",
      }
    }

    const result: FetchResult<DailyInspection> = {
      records: response.data ?? [],
      pagination: response.pagination
    };


    return {
      success: true,
      message: response.message ?? '',
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
