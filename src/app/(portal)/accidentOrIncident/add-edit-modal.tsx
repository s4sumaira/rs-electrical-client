"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatUKDate } from "@/lib/utils";
import {
  AccidentIncidentReport,
  IncidentClassification,
  PersonAction
} from "@/lib/types/accidentIncident";
import {
  createAccidentIncidentReport,
  updateAccidentIncidentReport

} from "@/app/actions/accidentIncidentActions";
import { getProjects } from "@/app/actions/dailyInspectionActions";
import { useForm } from "@/hooks/useForm";
import { useEffect, useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { ModalFooter } from "@/components/modal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { Project } from "@/lib/types/project";
import { SearchableSelect } from "@/components/searchable-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentStatus, Gender, AccidentType } from "@/lib/helpers/enum";
import { cn } from "@/lib/utils";
import { Contact, ContactType } from "@/lib/types/contact";
import { getLoggedInUserContact } from "@/app/actions/contactActions";

interface AccidentIncidentFormProps {
  onClose: () => void;
  onSuccess?: (data: AccidentIncidentReport, message: string) => void;
  onError?: (error: string) => void;
  currentReport: AccidentIncidentReport | null;
}

export function AccidentIncidentForm({
  onClose,
  onSuccess,
  onError,
  currentReport,
}: AccidentIncidentFormProps) {
  const signaturePadRef = useRef<SignaturePad>(null);

  // console.log(currentReport);

  const initialValues: AccidentIncidentReport = {


    _id: currentReport?._id ?? "",
    project: currentReport?.project ?? ({} as Project),
    reportedDate: currentReport?.reportedDate ?? new Date().toISOString().split("T")[0],

    injuredPerson: {
      fullName: currentReport?.injuredPerson?.fullName ?? "",
      dob: currentReport?.injuredPerson?.dob ?? "",
      sex: currentReport?.injuredPerson?.sex ?? Gender.Male,
      age: currentReport?.injuredPerson?.age ?? 0,
      address: currentReport?.injuredPerson?.address ?? "",
      otherEmployerDetails: currentReport?.injuredPerson?.otherEmployerDetails ?? "",
    },
    incidentDetails: {
      incidentType: currentReport?.incidentDetails?.incidentType ?? AccidentType.ACCIDENT,
      firstAidAdministered: currentReport?.incidentDetails?.firstAidAdministered ?? false,
      firstAidAdministeredBy: currentReport?.incidentDetails?.firstAidAdministeredBy ?? "",
      injuryDetails: currentReport?.incidentDetails?.injuryDetails ?? "",
      firstAiderAdvice: currentReport?.incidentDetails?.firstAiderAdvice ?? "",
      personAction: currentReport?.incidentDetails?.personAction ?? PersonAction.RETURN_TO_WORK,
      activityAtTimeOfIncident: currentReport?.incidentDetails?.activityAtTimeOfIncident ?? "",
      incidentDescription: currentReport?.incidentDetails?.incidentDescription ?? "",
      witnesses: currentReport?.incidentDetails?.witnesses ?? "",
      relevantConditions: currentReport?.incidentDetails?.relevantConditions ?? "",
      manualHandlingDetails: currentReport?.incidentDetails?.manualHandlingDetails ?? "",
      immediateCause: currentReport?.incidentDetails?.immediateCause ?? "",
      underlyingCause: currentReport?.incidentDetails?.underlyingCause ?? "",
      statementProvided: currentReport?.incidentDetails?.statementProvided ?? false,
      photosTaken: currentReport?.incidentDetails?.photosTaken ?? false,
      riskAssessmentReviewed: currentReport?.incidentDetails?.riskAssessmentReviewed ?? "",
      immediateActions: currentReport?.incidentDetails?.immediateActions ?? "",
      plannedActions: currentReport?.incidentDetails?.plannedActions ?? "",
    },
    reportingPerson: {
      name: currentReport?.reportingPerson?.name ?? "",
      contactDetails: currentReport?.reportingPerson?.contactDetails ?? "",
    },
    receiptDetails: {
      name: currentReport?.receiptDetails?.name ?? "",
      date: currentReport?.receiptDetails?.date ?? "",
      hseInformed: currentReport?.receiptDetails?.hseInformed ?? false,
      referenceNumber: currentReport?.receiptDetails?.referenceNumber ?? "",
      submissionDate: currentReport?.receiptDetails?.submissionDate ?? "",
      incidentClassification: currentReport?.receiptDetails?.incidentClassification ?? IncidentClassification.OTHER,
      otherClassificationDetails: currentReport?.receiptDetails?.otherClassificationDetails ?? "",
    },
    documentStatus: currentReport?.documentStatus ?? DocumentStatus.OPEN,
  };

  const { formState, errors, isLoading, handleSubmit, getInputProps, getSelectProps, setFormState } =
    useForm<AccidentIncidentReport>({
      initialValues,
      submitAction: async (state, formData) => {
        return currentReport
          ? updateAccidentIncidentReport(state, formData)
          : createAccidentIncidentReport(state, formData);
      },
      onSuccess,
      onError: (error) => {
        console.log(error);
        onError?.(typeof error === "string" ? error : "Form validation failed");
      },
      resetOnSuccess: !currentReport,
    });

  const [projects, setProjects] = useState<Array<{ value: string; label: string }>>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingContact, setIsLoadingContact] = useState(true);
  const [contact, setContact] = useState<Contact | null>(null);


  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectData = await getProjects();
        const formattedProjects = projectData.map(project => ({
          value: project._id,
          label: project.name
        }));
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);


  useEffect(() => {
    // Only fetch contact data for new reports
    if (!currentReport?._id) {
      const fetchContact = async () => {
        try {
          setIsLoadingContact(true);
          const result = await getLoggedInUserContact();

          if (result.success && result.data) {
            const contactData = result.data as Contact;
            setContact(contactData);

            // Calculate age if birthDate is available
            let nAge = 0;
            let dob = "";

            if (contactData.birthDate) {
              dob = formatUKDate(contactData.birthDate);
              nAge = calculateAge(contactData.birthDate);
            }

            const fullAddress = [
              contactData.street,
              contactData.city,
              contactData.county,
              contactData.postCode,
              contactData.country
            ].filter(Boolean).join(', ');

            // Update form state with contact information
            setFormState(prev => ({
              ...prev,
              injuredPerson: {
                ...prev.injuredPerson,
                fullName: contactData.fullName,
                dob: dob,
                address: fullAddress,
                sex: Gender.Male,
                age: nAge,
                otherEmployerDetails: contactData.contactType !== ContactType.EMPLOYEE ? contactData.company || "" : ""
              },
              reportingPerson: {
                ...prev.reportingPerson,
                name: `${contactData.fullName}`,
                contactDetails: contactData.phone || contactData.email || ""
              }
            }));
          } else {
            console.error(result.error || 'Failed to load contact.');
          }
        } catch (error) {
          console.error('Error loading contact:', error);
        } finally {
          setIsLoadingContact(false);
        }
      };

      fetchContact();
    } else {
      setIsLoadingContact(false);
    }
  }, [currentReport, setFormState]);

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUKDate(e.target.value);
    e.target.value = formatted;
    console.log(formatted);
    getInputProps("injuredPerson.dob").onChange(e);
  };


  return (
    <>
      <div className="flex-1 overflow-y-auto px-6">
        <form id="accident-incident-form" action={handleSubmit} className="space-y-6">
          {currentReport?._id && (
            <input type="hidden" name="_id" value={currentReport._id} />
          )}

          <Card>
            <CardContent className="space-y-6 pt-6">
              {/* Project and Date Details */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2  bg-blue-50 dark:bg-blue-900/20 p-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Project</Label>
                  <SearchableSelect
                    {...getSelectProps("project._id")}
                    options={projects}
                    placeholder="Select project..."
                    isLoading={isLoadingProjects}
                  />
                  {errors["project._id"] && (
                    <p className="text-sm text-destructive">{errors["project._id"][0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Report Date</Label>
                  <Input
                    {...getInputProps("reportedDate")}
                    type="date"
                    value={formState.reportedDate ?
                      new Date(formState.reportedDate).toISOString().split('T')[0] : ''}
                  />
                  {errors.reportedDate && (
                    <p className="text-sm text-destructive">{errors.reportedDate[0]}</p>
                  )}
                </div>
              </div>

              {/* Injured Person Details */}
              <div className="space-y-4 bg-blue-50 dark:bg-blue-900/20 p-3">
                <h3 className="text-lg font-medium">Injured Person Details</h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Full Name</Label>
                    <Input {...getInputProps("injuredPerson.fullName")} />
                    {errors["injuredPerson.fullName"] && (
                      <p className="text-sm text-destructive">{errors["injuredPerson.fullName"][0]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Sex</Label>
                    <RadioGroup
                      value={formState.injuredPerson.sex}
                      onValueChange={(value) => {
                        setFormState({
                          ...formState,
                          injuredPerson: {
                            ...formState.injuredPerson,
                            sex: value as Gender
                          }
                        });
                      }}
                      className="flex items-center space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Male" id="sex-male" />
                        <Label htmlFor="sex-male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Female" id="sex-female" />
                        <Label htmlFor="sex-female">Female</Label>
                      </div>
                    </RadioGroup>
                    {errors["injuredPerson.sex"] && (
                      <p className="text-sm text-destructive">{errors["injuredPerson.sex"][0]}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date of Birth</Label>
                    <Input
                      {...getInputProps("injuredPerson?.dob")}
                      onChange={handleDobChange}
                      placeholder="DD/MM/YYYY"
                      maxLength={10}
                      required={false}
                    />
                    {errors["injuredPerson?.dob"] && (
                      <p className="text-sm text-destructive">{errors["injuredPerson?.dob"][0]}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Age</Label>
                    <Input
                      {...getInputProps("injuredPerson.age")}
                      type="number"
                      readOnly
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Address</Label>
                  <Textarea {...getInputProps("injuredPerson.address")} rows={3} />
                  {errors["injuredPerson.address"] && (
                    <p className="text-sm text-destructive">{errors["injuredPerson.address"][0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Is this person an employee?</Label>
                    <RadioGroup
                      value={formState.injuredPerson.contactType === ContactType.EMPLOYEE ? "true" : "false"}
                      onValueChange={(value) => {
                        setFormState(prev => ({
                          ...prev,
                          injuredPerson: {
                            ...prev.injuredPerson,
                            isEmployee: value === "true"
                          }
                        }));
                      }}
                      className="flex items-center space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="employee-yes" />
                        <Label htmlFor="employee-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="employee-no" />
                        <Label htmlFor="employee-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Other Employer Details</Label>
                  <Textarea {...getInputProps("injuredPerson.otherEmployerDetails")} rows={2} />
                  {errors["injuredPerson.otherEmployerDetails"] && (
                    <p className="text-sm text-destructive">{errors["injuredPerson.otherEmployerDetails"][0]}</p>
                  )}
                </div>

              </div>

              {/* Incident Type and First Aid */}
              <div className="space-y-4  bg-blue-50 dark:bg-blue-900/20 p-3">
                <h3 className="text-lg font-medium">Incident Information</h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Type</Label>
                    <Select
                      value={formState.incidentDetails.incidentType}
                      onValueChange={(value) => {
                        setFormState(prev => ({
                          ...prev,
                          incidentDetails: {
                            ...prev.incidentDetails,
                            type: value as AccidentType
                          }
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(AccidentType).map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors["incidentDetails.type"] && (
                      <p className="text-sm text-destructive">{errors["incidentDetails.type"][0]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Was First Aid administered?</Label>
                      <RadioGroup
                        value={formState.incidentDetails.firstAidAdministered ? "true" : "false"}
                        onValueChange={(value) => {
                          setFormState(prev => ({
                            ...prev,
                            incidentDetails: {
                              ...prev.incidentDetails,
                              firstAidAdministered: value === "true",
                              firstAidAdministeredBy: value === "false" ? "" : prev.incidentDetails.firstAidAdministeredBy
                            }
                          }));
                        }}
                        className="flex items-center space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="firstaid-yes" />
                          <Label htmlFor="firstaid-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="firstaid-no" />
                          <Label htmlFor="firstaid-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {formState.incidentDetails.firstAidAdministered && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">First Aid administered by</Label>
                    <Input {...getInputProps("incidentDetails.firstAidAdministeredBy")} />
                    {errors["incidentDetails.firstAidAdministeredBy"] && (
                      <p className="text-sm text-destructive">{errors["incidentDetails.firstAidAdministeredBy"][0]}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Details of Injuries</Label>
                  <Textarea
                    {...getInputProps("incidentDetails.injuryDetails")}
                    placeholder="Note site and type, e.g. laceration on left hand etc."
                    rows={3}
                  />
                  {errors["incidentDetails.injuryDetails"] && (
                    <p className="text-sm text-destructive">{errors["incidentDetails.injuryDetails"][0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">What advice if any did the First Aider give?</Label>
                  <Textarea {...getInputProps("incidentDetails.firstAiderAdvice")} rows={2} />
                  {errors["incidentDetails.firstAiderAdvice"] && (
                    <p className="text-sm text-destructive">{errors["incidentDetails.firstAiderAdvice"][0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">What did the injured person do after the incident?</Label>
                  <Select
                    value={formState.incidentDetails.personAction ?? ""}
                    onValueChange={(value) => {
                      setFormState(prev => ({
                        ...prev,
                        incidentDetails: {
                          ...prev.incidentDetails,
                          personAction: value as PersonAction
                        }
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PersonAction).map((action) => (
                        <SelectItem key={action} value={action}>{action}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors["incidentDetails.personAction"] && (
                    <p className="text-sm text-destructive">{errors["incidentDetails.personAction"][0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">What was the injured person doing at the time of the accident / incident?</Label>
                  <Textarea {...getInputProps("incidentDetails.activityAtTimeOfIncident")} rows={3} />
                  {errors["incidentDetails.activityAtTimeOfIncident"] && (
                    <p className="text-sm text-destructive">{errors["incidentDetails.activityAtTimeOfIncident"][0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">How did the accident / incident happen?</Label>
                  <Textarea {...getInputProps("incidentDetails.incidentDescription")} rows={3} />
                  {errors["incidentDetails.incidentDescription"] && (
                    <p className="text-sm text-destructive">{errors["incidentDetails.incidentDescription"][0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Did anyone witness the events and have they provided statements?</Label>
                  <Textarea {...getInputProps("incidentDetails.witnesses")} rows={2} />
                  {errors["incidentDetails.witnesses"] && (
                    <p className="text-sm text-destructive">{errors["incidentDetails.witnesses"][0]}</p>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4  bg-blue-50 dark:bg-blue-900/20 p-3">
                <h3 className="text-lg font-medium">Additional Information</h3>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">List any relevant conditions</Label>
                  <Textarea
                    {...getInputProps("incidentDetails.relevantConditions")}
                    placeholder="e.g. light, dark, wet, dry, personal protective equipment in use etc."
                    rows={2}
                  />
                  {errors["incidentDetails.relevantConditions"] && (
                    <p className="text-sm text-destructive">{errors["incidentDetails.relevantConditions"][0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">If manual handling related, list the size and weight of object being handled</Label>
                  <Textarea {...getInputProps("incidentDetails.manualHandlingDetails")} rows={2} />
                  {errors["incidentDetails.manualHandlingDetails"] && (
                    <p className="text-sm text-destructive">{errors["incidentDetails.manualHandlingDetails"][0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">What was the immediate cause of the accident / incident?</Label>
                  <Textarea
                    {...getInputProps("incidentDetails.immediateCause")}
                    placeholder="e.g. inattention, carelessness, running etc."
                    rows={2}
                  />
                  {errors["incidentDetails.immediateCause"] && (
                    <p className="text-sm text-destructive">{errors["incidentDetails.immediateCause"][0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">What was the underlying cause(s)?</Label>
                  <Textarea
                    {...getInputProps("incidentDetails.underlyingCause")}
                    placeholder="e.g. poor floor condition, inadequate lighting, poor housekeeping etc."
                    rows={2}
                  />
                  {errors["incidentDetails.underlyingCause"] && (
                    <p className="text-sm text-destructive">{errors["incidentDetails.underlyingCause"][0]}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Has the injured person provided a statement?</Label>
                      <RadioGroup
                        value={formState.incidentDetails.statementProvided ? "true" : "false"}
                        onValueChange={(value) => {
                          setFormState(prev => ({
                            ...prev,
                            incidentDetails: {
                              ...prev.incidentDetails,
                              statementProvided: value === "true"
                            }
                          }));
                        }}
                        className="flex items-center space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="statement-yes" />
                          <Label htmlFor="statement-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="statement-no" />
                          <Label htmlFor="statement-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Have photographs been taken?</Label>
                      <RadioGroup
                        value={formState.incidentDetails.photosTaken ? "true" : "false"}
                        onValueChange={(value) => {
                          setFormState(prev => ({
                            ...prev,
                            incidentDetails: {
                              ...prev.incidentDetails,
                              photosTaken: value === "true"
                            }
                          }));
                        }}
                        className="flex items-center space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="photos-yes" />
                          <Label htmlFor="photos-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="photos-no" />
                          <Label htmlFor="photos-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Has the risk assessment / method statement been reviewed?</Label>
                  <Textarea {...getInputProps("incidentDetails.riskAssessmentReviewed")} rows={2} />
                  {errors["incidentDetails.riskAssessmentReviewed"] && (
                    <p className="text-sm text-destructive">{errors["incidentDetails.riskAssessmentReviewed"][0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">What immediate actions have been taken to prevent a recurrence?</Label>
                  <Textarea {...getInputProps("incidentDetails.immediateActions")} rows={3} />
                  {errors["incidentDetails.immediateActions"] && (
                    <p className="text-sm text-destructive">{errors["incidentDetails.immediateActions"][0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">What further actions need to be planned?</Label>
                  <Textarea {...getInputProps("incidentDetails.plannedActions")} rows={3} />
                  {errors["incidentDetails.plannedActions"] && (
                    <p className="text-sm text-destructive">{errors["incidentDetails.plannedActions"][0]}</p>
                  )}
                </div>
              </div>

              {/* Person Completing Report */}
              <div className="space-y-4  bg-blue-50 dark:bg-blue-900/20 p-3">
                <h3 className="text-lg font-medium">Person Completing This Report</h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Name</Label>
                    <Input {...getInputProps("reportingPerson.name")} />
                    {errors["reportingPerson.name"] && (
                      <p className="text-sm text-destructive">{errors["reportingPerson.name"][0]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Contact Details</Label>
                    <Input {...getInputProps("reportingPerson.contactDetails")} />
                    {errors["reportingPerson.contactDetails"] && (
                      <p className="text-sm text-destructive">{errors["reportingPerson.contactDetails"][0]}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Receipt Details */}

              <div className="space-y-4  bg-blue-50 dark:bg-blue-900/20 p-3">
                <h3 className="text-lg font-medium">Report Receipt Details</h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Received By</Label>
                    <Input {...getInputProps("receiptDetails.name")} required={false} />
                    {errors["receiptDetails.name"] && (
                      <p className="text-sm text-destructive">{errors["receiptDetails.name"][0]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date Received</Label>
                    <Input
                      {...getInputProps("receiptDetails.date")}
                      type="date"
                      required={false}
                    />
                    {errors["receiptDetails.date"] && (
                      <p className="text-sm text-destructive">{errors["receiptDetails.date"][0]}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Has the HSE / EA been informed?</Label>
                    <RadioGroup
                      value={formState.receiptDetails?.hseInformed ? "true" : "false"}
                      onValueChange={(value) => {
                        setFormState(prev => ({
                          ...prev,
                          receiptDetails: {
                            ...prev.receiptDetails!,
                            hseInformed: value === "true"
                          }
                        }));
                      }}
                      className="flex items-center space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="hse-yes" />
                        <Label htmlFor="hse-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="hse-no" />
                        <Label htmlFor="hse-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {formState.receiptDetails?.hseInformed && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Reference Number</Label>
                      <Input {...getInputProps("receiptDetails.referenceNumber")} />
                      {errors["receiptDetails.referenceNumber"] && (
                        <p className="text-sm text-destructive">{errors["receiptDetails.referenceNumber"][0]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Date of Submission</Label>
                      <Input
                        {...getInputProps("receiptDetails.submissionDate")}
                        type="date"
                      />
                      {errors["receiptDetails.submissionDate"] && (
                        <p className="text-sm text-destructive">{errors["receiptDetails.submissionDate"][0]}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Type of Accident / Incident</Label>
                  <Select
                    value={formState.receiptDetails?.incidentClassification ?? ""}
                    onValueChange={(value) => {
                      setFormState(prev => ({
                        ...prev,
                        receiptDetails: {
                          ...prev.receiptDetails!,
                          incidentClassification: value as IncidentClassification,
                          otherClassificationDetails: value !== IncidentClassification.OTHER ? "" : prev.receiptDetails?.otherClassificationDetails
                        }
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select classification" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(IncidentClassification).map((classification) => (
                        <SelectItem key={classification} value={classification}>{classification}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors["receiptDetails.incidentClassification"] && (
                    <p className="text-sm text-destructive">{errors["receiptDetails.incidentClassification"][0]}</p>
                  )}
                </div>

                {formState.receiptDetails?.incidentClassification === IncidentClassification.OTHER && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Other Classification Details</Label>
                    <Input {...getInputProps("receiptDetails.otherClassificationDetails")} />
                    {errors["receiptDetails.otherClassificationDetails"] && (
                      <p className="text-sm text-destructive">{errors["receiptDetails.otherClassificationDetails"][0]}</p>
                    )}
                  </div>
                )}
              </div>

              {/* <div className="space-y-4">
                      <Label className="text-sm font-medium block">Type of Accident / Incident:</Label>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                       
                        
                        <div className="border p-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="classification-contact" 
                              checked={formState.receiptDetails?.incidentClassification === IncidentClassification.CONTACT_MACHINERY}
                              onCheckedChange={(checked) => 
                                handleClassificationChange(IncidentClassification.CONTACT_MACHINERY, !!checked)
                              }
                            />
                            <Label 
                              htmlFor="classification-contact"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Contact with moving machinery
                            </Label>
                          </div>
                        </div>
                        
                        <div className="border p-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="classification-struck-object" 
                              checked={formState.receiptDetails?.incidentClassification === IncidentClassification.STRUCK_OBJECT}
                              onCheckedChange={(checked) => 
                                handleClassificationChange(IncidentClassification.STRUCK_OBJECT, !!checked)
                              }
                            />
                            <Label 
                              htmlFor="classification-struck-object"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Struck by moving or falling object
                            </Label>
                          </div>
                        </div>
                        
                        <div className="border p-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="classification-struck-vehicle" 
                              checked={formState.receiptDetails?.incidentClassification === IncidentClassification.STRUCK_VEHICLE}
                              onCheckedChange={(checked) => 
                                handleClassificationChange(IncidentClassification.STRUCK_VEHICLE, !!checked)
                              }
                            />
                            <Label 
                              htmlFor="classification-struck-vehicle"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Struck by a moving vehicle
                            </Label>
                          </div>
                        </div>
                        
                        <div className="border p-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="classification-impact" 
                              checked={formState.receiptDetails?.incidentClassification === IncidentClassification.IMPACT_FIXED}
                              onCheckedChange={(checked) => 
                                handleClassificationChange(IncidentClassification.IMPACT_FIXED, !!checked)
                              }
                            />
                            <Label 
                              htmlFor="classification-impact"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Impact with something fixed or stationery
                            </Label>
                          </div>
                        </div>
                        
                        <div className="border p-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="classification-manual" 
                              checked={formState.receiptDetails?.incidentClassification === IncidentClassification.MANUAL_HANDLING}
                              onCheckedChange={(checked) => 
                                handleClassificationChange(IncidentClassification.MANUAL_HANDLING, !!checked)
                              }
                            />
                            <Label 
                              htmlFor="classification-manual"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Manual handling
                            </Label>
                          </div>
                        </div>
                        
                        <div className="border p-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="classification-slip" 
                              checked={formState.receiptDetails?.incidentClassification === IncidentClassification.SLIP_TRIP_FALL}
                              onCheckedChange={(checked) => 
                                handleClassificationChange(IncidentClassification.SLIP_TRIP_FALL, !!checked)
                              }
                            />
                            <Label 
                              htmlFor="classification-slip"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Slip, trip or fall
                            </Label>
                          </div>
                        </div>
                        
                        <div className="border p-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="classification-trapped" 
                              checked={formState.receiptDetails?.incidentClassification === IncidentClassification.TRAPPED}
                              onCheckedChange={(checked) => 
                                handleClassificationChange(IncidentClassification.TRAPPED, !!checked)
                              }
                            />
                            <Label 
                              htmlFor="classification-trapped"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Trapped
                            </Label>
                          </div>
                        </div>
                        
                        <div className="border p-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="classification-drowning" 
                              checked={formState.receiptDetails?.incidentClassification === IncidentClassification.DROWNING_ASPHYXIATION}
                              onCheckedChange={(checked) => 
                                handleClassificationChange(IncidentClassification.DROWNING_ASPHYXIATION, !!checked)
                              }
                            />
                            <Label 
                              htmlFor="classification-drowning"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Drowning or asphyxiation
                            </Label>
                          </div>
                        </div>
                        
                        <div className="border p-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="classification-coshh" 
                              checked={formState.receiptDetails?.incidentClassification === IncidentClassification.COSHH}
                              onCheckedChange={(checked) => 
                                handleClassificationChange(IncidentClassification.COSHH, !!checked)
                              }
                            />
                            <Label 
                              htmlFor="classification-coshh"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Coshh
                            </Label>
                          </div>
                        </div>
                        
                        <div className="border p-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="classification-fire" 
                              checked={formState.receiptDetails?.incidentClassification === IncidentClassification.FIRE_EXPLOSION}
                              onCheckedChange={(checked) => 
                                handleClassificationChange(IncidentClassification.FIRE_EXPLOSION, !!checked)
                              }
                            />
                            <Label 
                              htmlFor="classification-fire"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Fire or Explosion
                            </Label>
                          </div>
                        </div>
                        
                        <div className="border p-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="classification-electrical" 
                              checked={formState.receiptDetails?.incidentClassification === IncidentClassification.ELECTRICAL}
                              onCheckedChange={(checked) => 
                                handleClassificationChange(IncidentClassification.ELECTRICAL, !!checked)
                              }
                            />
                            <Label 
                              htmlFor="classification-electrical"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Electrical
                            </Label>
                          </div>
                        </div>
                        
                        <div className="border p-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="classification-other" 
                              checked={formState.receiptDetails?.incidentClassification === IncidentClassification.OTHER}
                              onCheckedChange={(checked) => 
                                handleClassificationChange(IncidentClassification.OTHER, !!checked)
                              }
                            />
                            <Label 
                              htmlFor="classification-other"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Other (Provide details below)
                            </Label>
                          </div>
                        </div>
                      </div>
                      
                      {errors["receiptDetails.classification"] && (
                        <p className="text-sm text-destructive">{errors["receiptDetails.classification"][0]}</p>
                      )}
                    </div> */}

              {formState.receiptDetails?.incidentClassification === IncidentClassification.OTHER && (
                <div className="col-span-4">
                  <div className="p-2">
                    <div className="flex items-start gap-2">

                      <div className="flex-grow">

                        <Input
                          {...getInputProps("receiptDetails.otherClassificationDetails")}
                          className="border-0 focus-visible:ring-0 shadow-none"
                        />
                        {errors["receiptDetails.otherClassificationDetails"] && (
                          <p className="text-sm text-destructive">{errors["receiptDetails.otherClassificationDetails"][0]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="col-span-4 text-sm text-muted-foreground italic mt-2">
                Attach any relevant notes, statements etc. on separate sheets.
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
      <ModalFooter>
        <Button
          type="button"
          onClick={onClose}
          className="bg-btn-cancel hover:bg-btn-cancel-hover text-btn-cancel-fg"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="accident-incident-form"
          disabled={isLoading}
          className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
        >
          {currentReport ? "Update" : "Submit"} Report
        </Button>
      </ModalFooter>
    </>
  );
}