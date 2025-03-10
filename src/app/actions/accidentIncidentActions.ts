"use server";

import type { 
  AccidentIncidentReport, 
  AccidentIncidentFilters,
  IncidentClassification 
} from "@/lib/types/accidentIncident";
import { apiCall } from "@/lib/helpers/apiHelper";
import type { ActionState } from "@/lib/types/form";
import type { FetchResult } from "@/lib/types/api";
import { DocumentStatus,AccidentType } from "@/lib/helpers/enum";


export async function createAccidentIncidentReport(
  prevState: ActionState<AccidentIncidentReport>,
  formData: FormData
): Promise<ActionState<AccidentIncidentReport>> {
  try {
    const isEmployee = formData.get("injuredPerson.isEmployee") === "true";
    const firstAidAdministered = formData.get("incidentDetails.firstAidAdministered") === "true";
    const statementProvided = formData.get("incidentDetails.statementProvided") === "true";
    const photosTaken = formData.get("incidentDetails.photosTaken") === "true";
    const hseInformed = formData.get("receiptDetails.hseInformed") === "true";

    const transformedData = {
      project: formData.get("project._id"),
      reportedDate: formData.get("reportedDate"),
      injuredPerson: {
        fullName: formData.get("injuredPerson.fullName"),
        sex: formData.get("injuredPerson.sex"),
       dob: formData.get("injuredPerson.dob"),
        age: Number(formData.get("injuredPerson.age")),
        //isEmployee: isEmployee,
        address: formData.get("injuredPerson.address"),
        otherEmployerDetails: isEmployee ? "" : formData.get("injuredPerson.otherEmployerDetails"),
      },
      incidentDetails: {
        incidentType: formData.get("incidentDetails.incidentType"),
        firstAidAdministered: firstAidAdministered,
        firstAidAdministeredBy: firstAidAdministered ? formData.get("incidentDetails.firstAidAdministeredBy") : "",
        injuryDetails: formData.get("incidentDetails.injuryDetails"),
        firstAiderAdvice: formData.get("incidentDetails.firstAiderAdvice"),
        personAction: formData.get("incidentDetails.personAction"),
        activityAtTimeOfIncident: formData.get("incidentDetails.activityAtTimeOfIncident"),
        incidentDescription: formData.get("incidentDetails.incidentDescription"),
        witnesses: formData.get("incidentDetails.witnesses"),
        relevantConditions: formData.get("incidentDetails.relevantConditions"),
        manualHandlingDetails: formData.get("incidentDetails.manualHandlingDetails"),
        immediateCause: formData.get("incidentDetails.immediateCause"),
        underlyingCause: formData.get("incidentDetails.underlyingCause"),
        statementProvided: statementProvided,
        photosTaken: photosTaken,
        riskAssessmentReviewed: formData.get("incidentDetails.riskAssessmentReviewed"),
        immediateActions: formData.get("incidentDetails.immediateActions"),
        plannedActions: formData.get("incidentDetails.plannedActions"),
      },
      reportingPerson: {
        name: formData.get("reportingPerson.name"),
        contactDetails: formData.get("reportingPerson.contactDetails"),
      },
      receiptDetails: {
        name: formData.get("receiptDetails.name") || "",
        date: formData.get("receiptDetails.date") || "",
        hseInformed: hseInformed,
        referenceNumber: formData.get("receiptDetails.referenceNumber") || "",
        submissionDate: formData.get("receiptDetails.submissionDate") || "",
        incidentClassification: formData.get("receiptDetails.incidentClassification"),
        otherClassificationDetails: formData.get("receiptDetails.incidentClassification") === "OTHER" ? 
          formData.get("receiptDetails.otherClassificationDetails") : "",
      },
      documentStatus: DocumentStatus.SUBMITTED,
    };

    console.log(JSON.stringify(transformedData));

    const response = await apiCall<AccidentIncidentReport>("/accidentincident", {
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
      message: "Accident & Incident report created successfully.",
      data: response.data as AccidentIncidentReport,
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while creating the report.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}

export async function updateAccidentIncidentReport(
  prevState: ActionState<AccidentIncidentReport>,
  formData: FormData
): Promise<ActionState<AccidentIncidentReport>> {
  try {
    const id = formData.get("_id");
    if (!id) {
      return {
        success: false,
        message: "Report ID is required for updates.",
        error: "Missing report ID",
      };
    }

    const isEmployee = formData.get("injuredPerson.isEmployee") === "true";
    const firstAidAdministered = formData.get("incidentDetails.firstAidAdministered") === "true";
    const statementProvided = formData.get("incidentDetails.statementProvided") === "true";
    const photosTaken = formData.get("incidentDetails.photosTaken") === "true";
    const hseInformed = formData.get("receiptDetails.hseInformed") === "true";

    const transformedData = {
      project: formData.get("project._id"),
      reportedDate: formData.get("reportedDate"),
      injuredPerson: {
        fullName: formData.get("injuredPerson.fullName"),
        sex: formData.get("injuredPerson.sex"),
        dob: formData.get("injuredPerson.dob"),
        age: Number(formData.get("injuredPerson.age")),
       // isEmployee: isEmployee,
        address: formData.get("injuredPerson.address"),
        otherEmployerDetails: isEmployee ? "" : formData.get("injuredPerson.otherEmployerDetails"),
      },
      incidentDetails: {
        type: formData.get("incidentDetails.type"),
        firstAidAdministered: firstAidAdministered,
        firstAidAdministeredBy: firstAidAdministered ? formData.get("incidentDetails.firstAidAdministeredBy") : "",
        injuryDetails: formData.get("incidentDetails.injuryDetails"),
        firstAiderAdvice: formData.get("incidentDetails.firstAiderAdvice"),
        personAction: formData.get("incidentDetails.personAction"),
        activityAtTimeOfIncident: formData.get("incidentDetails.activityAtTimeOfIncident"),
        incidentDescription: formData.get("incidentDetails.incidentDescription"),
        witnesses: formData.get("incidentDetails.witnesses"),
        relevantConditions: formData.get("incidentDetails.relevantConditions"),
        manualHandlingDetails: formData.get("incidentDetails.manualHandlingDetails"),
        immediateCause: formData.get("incidentDetails.immediateCause"),
        underlyingCause: formData.get("incidentDetails.underlyingCause"),
        statementProvided: statementProvided,
        photosTaken: photosTaken,
        riskAssessmentReviewed: formData.get("incidentDetails.riskAssessmentReviewed"),
        immediateActions: formData.get("incidentDetails.immediateActions"),
        plannedActions: formData.get("incidentDetails.plannedActions"),
      },
      reportingPerson: {
        name: formData.get("reportingPerson.name"),
        contactDetails: formData.get("reportingPerson.contactDetails"),
      },
      receiptDetails: {
        name: formData.get("receiptDetails.name") || "",
        date: formData.get("receiptDetails.date") || "",
        hseInformed: hseInformed,
        referenceNumber: formData.get("receiptDetails.referenceNumber") || "",
        submissionDate: formData.get("receiptDetails.submissionDate") || "",
        classification: formData.get("receiptDetails.classification"),
        otherClassificationDetails: formData.get("receiptDetails.classification") === "OTHER" ? 
          formData.get("receiptDetails.otherClassificationDetails") : "",
      },
      documentStatus: formData.get("documentStatus") || DocumentStatus.SUBMITTED,
    };

    const response = await apiCall<AccidentIncidentReport>(`/accidentincident/${id}`, {
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
      message: "Accident & Incident report updated successfully.",
      data: response.data as AccidentIncidentReport,
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while updating the report.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}

export async function getAccidentIncidentReports(
  filters: AccidentIncidentFilters,
  page: number,
  pageSize: number
): Promise<ActionState<FetchResult<AccidentIncidentReport>>> {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        queryParams.set(key, value);
      }
    });

    queryParams.set("page", page.toString());
    queryParams.set("pageSize", pageSize.toString());

    const response = await apiCall<AccidentIncidentReport>(`/accidentincident?${queryParams}`);

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to fetch reports",
        error: response.error || "Unknown error occurred",
      };
    }

    const result: FetchResult<AccidentIncidentReport> = {
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
      message: "An unexpected error occurred while fetching reports.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteAccidentIncidentReport(
  id: string
): Promise<ActionState<AccidentIncidentReport>> {
  try {
    const response = await apiCall<AccidentIncidentReport>(`/accidentincident/${id}`, {
      method: "DELETE",
    });

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to delete report",
        error: response.error || "Unknown error occurred",
      };
    }

    return {
      success: true,
      message: "Accident & Incident report deleted successfully.",
      data: response.data as AccidentIncidentReport,
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while deleting the report.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

