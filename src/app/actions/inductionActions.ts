"use server";

//import { inductionFormSchema } from "@/lib/validations/induction"; 
import { sectionSchemas } from "@/lib/validations/inductionSections";
import type { SiteInduction, SiteInductionFilters } from "@/lib/types/induction";
import { InductionStatus } from "@/lib/types/induction";
import { apiCall } from "@/lib/helpers/apiHelper";
import type { ActionState } from "@/lib/types/form";
import type { FetchResult, ApiResponse } from "@/lib/types/api";

export async function saveInduction(
  sectionIndex: number, 
  data: Partial<SiteInduction>, 
  isSubmission: boolean
): Promise<ActionState<SiteInduction>> {
  try {

    
    if (!isSubmission) {
      return {
        success: true,
        message:''      
        }
     } 

     const filteredDocuments = data.documents?.filter(doc => doc.isSelected).map(doc => doc._id) || [];
  
     const transformedData = {
      ...data,
      project: data.project?._id || "",
      inductedBy: data.inductedBy?._id || "",
      supervisedBy:  data.supervisedBy?._id  || "",
      inductedPerson: data.inductedPerson?._id || "",
      documents: filteredDocuments,
    };

    // console.log(transformedData.documents);

     console.log( 'Transformed data', JSON.stringify(transformedData));
  
    const { _id,inductionCompleted,createdAt, ...postData } = transformedData; 

    if (!data._id) {

      const response = await apiCall<SiteInduction>("/inductions", {
        method: "POST",
        body: JSON.stringify(postData),
      })

      if (!response.success) {
        return {
          success: false,
          message: response.message || "Failed to create induction",
          error: response.error as string
        }
      }

      return {
        success: true,
        message: "Induction submitted successfully",
        data: response.data as SiteInduction
      }
    }

    // If updating existing induction
    //console.log(JSON.stringify(postData.documents));
    
    const response = await apiCall<SiteInduction>(`/inductions/${data._id}`, {
      method: "PATCH",
      body: JSON.stringify(postData),
    })

    // console.log(postData)
    console.log(response);

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to update induction",
        error: response.error as string
      }
    }

    return {
      success: true,
      message: "Induction updated successfully" ,
      data: response.data as SiteInduction
    }

  } catch (error) {
    console.error('Save induction error:', error)
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

// export const saveInduction = async (
//   sectionIndex: number,
//   sectionData: Partial<SiteInduction>,
//   isFinalSubmission: boolean,
// ): Promise<ActionState<SiteInduction>> => {
//   try {


//     console.log("sectionData===============================",sectionData);

//     console.log("sectionData===============================",sectionData);

//     const status = isFinalSubmission ? InductionStatus.SUBMITTED : InductionStatus.DRAFT
//     const endpoint = isFinalSubmission ? "/inductions" : "/inductions/draft"
  

//     const response = await apiCall(endpoint, {
//       method: "POST",
//       body: JSON.stringify({
//         sectionIndex,
//         data: {
//           ...sectionData,
//           status,
//         },
//       }),
//     })

//     if (!response.success) {
//       return {
//         success: false,
//         message:'',
//         error: response.error || `Failed to ${isFinalSubmission ? "submit" : "save draft"} induction`,
//       }
//     }

//     return {
//       success: true,
//       data: response.data as SiteInduction,
//       message: isFinalSubmission ? "Induction submitted successfully" : "Draft saved successfully",
//     }
//   } catch (error) {
//     return {
//       success: false,
//       message:'',
//       error: `An unexpected error occurred while ${isFinalSubmission ? "submitting" : "saving draft"} induction`,
//     }
//   }
// }

export async function handleInductionSubmit(
  prevState: ActionState<SiteInduction>,
  formData: FormData
): Promise<ActionState<SiteInduction>> {
  try {
    const currentSection = Number(formData.get('currentSection'));
    const submissionType = formData.get('submissionType') as 'draft' | 'submit';
    const id = formData.get('_id') as string;

    
    
    // Convert FormData to object
    const rawData: Partial<SiteInduction> = Object.fromEntries(formData);

    // console.log("currentSection",currentSection);
    // console.log("submissionType",submissionType);
    // console.log("id",id);
    // console.log("rawData",rawData);

    // Validate current section
    const validatedSection = sectionSchemas[currentSection].safeParse(rawData);

    if (!validatedSection.success) {
      return {
        success: false,
        message: "Section validation failed",
        error: validatedSection.error.flatten().fieldErrors,
      };
    }

    // Prepare the data for API
    const payload = {
      ...validatedSection.data,
      status: submissionType === 'submit' ? 'SUBMITTED' as InductionStatus : 'DRAFT' as InductionStatus,
      lastUpdatedSection: currentSection,
    };

    // Determine API endpoint and method
    const endpoint = id ? `/inductions/${id}` : '/inductions';
    const method = id ? 'PATCH' : 'POST';

    // Make API call
    const response = await apiCall<SiteInduction>(endpoint, {
      method,
      body: JSON.stringify(payload),
    });

    if (!response.success) {
      return {
        success: false,
        message: response.message as string,
        error: response.error || "Failed to save induction",
      };
    }

    return {
      success: true,
      message: submissionType === 'submit' 
        ? "Induction submitted successfully"
        : "Draft saved successfully",
      data: response.data as SiteInduction
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// export async function createInduction(
//   prevState: ActionState<SiteInduction>,
//   formData: FormData
// ): Promise<ActionState<SiteInduction>> {
//   try {
//     const rawEntries: Partial<SiteInduction> = Object.fromEntries(formData);
//     const validatedFields = inductionFormSchema.safeParse(rawEntries);

//     if (!validatedFields.success) {
//       return {
//         success: false,
//         message: "Form validation failed. Please fix the errors.",
//         data: prevState.data,
//         error: validatedFields.error.flatten().fieldErrors,
//       };
//     }

//     const response = await apiCall<SiteInduction>("/inductions", {
//       method: "POST",
//       body: JSON.stringify(validatedFields.data),
//     });

//     if (!response.success) {
//       return {
//         success: false,
//         message: response.message as string,
//         error: response.error || "Unknown error occurred.",
//       };
//     }

//     return { success: true, message: "Induction created successfully.", data: response.data as SiteInduction };
//   } catch (error) {
//     return {
//       success: false,
//       message: "An unexpected error occurred while creating the induction.",
//       error: error instanceof Error ? error.message : "Unknown error.",
//     };
//   }
// }

// export async function updateInduction(
//   prevState: ActionState<SiteInduction>,
//   formData: FormData
// ): Promise<ActionState<SiteInduction>> {
//   try {
//     const id = formData.get("id");
//     if (!id) {
//       return {
//         success: false,
//         message: "Induction ID is required for updating.",
//         error: "Induction ID is missing.",
//       };
//     }

//     const rawData = Object.fromEntries(formData);
//     const validatedFields = inductionFormSchema.safeParse(rawData);

//     if (!validatedFields.success) {
//       return {
//         success: false,
//         message: "Form validation failed. Please fix the errors.",
//         error: validatedFields.error.flatten().fieldErrors,
//       };
//     }

//     const response = await apiCall<SiteInduction>(`/inductions/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(validatedFields.data),
//     });

//     if (!response.success) {
//       return {
//         success: false,
//         message: "Failed to update induction. Please try again.",
//         error: response.error || "Unknown error occurred.",
//       };
//     }

//     return { success: true, message: "Induction updated successfully.", data: response.data as SiteInduction };
//   } catch (error) {
//     return {
//       success: false,
//       message: "An unexpected error occurred while updating the induction.",
//       error: error instanceof Error ? error.message : "Unknown error.",
//     };
//   }
// }

export async function deleteInduction(id: string): Promise<ActionState<SiteInduction>> {
  try {
    const response = await apiCall<ApiResponse<SiteInduction>>(`/inductions/${id}`, {
      method: "DELETE",
    });

    if (!response.success) {
      return {
        success: false,
        message: "Failed to delete induction. Please try again.",
        error: response.error || "Unknown error occurred.",
      };
    }

    return { success: true, message: "Induction deleted successfully." };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while deleting the induction.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}

export async function approveInduction(id: string): Promise<ActionState<SiteInduction>> {
  try {

   
    if(id ==""){
      return {
        success: false,
        message: "Failed to approve induction. Please try again.",
        error:  "Induction Id can not be null.",
      };
    }
   
    const response = await apiCall<ApiResponse<SiteInduction>>(`/inductions/approve/${id}`, {
      method: "POST",
    });

    if (!response.success) {
      return {
        success: false,
        message: "Failed to approve induction. Please try again.",
        error: response.error || "Unknown error occurred.",
      };
    }

    return { success: true, message: "Induction approved successfully." };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while approving the induction.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}

export async function getInductions(
  filters: SiteInductionFilters,
  page: number,
  pageSize: number
): Promise<ActionState<FetchResult<SiteInduction>>> {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        queryParams.set(key, value);
      }
    });

    queryParams.set("page", page.toString());
    queryParams.set("pageSize", pageSize.toString());

    const response = await apiCall<SiteInduction>(`/inductions?${queryParams}`);

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to fetch inductions",
        error: response.error || "Unknown error occurred",
      };
    }

    const result: FetchResult<SiteInduction> = {
      records: response.data ?? [],
      pagination: response.pagination,
    };  

    //console.log(result.records);

    return {
      success: true,
      message: response.message ?? "",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while fetching inductions.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getInduction(id: string): Promise<ActionState<SiteInduction>> {
  try {
    const response = await apiCall<SiteInduction>(`/inductions/${id}`);

    if (!response.success) {
      return {
        success: false,
        message: "Failed to fetch induction. Please try again.",
        error: response.error || "Unknown error occurred.",
      };
    }   

    return { success: true, message: "Induction fetched successfully.", data: response.data as SiteInduction };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while fetching the induction.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}
