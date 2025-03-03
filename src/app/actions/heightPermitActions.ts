"use server";


import type { HeightPermit, PermitFilters } from "@/lib/types/heightPermit";
import { apiCall } from "@/lib/helpers/apiHelper";
import type { ActionState } from "@/lib/types/form";
import type { FetchResult } from "@/lib/types/api";
import { DocumentStatus } from "@/lib/helpers/enum";

export async function saveHeightPermit(
  prevState: ActionState<HeightPermit>,
  formData: FormData
): Promise<ActionState<HeightPermit>> {
  try {


    const issuedTo = formData.get("confirmationStatus.issuedTo") === "true";
    const issuedBy = formData.get("confirmationStatus.issuedBy") === "true";
    const cancelledBy = formData.get("confirmationStatus.cancelledBy") === "true";
    const signedOffBy = formData.get("confirmationStatus.signedOffBy") === "true";

    let docStatus = DocumentStatus.DRAFT;
    if( issuedTo && issuedBy && !cancelledBy){
      docStatus= DocumentStatus.OPEN;
    }
    else if (issuedTo && issuedBy && cancelledBy){
      docStatus= DocumentStatus.COMPLETED;
    }
    else if (issuedTo && issuedBy && cancelledBy && signedOffBy){
      docStatus= DocumentStatus.FINALISED;
    }
     

    const transformedData = {
      issueDate: formData.get("issueDate"),
      lastReviewedDate: formData.get("lastReviewedDate"),
      nextReviewDate: formData.get("nextReviewDate"),
      date: formData.get("date"),
      project: formData.get("project._id"),
      location: formData.get("location"),
      contractor: formData.get("contractor"),
      phoneNumber: formData.get("phoneNumber"),
      validFrom: formData.get("validFrom"),
      validFromTime: formData.get("validFromTime"),
      validTo: formData.get("validTo"),
      validToTime: formData.get("validToTime"),
      descriptionOfWorks: formData.get("descriptionOfWorks"),
      equipment: {
        stepLadders: formData.get("equipment.stepLadders") === "true",
        mobileScaffold: formData.get("equipment.mobileScaffold") === "true",
        extensionLadder: formData.get("equipment.extensionLadder") === "true",
        mewp: formData.get("equipment.mewp") === "true",
        correctFootwear: formData.get("equipment.correctFootwear") === "true",
        edgeProtection: formData.get("equipment.edgeProtection") === "true",
        safetyNet: formData.get("equipment.safetyNet") === "true",
        ropesHarnesses: formData.get("equipment.ropesHarnesses") === "true",
        otherEquipment: formData.get("equipment.otherEquipment") as string,
      },
      services: {
        smokeDetectors: formData.get("services.smokeDetectors") === "true",
        pipesTanks: formData.get("services.pipesTanks") === "true",
        electricalOutlets: formData.get("services.electricalOutlets") === "true",
        otherServices: formData.get("services.otherServices") as string,
      },
      controlMeasures: {
        barriers: formData.get("controlMeasures.barriers") === "true",
        banksman: formData.get("controlMeasures.banksman") === "true",
        signage: formData.get("controlMeasures.signage") === "true",
        otherMeasures: formData.get("controlMeasures.otherMeasures") as string,
      },
      environmental: {
        weather: formData.get("environmental.weather") === "true",
        groundConditions: formData.get("environmental.groundConditions") === "true",
        storedMaterials: formData.get("environmental.storedMaterials") === "true",
        otherEnvironmental: formData.get("environmental.otherEnvironmental") as string,
      },
      confirmationStatus: {
        issuedTo: formData.get("confirmationStatus.issuedTo") === "true",
        issuedBy: formData.get("confirmationStatus.issuedBy") === "true",
        cancelledBy: formData.get("confirmationStatus.cancelledBy") === "true",
        signedOffBy: formData.get("confirmationStatus.signedOffBy") === "true",

      },
      authorization: {
        issuedToName: formData.get("authorization.issuedToName"),
        issuedToSignature: formData.get("authorization.issuedToSignature"),
        issuedToDate: formData.get("authorization.issuedToDate"),
        issuedByName: formData.get("authorization.issuedByName"),
        issuedBySignature: formData.get("authorization.issuedBySignature"),
        issuedByDate: formData.get("authorization.issuedByDate"),
      },
      cancellation: {
        cancelledByName: formData.get("cancellation.cancelledByName"),
        cancelledBySignature: formData.get("cancellation.cancelledBySignature"),
        cancelledByDate: formData.get("cancellation.cancelledByDate"),
        cancellationReason: formData.get("cancellation.cancellationReason"),
        cancellationDate: formData.get("cancellation.cancellationDate"),
        cancellationTime: formData.get("cancellation.cancellationTime"),
      },
      finalSignOff: {
        signedOffByName: formData.get("finalSignOff.signedOffByName"),
        signedOffBySignature: formData.get("finalSignOff.signedOffBySignature"),
        signedOffByDate: formData.get("finalSignOff.signedOffByDate"),

      },
      documentStatus: docStatus,
    };
    //console.log(JSON.stringify(transformedData));
    if (!formData.get('_id')) {

      const response = await apiCall<HeightPermit>("/heightworkpermit", {
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
        message: "Height permit created successfully.",
        data: response.data as HeightPermit,
      };
    }

    // update handling 
    const id = formData.get("_id");

    const response = await apiCall<HeightPermit>(`/heightworkpermit/${id}`, {
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

    return {
      success: true,
      message: "Height permit updated successfully.",
      data: response.data as HeightPermit,
    };

  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while creating the permit.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}

export async function getHeightPermits(
  filters: PermitFilters,
  page: number,
  pageSize: number
): Promise<ActionState<FetchResult<HeightPermit>>> {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        queryParams.set(key, value);
      }
    });

    queryParams.set("page", page.toString());
    queryParams.set("pageSize", pageSize.toString());

    const response = await apiCall<HeightPermit>(`/heightworkpermit?${queryParams}`);

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to fetch permits",
        error: response.error || "Unknown error occurred",
      };
    }

    const result: FetchResult<HeightPermit> = {
      records: response.data ?? [],
      pagination: response.pagination,
    };

    return {
      success: true,
      message: response.message ?? "",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while fetching permits.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}