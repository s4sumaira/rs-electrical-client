"use server";


import type { HotWorkPermit ,PermitFilters} from "@/lib/types/hotWorkPermit"; 
import type { ActionState } from "@/lib/types/form";
import type { FetchResult } from "@/lib/types/api";
import { apiCall } from "@/lib/helpers/apiHelper";
import { DocumentStatus } from "@/lib/helpers/enum";


export async function createHotWorkPermit(
    prevState: ActionState<HotWorkPermit>,
    formData: FormData
  ): Promise<ActionState<HotWorkPermit>> {
    try {

      const contractorCnf = typeof formData.get("contractorConfirmation.name") === "string" 
                              && (formData.get("contractorConfirmation.name") as string).trim().length > 0 || false;
      const operatorCnf = typeof formData.get("operatorConfirmation.name") === "string" 
                               && (formData.get("operatorConfirmation.name") as string).trim().length > 0 || false;
      // const managementAuth = typeof formData.get("managementAuthorization.name") === "string" 
      //                          && (formData.get("managementAuthorization.name") as string).trim().length > 0 || false;    
      
      const operatorCans = typeof formData.get("operatorCancellation.name") === "string" 
                               && (formData.get("operatorCancellation.name") as string).trim().length > 0 || false;

      const managementCancs = typeof formData.get("managementCancellation.name") === "string" 
                                && (formData.get("managementCancellation.name") as string).trim().length > 0 || false;
      
      const finalInspection = typeof formData.get("finalInspection.name") === "string" 
                                 && (formData.get("finalInspection.name") as string).trim().length > 0 || false;
      
   
      let docStatus = DocumentStatus.DRAFT;
        if( contractorCnf && operatorCnf){
          docStatus= DocumentStatus.OPEN;
        }
        else if (operatorCans && managementCancs){
          docStatus= DocumentStatus.COMPLETED;
        }
        else if (finalInspection){
          docStatus= DocumentStatus.FINALISED;
        }
      

      const transformedData = {     
        project: formData.get("project._id"),
        companyName: formData.get("companyName"),
        location: formData.get("location"),
        jobNumber: formData.get("jobNumber"),
        supervisor: formData.get("supervisor._id"),
      //  permitNumber: formData.get("permitNumber"),
        equipmentUsed: formData.get("equipmentUsed"),
        startTime: formData.get("startTime"),
        endTime: formData.get("endTime"),
        dateOfWorks: formData.get("dateOfWorks"),
        workIncludes :{
          brazing: formData.get("workIncludes.brazing")  === "true",
          torchCutting: formData.get("workIncludes.torchCutting") === "true",
          grinding: formData.get("workIncludes.grinding") === "true",
          soldering: formData.get("workIncludes.soldering") === "true",
          welding: formData.get("workIncludes.welding") === "true",
        },

        // Precautions checklist
        ceaseBeforeShiftEnd: formData.get("ceaseBeforeShiftEnd"),
        servicesIsolated: formData.get("servicesIsolated"),
        smokeDetectorsIsolated: formData.get("smokeDetectorsIsolated"),
        fireExtinguisherAvailable: formData.get("fireExtinguisherAvailable"),
        ppeProvided: formData.get("ppeProvided"),
        cylindersSecured: formData.get("cylindersSecured"),
        valvesCondition: formData.get("valvesCondition"),
        flashbackArrestors: formData.get("flashbackArrestors"),
        cylindersStorage: formData.get("cylindersStorage"),
        lpgStorage: formData.get("lpgStorage"),
        weldingStandards: formData.get("weldingStandards"),
        spentRodsImmersed: formData.get("spentRodsImmersed"),
        areaCleanAndTidy: formData.get("areaCleanAndTidy"),
        riserShaftSafety: formData.get("riserShaftSafety"),
        postWorkInspection: formData.get("postWorkInspection"),
  
        // Operator requirements
        understandPermit: formData.get("understandPermit"),
        possessPermit: formData.get("possessPermit"),
        stopWorkIfRequired: formData.get("stopWorkIfRequired"),
        reportHazards: formData.get("reportHazards"),
        ensureAccess: formData.get("ensureAccess"),
  
        // Signatures
        contractorConfirmation: {
          name: formData.get("contractorConfirmation.name"),
          position: formData.get("contractorConfirmation.position"),
          signature: formData.get("contractorConfirmation.signature"),
          date: formData.get("contractorConfirmation.date")
        },
        operatorConfirmation: {
          name: formData.get("operatorConfirmation.name"),
          position: formData.get("operatorConfirmation.position"),
          signature: formData.get("operatorConfirmation.signature"),
          date: formData.get("operatorConfirmation.date")
        },
        managementAuthorization: {
          name: formData.get("managementAuthorization.name"),
          position: formData.get("managementAuthorization.position"),
          signature: formData.get("managementAuthorization.signature"),
          date: formData.get("managementAuthorization.date")
        },
        operatorCancellation: {
          name: formData.get("operatorCancellation.name"),
          position: formData.get("operatorCancellation.position"),
          signature: formData.get("operatorCancellation.signature"),
          date: formData.get("operatorCancellation.date")
        },
        managementCancellation: {
          name: formData.get("managementCancellation.name"),
          position: formData.get("managementCancellation.position"),
          signature: formData.get("managementCancellation.signature"),
          date: formData.get("managementCancellation.date")
        },
        finalInspection: {
          name: formData.get("finalInspection.name"),
          position: formData.get("finalInspection.position"),
          signature: formData.get("finalInspection.signature"),
          date: formData.get("finalInspection.date"),
          completedAfterHours: formData.get("finalInspection.completedAfterHours")
        },
        documentStatus:docStatus
      };

    // console.log(JSON.stringify(transformedData)) ;
    if (!formData.get('_id')) {
      const response = await apiCall<HotWorkPermit>("/hotworkpermit", {
        method: "POST",
        body: JSON.stringify(transformedData)
      });
  
      if (!response.success) {
        return {
          success: false,
          message: response.message as string,
          error: response.error || "Unknown error occurred"
        };
      }
  
      return {
        success: true,
        message: "Hot work permit created successfully",
        data: response.data as HotWorkPermit
      };
    }

    const id = formData.get('_id');

    const response = await apiCall<HotWorkPermit>(`/hotworkpermit/${id}`, {
      method: "PATCH",
      body: JSON.stringify(transformedData)
    });

    if (!response.success) {
      return {
        success: false,
        message: response.message as string,
        error: response.error || "Unknown error occurred"
      };
    }

    return {
      success: true,
      message: "Hot work permit updated successfully",
      data: response.data as HotWorkPermit
    };

    } catch (error) {
      return {
        success: false,
        message: "An unexpected error occurred while updating the permit",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  
  export async function getHotWorkPermits(
    filters: PermitFilters,
    page: number,
    pageSize: number
  ): Promise<ActionState<FetchResult<HotWorkPermit>>> {
    try {
      const queryParams = new URLSearchParams();
  
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.set(key, value);
        }
      });
  
      queryParams.set("page", page.toString());
      queryParams.set("pageSize", pageSize.toString());
  
      const response = await apiCall<HotWorkPermit>(`/hotworkpermit?${queryParams}`);
  
      if (!response.success) {
        return {
          success: false,
          message: response.message || "Failed to fetch permits",
          error: response.error || "Unknown error occurred"
        };
      }
  
      const result: FetchResult<HotWorkPermit> = {
        records: response.data ?? [],
        pagination: response.pagination
      };

     
  
      return {
        success: true,
        message: response.message ?? "",
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: "An unexpected error occurred while fetching permits",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  
  