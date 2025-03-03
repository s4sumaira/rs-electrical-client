import { checkInSchema} from "@/lib/validations/attendance";
import { apiCall } from "@/lib/helpers/apiHelper";
import type { ActionState } from "@/lib/types/form";
import type { FetchResult } from "@/lib/types/api"
import { TimeSheet,TimeSheetFilters } from "@/lib/types/timesheet";



export async function checkInAction(formData: FormData) {

    try {
           
        const data = Object.fromEntries(formData.entries());

       
        const validatedFields = checkInSchema.safeParse(data);

        console.log(validatedFields.data);
   
       if (!validatedFields.success) {
         return {
           success: false,
           message: "Form validation failed. Please fix the errors.",          
           error: validatedFields.error.flatten().fieldErrors,
         
         };
       }
   
       const response = await apiCall<TimeSheet>("/attendance/checkin", {
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
      
       return { success: true, message: "Checked-in successfully.", data: response.data as TimeSheet };
     } catch (error) {
       return {
         success: false,
         message: "An unexpected error occurred while creating the project.",
         error: error instanceof Error ? error.message : "Unknown error.",
       };
     }   

   
  }
  
  // Check-Out Server Action
  export async function checkOutAction(formData: FormData) {
    try {
           
        const data = Object.fromEntries(formData.entries());
        const validatedFields = checkInSchema.safeParse(data);
   
       if (!validatedFields.success) {
         return {
           success: false,
           message: "Form validation failed. Please fix the errors.",          
           error: validatedFields.error.flatten().fieldErrors,
         
         };
       }

       console.log(validatedFields.data);
   
       const response = await apiCall<TimeSheet>("/attendance/checkout", {
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
      
       return { success: true, message: "Checked-out successfully.", data: response.data as TimeSheet };
     } catch (error) {
       return {
         success: false,
         message: "An unexpected error occurred while creating the project.",
         error: error instanceof Error ? error.message : "Unknown error.",
       };
     } 
  }

  export async function getAttendance(
    filters: TimeSheetFilters,
    page: number,
    pageSize: number,
  ): Promise<ActionState< FetchResult<TimeSheet> >> {
    try {
      const queryParams = new URLSearchParams()

    //  console.log(filters);
  
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== ''  ) {
          queryParams.set(key, value)
        }
      })
  
      queryParams.set("page", page.toString())
      queryParams.set("pageSize", pageSize.toString())     
     
  
      const response = await apiCall<TimeSheet>(`/attendance/timesheet?${queryParams}`)
  
      if (!response.success) {
        return {
          success: false,
          message: response.message || "Failed to fetch attendance",
          error: response.error || "Unknown error occurred",
        }
      }

     
  
      const result: FetchResult<TimeSheet> = {
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
        message: "An unexpected error occurred while fetching attendance.",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
  