import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ModalFooter } from '@/components/modal';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SearchableSelect } from "@/components/searchable-select"
import { SearchableSelectProps } from "@/lib/types"
import SignaturePad from "react-signature-canvas";
import { useForm } from "@/hooks/useForm";
import { HotWorkPermit, WorkIncludes } from "@/lib/types/hotWorkPermit";
import { Project } from "@/lib/types/project";
import { Contact } from '@/lib/types/contact';
import { DocumentStatus, StatusValues } from "@/lib/helpers/enum";
import { cn } from "@/lib/utils";
import { createHotWorkPermit } from "@/app/actions/hotWorkPermitActions";
import { getProjects } from '@/app/actions/dailyInspectionActions';


interface HotWorkPermitFormProps {
    onClose: () => void;
    onSuccess?: (data: HotWorkPermit, message: string) => void;
    onError?: (error: string) => void;
    currentPermit: HotWorkPermit | null;
}

export function HotWorkPermitForm({
    onClose,
    onSuccess,
    onError,
    currentPermit,
}: HotWorkPermitFormProps) {

    const [projectList, setProjectList] = useState<Array<{ value: string; label: string }>>([]);
    const [fullProjects, setFullProjects] = useState<Project[]>([]);
    const [project, setProject] = useState<Project | null>(null);

    const [supervisorList, setSupervisorList] = useState<Array<{ value: string; label: string }>>([]);

    const [isLoadingProjects, setIsLoadingProjects] = useState(true);

    const contractorSignatureRef = useRef<SignaturePad>(null);
    const operatorSignatureRef = useRef<SignaturePad>(null);
    const managementSignatureRef = useRef<SignaturePad>(null);
    const operatorCancellationSignatureRef = useRef<SignaturePad>(null);
    const managementCancellationSignatureRef = useRef<SignaturePad>(null);
    const finalInspectionSignatureRef = useRef<SignaturePad>(null);

    const defaultWorkIncludes: WorkIncludes = {
        brazing: false,
        torchCutting: false,
        grinding: false,
        soldering: false,
        welding: false,
    };


    const initialValues: HotWorkPermit = {


        _id: currentPermit?._id ?? "",
        project: currentPermit?.project ?? ({} as Project),
        companyName: currentPermit?.companyName ?? "",
        location: currentPermit?.location ?? "",
        jobNumber: currentPermit?.jobNumber ?? "",
        supervisor: currentPermit?.supervisor 
        ? {
            ...currentPermit.supervisor,
            _id: currentPermit.supervisor._id, 
            value: currentPermit.supervisor._id, 
            label: currentPermit.supervisor.fullName, 
          }:({} as Contact),
        workIncludes: currentPermit?.workIncludes ?? defaultWorkIncludes,
        permitNumber: currentPermit?.permitNumber ?? "",
        equipmentUsed: currentPermit?.equipmentUsed ?? "",
        startTime: currentPermit?.startTime ?? "",
        endTime: currentPermit?.endTime ?? "",
        dateOfWorks: currentPermit?.dateOfWorks ?? new Date().toISOString().split("T")[0],

        // Precautions checklist
        ceaseBeforeShiftEnd: currentPermit?.ceaseBeforeShiftEnd ?? StatusValues.NA,
        servicesIsolated: currentPermit?.servicesIsolated ?? StatusValues.NA,
        smokeDetectorsIsolated: currentPermit?.smokeDetectorsIsolated ?? StatusValues.NA,
        fireExtinguisherAvailable: currentPermit?.fireExtinguisherAvailable ?? StatusValues.NA,
        ppeProvided: currentPermit?.ppeProvided ?? StatusValues.NA,
        cylindersSecured: currentPermit?.cylindersSecured ?? StatusValues.NA,
        valvesCondition: currentPermit?.valvesCondition ?? StatusValues.NA,
        flashbackArrestors: currentPermit?.flashbackArrestors ?? StatusValues.NA,
        cylindersStorage: currentPermit?.cylindersStorage ?? StatusValues.NA,
        lpgStorage: currentPermit?.lpgStorage ?? StatusValues.NA,
        weldingStandards: currentPermit?.weldingStandards ?? StatusValues.NA,
        spentRodsImmersed: currentPermit?.spentRodsImmersed ?? StatusValues.NA,
        areaCleanAndTidy: currentPermit?.areaCleanAndTidy ?? StatusValues.NA,
        riserShaftSafety: currentPermit?.riserShaftSafety ?? StatusValues.NA,
        postWorkInspection: currentPermit?.postWorkInspection ?? StatusValues.NA,

        understandPermit: currentPermit?.understandPermit ?? StatusValues.NA,
        possessPermit: currentPermit?.possessPermit ?? StatusValues.NA,
        stopWorkIfRequired: currentPermit?.stopWorkIfRequired ?? StatusValues.NA,
        reportHazards: currentPermit?.reportHazards ?? StatusValues.NA,
        ensureAccess: currentPermit?.ensureAccess ?? StatusValues.NA,

        contractorConfirmation: currentPermit?.contractorConfirmation ?? {
            name: currentPermit?.contractorConfirmation?.name ?? "",
            position: currentPermit?.contractorConfirmation?.position ?? "",
            signature: currentPermit?.contractorConfirmation?.signature ?? "",
            //  date: currentPermit?.contractorConfirmation?.date ?? new Date(),
        },
        operatorConfirmation: currentPermit?.operatorConfirmation?? undefined,        
        managementAuthorization: currentPermit?.managementAuthorization,
        operatorCancellation: currentPermit?.operatorCancellation,
        managementCancellation: currentPermit?.managementCancellation, 
        finalInspection: currentPermit?.finalInspection, 
        documentStatus: currentPermit?.documentStatus ?? DocumentStatus.SUBMITTED
    };


    const { formState, errors, isLoading, handleSubmit, getInputProps, getSelectProps, setFormState } =
        useForm<HotWorkPermit>({
            initialValues,
            submitAction: async (state, formData) => {
                return createHotWorkPermit(state, formData);
            },
            onSuccess,
            onError: (error) => {
                console.log(error);
                onError?.(typeof error === "string" ? error : "Form validation failed");
            },
            resetOnSuccess: !currentPermit,
        });

    useEffect(() => {
        if (contractorSignatureRef.current && formState.contractorConfirmation?.signature) {
            contractorSignatureRef.current.fromDataURL(formState.contractorConfirmation.signature);
        }
    }, [formState.contractorConfirmation?.signature]);

    useEffect(() => {
        if (operatorSignatureRef.current && formState.operatorConfirmation?.signature) {
            operatorSignatureRef.current.fromDataURL(formState.operatorConfirmation.signature);
        }
    }, [formState.operatorConfirmation?.signature]);

    useEffect(() => {
        if (managementSignatureRef.current && formState.managementAuthorization?.signature) {
            managementSignatureRef.current.fromDataURL(formState.managementAuthorization.signature);
        }
    }, [formState.managementAuthorization?.signature]);

    useEffect(() => {
        if (operatorCancellationSignatureRef.current && formState.operatorCancellation?.signature) {
            operatorCancellationSignatureRef.current.fromDataURL(formState.operatorCancellation.signature);
        }
    }, [formState.operatorCancellation?.signature]);

    useEffect(() => {
        if (managementCancellationSignatureRef.current && formState.managementCancellation?.signature) {
            managementCancellationSignatureRef.current.fromDataURL(formState.managementCancellation.signature);
        }
    }, [formState.managementCancellation?.signature]);

    useEffect(() => {
        if (finalInspectionSignatureRef.current && formState.finalInspection?.signature) {
            finalInspectionSignatureRef.current.fromDataURL(formState.finalInspection.signature);
        }
    }, [formState.finalInspection?.signature]);


    useEffect(() => {
        const loadProjects = async () => {
            try {
                const projectData = await getProjects();
                setFullProjects(projectData);

                const formattedProjects = projectData.map(project => ({
                    value: project._id,
                    label: project.name
                }));


                setProjectList(formattedProjects);
            } catch (error) {
                console.error('Error loading projects:', error);
            } finally {
                setIsLoadingProjects(false);
            }
        };

        loadProjects();
    }, []);



    useEffect(() => {

        if (!project) return; 

        const supervisedByOptions =
          project?.supervisedBy?.map((supervisor) => ({
            value: supervisor._id,
            label: supervisor.fullName,
          })) ?? [];
      
        setSupervisorList(supervisedByOptions);      
       
        if (currentPermit?.supervisor) {
          const selectedSupervisor = supervisedByOptions.find(
            (option) => option.value === currentPermit?.supervisor?._id
          );
      
       
        }
      }, [project,formState.project]);


      useEffect(() => {
        if (fullProjects.length && currentPermit?.project?._id) {
          const selectedProject = fullProjects.find(
            (proj) => proj._id === currentPermit.project._id
          );
      
       
      
          if (selectedProject) setProject(selectedProject);
        }
      }, [fullProjects, currentPermit]);


    const handleChange = (value: any) => {

        const selectedProject = fullProjects.find(proj => proj._id === value) || null;
        setProject(selectedProject);

        // Update form state with full project details if available
        setFormState((prevState) => ({
            ...prevState,
            project: {
                ...prevState.project,
                _id: value,
            },
            location: selectedProject?.fullAddress || prevState.location,
           
        }));

    }

   

    const handleCheckboxChange = (key: keyof WorkIncludes, checked: boolean) => {
        setFormState((prevState) => ({
            ...prevState,
            workIncludes: {
                ...prevState.workIncludes,
                [key]: checked,
            },
        }));
    };

    const handleSignatureEnd = (
        ref: React.RefObject<SignaturePad>,
        field: string
    ) => {
        if (ref.current) {
            const signatureData = ref.current.toDataURL();
            setFormState((prev) => ({
                ...prev,
                [field]: {
                    ...(prev[field] || {}),
                    signature: signatureData,
                    date: new Date().toISOString().split("T")[0],
                },
            }));
        }
    };

    const handleClearSignature = (ref: React.RefObject<SignaturePad>) => {
        if (ref.current) {
            ref.current.clear();
        }
    };

    type StatusValuesKey = keyof Pick<HotWorkPermit,
        'ceaseBeforeShiftEnd' |
        'servicesIsolated' |
        'smokeDetectorsIsolated' |
        'fireExtinguisherAvailable' |
        'ppeProvided' |
        'cylindersSecured' |
        'valvesCondition' |
        'flashbackArrestors' |
        'cylindersStorage' |
        'lpgStorage' |
        'weldingStandards' |
        'spentRodsImmersed' |
        'areaCleanAndTidy' |
        'riserShaftSafety' |
        'postWorkInspection' |
        'understandPermit' |
        'possessPermit' |
        'stopWorkIfRequired' |
        'reportHazards' |
        'ensureAccess'
    >;

    const workIncludesFields = [
        { key: 'brazing', label: 'Brazing' },
        { key: 'torchCutting', label: 'Torch Cutting' },
        { key: 'grinding', label: 'Grinding' },
        { key: 'soldering', label: 'Soldering' },
        { key: 'welding', label: 'Welding' },
    ];




    const precautionsFields: Array<{ key: StatusValuesKey; label: string }> = [
        { key: "ceaseBeforeShiftEnd", label: "Hot works must cease at least one hour before the end of shift" },
        { key: "servicesIsolated", label: "Services affected must be isolated before work commences" },
        { key: "smokeDetectorsIsolated", label: "Isolate smoke detectors in the vicinity of the hot works" },
        { key: "fireExtinguisherAvailable", label: "A suitable fire extinguisher must be available and kept close at hand at all times" },
        { key: "ppeProvided", label: "Supervisor must ensure suitable PPE is provided & worn by operative" },
        { key: "cylindersSecured", label: "All cylinders must be transported and secured upright" },
        { key: "valvesCondition", label: "Valves and hoses must be in good condition" },
        { key: "flashbackArrestors", label: "All cylinders must have flash back arrestors fitted" },
        { key: "cylindersStorage", label: "When not in use cylinders must be shut off and returned to storage area" },
        { key: "lpgStorage", label: "LPG cylinders must not be left in building over night" },
        { key: "weldingStandards", label: "Welding equipment is to comply with current standards" },
        { key: "spentRodsImmersed", label: "Spent welding rods must be immersed in a bucket of water" },
        { key: "areaCleanAndTidy", label: "Work areas are to be kept tidy and free from combustible materials before and during the hot works. (Check both sides of partition walls in case heat can be transferred by conduction)" },
        { key: "riserShaftSafety", label: "When working in riser shafts or on staging cylinders, work will be secured and openings to other levels covered with a fire blanket or other non-combustible materials" },
        { key: "postWorkInspection", label: "Operatives must remain in the area for 15 minutes following completion of work to ensure there is no hot spot residue" },
    ];

    const operatorRequirementsFields: Array<{ key: StatusValuesKey; label: string }> = [
        { key: "understandPermit", label: "Must understand the permit conditions and the fire safety precautions" },
        { key: "possessPermit", label: "Must be always in possession of a permit" },
        { key: "stopWorkIfRequired", label: "Must stop work if required to do so by an authorised person" },
        { key: "reportHazards", label: "Must report immediately any hazard likely to affect the fire and safety precautions" },
        { key: "ensureAccess", label: "Must ensure a satisfactory access/egress from the work area" },

    ];


    return (
        <>
            <div className="flex-1 overflow-y-auto px-6">
                <form id="hot-work-form" action={handleSubmit} className="space-y-6">
                    {currentPermit?._id && (
                        <input type="hidden" name="_id" value={currentPermit._id} />
                    )}
                    <Card>
                        <CardContent className="space-y-6">

                            {/* Work Includes Section */}
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                <p className="text-sm font-thin text-gray-700 dark:text-gray-300 mb-2 ">
                                    Hot-work permits are required for any work involving open flames or producing heat and/or cutting sparks and must be prepared by a competent person.
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Hot works include:</p>

                                <div className="flex flex-wrap gap-4">
                                    {workIncludesFields.map(({ key, label }) => (
                                        <div key={key} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`workIncludes.${key}`}
                                                checked={formState.workIncludes[key as keyof WorkIncludes]}
                                                onChange={(e) => handleCheckboxChange(key as keyof WorkIncludes, e.target.checked)}
                                                className="form-checkbox"

                                            />
                                            <Label htmlFor={`workIncludes.${key}`} className="text-sm text-gray-700 dark:text-gray-300">
                                                {label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Project</Label>
                                    <SearchableSelect
                                        {...getSelectProps("project._id")}
                                        options={projectList}
                                        placeholder="Select project..."
                                        isLoading={isLoadingProjects}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Supervisor</Label>
                                    <SearchableSelect
                                        {...getSelectProps("supervisor._id")}
                                        options={supervisorList}
                                        placeholder="Search Supervisor..."
                                        isLoading={isLoadingProjects}
                                    />
                                    {errors["supervisor._id"] && (
                                        <p className="text-sm text-destructive">
                                            {errors["supervisor._id"][0]}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Location and Job Details */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input {...getInputProps("location")} />
                                </div>

                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                                <div className="space-y-2">
                                    <Label>Job Number</Label>
                                    <Input {...getInputProps("jobNumber")} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <Input {...getInputProps("companyName")} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
                                <div className="space-y-2">
                                    <Label>Equipment Used</Label>
                                    <Input {...getInputProps("equipmentUsed")} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Start Time</Label>
                                    <Input {...getInputProps("startTime")} type="time" />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Time</Label>
                                    <Input {...getInputProps("endTime")} type="time" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Date of Works</Label>
                                    <Input {...getInputProps("dateOfWorks")} type="date" />
                                </div>
                            </div>

                            <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                                    Precautions Checklist
                                </h3>
                                <div className="space-y-4">
                                    {precautionsFields.map(({ key, label }) => (
                                        <div
                                            key={key}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                                        >
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {label.trim()}
                                            </span>
                                            <RadioGroup
                                                value={formState[key]}
                                                onValueChange={(newValue) => {
                                                    setFormState((prev) => ({
                                                        ...prev,
                                                        [key]: newValue,
                                                    }));
                                                }}
                                                className="flex items-center space-x-4"
                                            >
                                                {Object.values(StatusValues).map((status) => (
                                                    <div key={status} className="flex items-center space-x-1">
                                                        <RadioGroupItem
                                                            value={status}
                                                            id={`${key}-${status}`}
                                                            className="w-4 h-4"
                                                        />
                                                        <Label
                                                            htmlFor={`${key}-${status}`}
                                                            className="text-xs text-gray-600 dark:text-gray-400"
                                                        >
                                                            {status}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                                    Operator Requirements
                                </h3>
                                <div className="space-y-4">
                                    {operatorRequirementsFields.map(({ key, label }) => (
                                        <div
                                            key={key}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                                        >
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {label}
                                            </span>
                                            <RadioGroup
                                                value={formState[key]}
                                                onValueChange={(newValue) => {
                                                    setFormState((prev) => ({
                                                        ...prev,
                                                        [key]: newValue,
                                                    }));
                                                }}
                                                className="flex items-center space-x-4"
                                            >
                                                {Object.values(StatusValues).map((status) => (
                                                    <div key={status} className="flex items-center space-x-1">
                                                        <RadioGroupItem
                                                            value={status}
                                                            id={`${key}-${status}`}
                                                            className="w-4 h-4"
                                                        />
                                                        <Label
                                                            htmlFor={`${key}-${status}`}
                                                            className="text-xs text-gray-600 dark:text-gray-400"
                                                        >
                                                            {status}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            {/* Signatures */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Signatures</h3>
                                {/* Contractor Signature */}
                                <div className="space-y-4">
                                    <h4>Contractor Confirmation</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            {...getInputProps("contractorConfirmation.name")}
                                            placeholder="Name"
                                        />
                                        <Input
                                            {...getInputProps("contractorConfirmation.position")}
                                            placeholder="Position"
                                        />
                                    </div>
                                    <div className="rounded-md p-2">
                                        <SignaturePad
                                            ref={contractorSignatureRef}
                                            onEnd={() => handleSignatureEnd(contractorSignatureRef, 'contractorConfirmation')}
                                            canvasProps={{
                                                className: cn("signature-canvas w-full h-40 border border-gray-700 rounded-sm dark:bg-gray-700")
                                            }}
                                        />

                                    </div>
                                    <div className="flex justify-between items-center">

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => handleClearSignature(contractorSignatureRef)}
                                        >
                                            Clear Signature
                                        </Button>
                                        {formState.contractorConfirmation?.date && (
                                            <p className="text-sm text-muted-foreground text-right dark:text-blue-400">
                                                Signed on: {new Date(formState.contractorConfirmation?.date).toLocaleString()}
                                            </p>
                                        )}
                                    </div>

                                </div>

                                {/* Operator Signature */}
                                <div className="space-y-4">
                                    <h4>Operator Confirmation</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            {...getInputProps("operatorConfirmation.name")}
                                            placeholder="Name"
                                        />
                                        <Input
                                            {...getInputProps("operatorConfirmation.position")}
                                            placeholder="Position"
                                        />
                                    </div>
                                    <div className="rounded-md p-2">
                                        <SignaturePad
                                            ref={operatorSignatureRef}
                                            onEnd={() => handleSignatureEnd(operatorSignatureRef, 'operatorConfirmation')}
                                            canvasProps={{
                                                className: cn("signature-canvas w-full h-40 border border-gray-700 rounded-sm dark:bg-gray-700")
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleClearSignature(operatorSignatureRef)}
                                    >
                                        Clear Signature
                                    </Button>
                                    {formState.operatorConfirmation?.date && (
                                            <p className="text-sm text-muted-foreground text-right dark:text-blue-400">
                                                Signed on: {new Date(formState.operatorConfirmation?.date).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Management Authorization Signature */}
                                <div className="space-y-4">
                                    <h4>Management Authorization</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            {...getInputProps("managementAuthorization.name")}
                                            placeholder="Name"
                                        />
                                        <Input
                                            {...getInputProps("managementAuthorization.position")}
                                            placeholder="Position"
                                        />
                                    </div>
                                    <div className="rounded-md p-2">
                                        <SignaturePad
                                            ref={managementSignatureRef}
                                            onEnd={() => handleSignatureEnd(managementSignatureRef, 'managementAuthorization')}
                                            canvasProps={{
                                                className: cn("signature-canvas w-full h-40 border border-gray-700 rounded-sm dark:bg-gray-700")
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleClearSignature(managementSignatureRef)}
                                    >
                                        Clear Signature
                                    </Button>
                                    {formState.managementAuthorization?.date && (
                                            <p className="text-sm text-muted-foreground text-right dark:text-blue-400">
                                                Signed on: {new Date(formState.managementAuthorization?.date).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Operator Cancellation Signature */}
                                <div className="space-y-4">
                                    <h4>Operator Cancellation</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            {...getInputProps("operatorCancellation.name")}
                                            placeholder="Name"
                                        />
                                        <Input
                                            {...getInputProps("operatorCancellation.position")}
                                            placeholder="Position"
                                        />
                                    </div>
                                    <div className="rounded-md p-2">
                                        <SignaturePad
                                            ref={operatorCancellationSignatureRef}
                                            onEnd={() => handleSignatureEnd(operatorCancellationSignatureRef, 'operatorCancellation')}
                                            canvasProps={{
                                                className: cn("signature-canvas w-full h-40 border border-gray-700 rounded-sm dark:bg-gray-700")
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleClearSignature(operatorCancellationSignatureRef)}
                                    >
                                        Clear Signature
                                    </Button>
                                    {formState.operatorCancellation?.date && (
                                            <p className="text-sm text-muted-foreground text-right dark:text-blue-400">
                                                Signed on: {new Date(formState.operatorCancellation?.date).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Management Cancellation Signature */}
                                <div className="space-y-4">
                                    <h4>Management Cancellation</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            {...getInputProps("managementCancellation.name")}
                                            placeholder="Name"
                                        />
                                        <Input
                                            {...getInputProps("managementCancellation.position")}
                                            placeholder="Position"
                                        />
                                    </div>
                                    <div className="rounded-md p-2">
                                        <SignaturePad
                                            ref={managementCancellationSignatureRef}
                                            onEnd={() => handleSignatureEnd(managementCancellationSignatureRef, 'managementCancellation')}
                                            canvasProps={{
                                                className: cn("signature-canvas w-full h-40 border border-gray-700 rounded-sm dark:bg-gray-700")
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleClearSignature(managementCancellationSignatureRef)}
                                    >
                                        Clear Signature
                                    </Button>
                                    {formState.managementCancellation?.date && (
                                            <p className="text-sm text-muted-foreground text-right dark:text-blue-400">
                                                Signed on: {new Date(formState.managementCancellation?.date).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Final Inspection Signature */}
                                <div className="space-y-4">
                                    <h4>Final Inspection</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            {...getInputProps("finalInspection.name")}
                                            placeholder="Name"
                                        />
                                        <Input
                                            {...getInputProps("finalInspection.position")}
                                            placeholder="Position"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <Input
                                            {...getInputProps("finalInspection.completedAfterHours")}
                                            placeholder="Completed After Hours"
                                        />
                                    </div>
                                    <div className="rounded-md p-2">
                                        <SignaturePad
                                            ref={finalInspectionSignatureRef}
                                            onEnd={() => handleSignatureEnd(finalInspectionSignatureRef, 'finalInspection')}
                                            canvasProps={{
                                                className: cn("signature-canvas w-full h-40 border border-gray-700 rounded-sm dark:bg-gray-700")
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleClearSignature(finalInspectionSignatureRef)}
                                    >
                                        Clear Signature
                                    </Button>
                                    {formState.finalInspection?.date && (
                                            <p className="text-sm text-muted-foreground text-right dark:text-blue-400">
                                                Signed on: {new Date(formState.finalInspection?.date).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Similar sections for operator and management signatures */}
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
                    form="hot-work-form"
                    disabled={isLoading}
                    className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
                >
                    Save
                </Button>
            </ModalFooter>
        </>
    );
}