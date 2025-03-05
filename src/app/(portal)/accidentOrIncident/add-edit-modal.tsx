"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/hooks/useForm";
import { useEffect, useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { ModalFooter } from "@/components/modal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { SearchableSelect } from "@/components/searchable-select";
import { DocumentStatus } from "@/lib/helpers/enum";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface AccidentReport {
  _id?: string;
  fullName: string;
  sex: 'M' | 'F';
  dateOfBirth: string;
  age: number;
  isEmployee: boolean;
  address: string;
  reportType: 'Accident' | 'Injury' | 'Near Miss' | 'Incident';
  otherEmployerDetails?: string;
  firstAidAdministered: boolean;
  administeredBy?: string;
  injuryDetails: string;
  firstAiderAdvice?: string;
  outcome: 'Return to work' | 'Go home' | 'Go to GP' | 'Go to Hospital';
  activityAtTimeOfIncident: string;
  incidentDescription: string;
  witnesses?: string;
  relevantConditions?: string;
  manualHandlingDetails?: string;
  immediateCause?: string;
  underlyingCause?: string;
  statementProvided: boolean;
  photographsTaken: boolean;
  riskAssessmentReviewed?: string;
  immediateActions?: string;
  furtherActions?: string;
  reporterName: string;
  reporterContact: string;
  receiverName?: string;
  receivedDate?: string;
  regulatorsInformed: boolean;
  referenceNumber?: string;
  submissionDate?: string;
  incidentType: string;
  otherIncidentDetails?: string;
  project: {
    _id: string;
    name: string;
  };
  documentStatus: DocumentStatus;
  signature: string;
  date: string;
}

interface AccidentReportFormProps {
  onClose: () => void;
  onSuccess?: (data: AccidentReport, message: string) => void;
  onError?: (error: string) => void;
  currentReport: AccidentReport | null;
}

const incidentTypes = [
  { id: 'moving-machinery', label: 'Contact with moving machinery' },
  { id: 'moving-object', label: 'Struck by moving or falling object' },
  { id: 'moving-vehicle', label: 'Struck by a moving vehicle' },
  { id: 'fixed-object', label: 'Impact with something fixed or stationery' },
  { id: 'manual-handling', label: 'Manual handling' },
  { id: 'slip-trip-fall', label: 'Slip, trip or fall' },
  { id: 'trapped', label: 'Trapped' },
  { id: 'drowning', label: 'Drowning or asphyxiation' },
  { id: 'coshh', label: 'COSHH' },
  { id: 'fire-explosion', label: 'Fire or Explosion' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'other', label: 'Other' }
];

export function AccidentReportForm({
  onClose,
  onSuccess,
  onError,
  currentReport,
}: AccidentReportFormProps) {
  const signaturePadRef = useRef<SignaturePad>(null);
  const [projects, setProjects] = useState<Array<{ value: string; label: string }>>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  const initialValues: AccidentReport = {
    _id: currentReport?._id ?? "",
    fullName: currentReport?.fullName ?? "",
    sex: currentReport?.sex ?? 'M',
    dateOfBirth: currentReport?.dateOfBirth ?? "",
    age: currentReport?.age ?? 0,
    isEmployee: currentReport?.isEmployee ?? true,
    address: currentReport?.address ?? "",
    reportType: currentReport?.reportType ?? 'Accident',
    otherEmployerDetails: currentReport?.otherEmployerDetails ?? "",
    firstAidAdministered: currentReport?.firstAidAdministered ?? false,
    administeredBy: currentReport?.administeredBy ?? "",
    injuryDetails: currentReport?.injuryDetails ?? "",
    firstAiderAdvice: currentReport?.firstAiderAdvice ?? "",
    outcome: currentReport?.outcome ?? 'Return to work',
    activityAtTimeOfIncident: currentReport?.activityAtTimeOfIncident ?? "",
    incidentDescription: currentReport?.incidentDescription ?? "",
    witnesses: currentReport?.witnesses ?? "",
    relevantConditions: currentReport?.relevantConditions ?? "",
    manualHandlingDetails: currentReport?.manualHandlingDetails ?? "",
    immediateCause: currentReport?.immediateCause ?? "",
    underlyingCause: currentReport?.underlyingCause ?? "",
    statementProvided: currentReport?.statementProvided ?? false,
    photographsTaken: currentReport?.photographsTaken ?? false,
    riskAssessmentReviewed: currentReport?.riskAssessmentReviewed ?? "",
    immediateActions: currentReport?.immediateActions ?? "",
    furtherActions: currentReport?.furtherActions ?? "",
    reporterName: currentReport?.reporterName ?? "",
    reporterContact: currentReport?.reporterContact ?? "",
    receiverName: currentReport?.receiverName ?? "",
    receivedDate: currentReport?.receivedDate ?? "",
    regulatorsInformed: currentReport?.regulatorsInformed ?? false,
    referenceNumber: currentReport?.referenceNumber ?? "",
    submissionDate: currentReport?.submissionDate ?? "",
    incidentType: currentReport?.incidentType ?? "",
    otherIncidentDetails: currentReport?.otherIncidentDetails ?? "",
    project: currentReport?.project ?? { _id: "", name: "" },
    documentStatus: currentReport?.documentStatus ?? DocumentStatus.SUBMITTED,
    signature: currentReport?.signature ?? "",
    date: currentReport?.date ?? new Date().toISOString().split("T")[0]
  };

  const { formState, errors, isLoading, handleSubmit, getInputProps, getSelectProps, setFormState } =
    useForm<AccidentReport>({
      initialValues,
      submitAction: async (state, formData) => {
        // This would be replaced with your actual API calls
        return currentReport
          ? updateAccidentReport(state, formData)
          : createAccidentReport(state, formData);
      },
      onSuccess,
      onError: (error) => {
        console.log(error);
        onError?.(typeof error === "string" ? error : "Form validation failed");
      },
      resetOnSuccess: !currentReport,
    });

  // Mock functions for form submission - would be replaced with actual server actions
  const createAccidentReport = async (state: any, formData: FormData) => {
    // Simulation of API call
    return { success: true, message: "Report created successfully", data: state };
  };

  const updateAccidentReport = async (state: any, formData: FormData) => {
    // Simulation of API call
    return { success: true, message: "Report updated successfully", data: state };
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Mock project data - would be replaced with actual API call similar to getProjects()
        const projectData = [
          { _id: "1", name: "Project A" },
          { _id: "2", name: "Project B" },
          { _id: "3", name: "Project C" }
        ];
        
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
    if (signaturePadRef.current && formState.signature) {
      signaturePadRef.current.fromDataURL(formState.signature);
    }
  }, [formState.signature]);

  const handleClearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  const handleSignatureEnd = () => {
    if (signaturePadRef.current) {
      const signatureData = signaturePadRef.current.toDataURL();
      setFormState(prev => ({
        ...prev,
        signature: signatureData
      }));
    }
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormState(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6">
        <form id="accident-report-form" action={handleSubmit} className="space-y-6">
          {currentReport?._id && (
            <input type="hidden" name="_id" value={currentReport._id} />
          )}

          <Card>
            <CardContent className="pt-6 space-y-6">
              <h3 className="text-lg font-semibold">Accident & Incident Report Form</h3>
              <p className="text-sm text-muted-foreground">
                To be completed for all accidents, near misses and environmental incidents. 
                This form must be forwarded to the Managing Director within 24 hours of the occurrence.
              </p>

              {/* Project Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Project</Label>
                <SearchableSelect
                  {...getSelectProps("project._id")}
                  options={projects}
                  placeholder="Select project..."
                  isLoading={isLoadingProjects}
                />
                {/* {errors["project._id"] && (
                  <p className="text-sm text-destructive">{errors["project._id"][0]}</p>
                )} */}
              </div>

              {/* Injured Person Details */}
              <div className="border p-4 rounded-md space-y-4">
                <h4 className="font-medium">Injured Person Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Full Name</Label>
                    <Input {...getInputProps("fullName")} />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName[0]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Sex</Label>
                    <RadioGroup
                      value={formState.sex}
                      onValueChange={(value) => setFormState(prev => ({ ...prev, sex: value as 'M' | 'F' }))}
                      className="flex items-center space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="M" id="sex-male" />
                        <Label htmlFor="sex-male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="F" id="sex-female" />
                        <Label htmlFor="sex-female">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date of Birth</Label>
                    <Input {...getInputProps("dateOfBirth")} type="date" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Age</Label>
                    <Input {...getInputProps("age")} type="number" min="0" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Employee?</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox 
                        id="isEmployee" 
                        checked={formState.isEmployee}
                        onCheckedChange={(checked) => handleCheckboxChange("isEmployee", checked as boolean)}
                      />
                      <Label htmlFor="isEmployee">Yes</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Other Employer Details</Label>
                    <Input {...getInputProps("otherEmployerDetails")} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Address</Label>
                  <Textarea {...getInputProps("address")} rows={2} />
                </div>
              </div>

              {/* Incident Type */}
              <div className="border p-4 rounded-md space-y-4">
                <h4 className="font-medium">Type of Report</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Report Type</Label>
                    <RadioGroup
                      value={formState.reportType}
                      onValueChange={(value) => setFormState(prev => ({ ...prev, reportType: value as AccidentReport['reportType'] }))}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Accident" id="report-accident" />
                        <Label htmlFor="report-accident">Accident</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Injury" id="report-injury" />
                        <Label htmlFor="report-injury">Injury</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Near Miss" id="report-nearmiss" />
                        <Label htmlFor="report-nearmiss">Near Miss</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Incident" id="report-incident" />
                        <Label htmlFor="report-incident">Incident</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">First Aid Administered?</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox 
                        id="firstAidAdministered" 
                        checked={formState.firstAidAdministered}
                        onCheckedChange={(checked) => handleCheckboxChange("firstAidAdministered", checked as boolean)}
                      />
                      <Label htmlFor="firstAidAdministered">Yes</Label>
                    </div>
                    
                    {formState.firstAidAdministered && (
                      <div className="mt-2">
                        <Label className="text-sm font-medium">Administered By</Label>
                        <Input {...getInputProps("administeredBy")} className="mt-1" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Injury Details */}
              <div className="border p-4 rounded-md space-y-4">
                <h4 className="font-medium">Injury & Outcome Details</h4>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Details of Injuries (Note site and type, e.g. laceration on left hand)</Label>
                  <Textarea {...getInputProps("injuryDetails")} rows={3} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">First Aider Advice (if applicable)</Label>
                  <Textarea {...getInputProps("firstAiderAdvice")} rows={2} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Outcome</Label>
                  <Select 
                    value={formState.outcome}
                    onValueChange={(value) => setFormState(prev => ({ ...prev, outcome: value as AccidentReport['outcome'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select outcome" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Return to work">Return to work</SelectItem>
                      <SelectItem value="Go home">Go home</SelectItem>
                      <SelectItem value="Go to GP">Go to GP</SelectItem>
                      <SelectItem value="Go to Hospital">Go to Hospital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Incident Details */}
              <div className="border p-4 rounded-md space-y-4">
                <h4 className="font-medium">Incident Details</h4>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">What was the injured person doing at the time?</Label>
                  <Textarea {...getInputProps("activityAtTimeOfIncident")} rows={2} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">How did the accident/incident happen?</Label>
                  <Textarea {...getInputProps("incidentDescription")} rows={2} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Did anyone witness the events? Have they provided statements?</Label>
                  <Textarea {...getInputProps("witnesses")} rows={2} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Relevant conditions (e.g. light, dark, wet, dry, PPE in use, etc.)</Label>
                  <Textarea {...getInputProps("relevantConditions")} rows={2} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">If manual handling related, list size and weight of object</Label>
                  <Textarea {...getInputProps("manualHandlingDetails")} rows={2} />
                </div>
              </div>

              {/* Causes and Actions */}
              <div className="border p-4 rounded-md space-y-4">
                <h4 className="font-medium">Causes and Actions</h4>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Immediate cause of the accident/incident</Label>
                  <Textarea {...getInputProps("immediateCause")} rows={2} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Underlying cause(s)</Label>
                  <Textarea {...getInputProps("underlyingCause")} rows={2} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="statementProvided" 
                        checked={formState.statementProvided}
                        onCheckedChange={(checked) => handleCheckboxChange("statementProvided", checked as boolean)}
                      />
                      <Label htmlFor="statementProvided">Statement Provided</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="photographsTaken" 
                        checked={formState.photographsTaken}
                        onCheckedChange={(checked) => handleCheckboxChange("photographsTaken", checked as boolean)}
                      />
                      <Label htmlFor="photographsTaken">Photographs Taken</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Has the risk assessment/method statement been reviewed?</Label>
                  <Textarea {...getInputProps("riskAssessmentReviewed")} rows={2} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">What immediate actions have been taken to prevent recurrence?</Label>
                  <Textarea {...getInputProps("immediateActions")} rows={2} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">What further actions need to be planned?</Label>
                  <Textarea {...getInputProps("furtherActions")} rows={2} />
                </div>
              </div>

              {/* Reporter Details */}
              <div className="border p-4 rounded-md space-y-4">
                <h4 className="font-medium">Reporter Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Name of person completing this report</Label>
                    <Input {...getInputProps("reporterName")} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Contact Details</Label>
                    <Input {...getInputProps("reporterContact")} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date</Label>
                  <Input
                    {...getInputProps("date")}
                    type="date"
                    value={formState.date ? 
                      new Date(formState.date).toISOString().split('T')[0] : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Signature</Label>
                  <div className="rounded-md p-2">
                    <SignaturePad
                      ref={signaturePadRef}
                      onEnd={handleSignatureEnd}
                      canvasProps={{
                        className: cn(
                          "signature-canvas w-full h-40 border border-gray-700 rounded-sm dark:bg-gray-700",
                          errors?.signature && "border-destructive"
                        ),
                      }}
                    />
                  </div>
                  {errors.signature && (
                    <p className="text-sm text-destructive">{errors.signature[0]}</p>
                  )}
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={handleClearSignature}>
                      Clear Signature
                    </Button>
                  </div>
                </div>
              </div>

              {/* Admin Section */}
              <div className="border p-4 rounded-md space-y-4">
                <h4 className="font-medium">For Office Use Only</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Name of person receiving this report</Label>
                    <Input {...getInputProps("receiverName")} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date received</Label>
                    <Input {...getInputProps("receivedDate")} type="date" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox 
                        id="regulatorsInformed" 
                        checked={formState.regulatorsInformed}
                        onCheckedChange={(checked) => handleCheckboxChange("regulatorsInformed", checked as boolean)}
                      />
                      <Label htmlFor="regulatorsInformed">Has the HSE/EA been informed?</Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Reference Number</Label>
                    <Input {...getInputProps("referenceNumber")} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date of submission</Label>
                    <Input {...getInputProps("submissionDate")} type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Type of Accident/Incident</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                    {incidentTypes.map(type => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`incidentType-${type.id}`}
                          checked={formState.incidentType === type.id}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormState(prev => ({ ...prev, incidentType: type.id }));
                            }
                          }}
                        />
                        <Label htmlFor={`incidentType-${type.id}`} className="text-sm">{type.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {formState.incidentType === 'other' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Other (provide details)</Label>
                    <Input {...getInputProps("otherIncidentDetails")} />
                  </div>
                )}
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
          Discard
        </Button>
        <Button
          type="submit"
          form="accident-report-form"
          disabled={isLoading}
          className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
        >
          Save
        </Button>
      </ModalFooter>
    </>
  );
}