import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ModalFooter } from "@/components/modal";
import SignaturePad from "react-signature-canvas";
import { cn } from "@/lib/utils";
import { DocumentStatus } from "@/lib/helpers/enum";
import { HeightPermit } from '@/lib/types/heightPermit';
import { saveHeightPermit } from '@/app/actions/heightPermitActions';
import { useForm } from "@/hooks/useForm";
import { SearchableSelect } from '@/components/searchable-select';
import { Project } from "@/lib/types/project";
import { getProjects } from '@/app/actions/dailyInspectionActions';


interface HeightPermitFormProps {
    onClose: () => void;
    onSuccess?: (data: any, message: string) => void;
    onError?: (error: string) => void;
    currentPermit: HeightPermit | null;
}

const sectionClasses = "p-4 rounded-lg mb-6";
const sectionColors = [
    "bg-blue-50 dark:bg-blue-900/20", // Permit Details
    "bg-green-50 dark:bg-green-900/20", // Equipment section
    "bg-amber-50 dark:bg-amber-900/20", // Services section
    "bg-purple-50 dark:bg-purple-900/20", // Control Measures
    "bg-rose-50 dark:bg-rose-900/20", // Environmental Factors
    "bg-sky-50 dark:bg-sky-900/20", // Authorization sections
    "bg-orange-50 dark:bg-orange-900/20", // Cancellation section
    "bg-teal-50 dark:bg-teal-900/20", // Final Sign Off section
];

type FormSection = 'equipment' | 'services' | 'controlMeasures' | 'environmental';

type SectionType<T extends FormSection> =
    T extends 'equipment' ? HeightPermit['equipment'] :
    T extends 'services' ? HeightPermit['services'] :
    T extends 'controlMeasures' ? HeightPermit['controlMeasures'] :
    T extends 'environmental' ? HeightPermit['environmental'] : never;

// Section configuration for dynamic rendering
interface SectionConfig {
    key: FormSection;
    title: string;
    fields: Array<{
        key: string;
        label: string;
    }>;
    otherFieldKey: string;
    otherFieldLabel: string;
}

export function HeightPermitForm({
    onClose,
    onSuccess,
    onError,
    currentPermit,
}: HeightPermitFormProps) {
    const signatureRefIssuedTo = useRef<SignaturePad>(null);
    const signatureRefIssuedBy = useRef<SignaturePad>(null);
    const signatureRefCancelledBy = useRef<SignaturePad>(null);
    const signatureRefFinalSignOffBy = useRef<SignaturePad>(null);

    // Initialize form state with default values or values from currentPermit
    const initialValues: HeightPermit = {

        _id: currentPermit?._id ?? "",
        project: currentPermit?.project ?? ({} as Project),
        date: currentPermit?.date || new Date().toISOString().split("T")[0],
        issueDate: currentPermit?.issueDate || new Date().toISOString().split("T")[0],
        lastReviewedDate: currentPermit?.lastReviewedDate || new Date().toISOString().split("T")[0],
        nextReviewDate: currentPermit?.nextReviewDate || new Date().toISOString().split("T")[0],
        site: currentPermit?.site || "",
        location: currentPermit?.location || "",
        contractor: currentPermit?.contractor || "",
        phoneNumber: currentPermit?.phoneNumber || "",
        validFrom: currentPermit?.validFrom || "",
        validFromTime: currentPermit?.validFromTime || "",
        validTo: currentPermit?.validTo || "",
        validToTime: currentPermit?.validToTime || "",
        descriptionOfWorks: currentPermit?.descriptionOfWorks || "",
        equipment: {
            stepLadders: currentPermit?.equipment?.stepLadders || false,
            mobileScaffold: currentPermit?.equipment?.mobileScaffold || false,
            extensionLadder: currentPermit?.equipment?.extensionLadder || false,
            mewp: currentPermit?.equipment?.mewp || false,
            correctFootwear: currentPermit?.equipment?.correctFootwear || false,
            edgeProtection: currentPermit?.equipment?.edgeProtection || false,
            safetyNet: currentPermit?.equipment?.safetyNet || false,
            ropesHarnesses: currentPermit?.equipment?.ropesHarnesses || false,
            otherEquipment: currentPermit?.equipment?.otherEquipment || ""
        },
        services: {
            smokeDetectors: currentPermit?.services?.smokeDetectors || false,
            pipesTanks: currentPermit?.services?.pipesTanks || false,
            electricalOutlets: currentPermit?.services?.electricalOutlets || false,
            otherServices: currentPermit?.services?.otherServices || ""
        },
        controlMeasures: {
            barriers: currentPermit?.controlMeasures?.barriers || false,
            banksman: currentPermit?.controlMeasures?.banksman || false,
            signage: currentPermit?.controlMeasures?.signage || false,
            otherMeasures: currentPermit?.controlMeasures?.otherMeasures || ""
        },
        environmental: {
            weather: currentPermit?.environmental?.weather || false,
            groundConditions: currentPermit?.environmental?.groundConditions || false,
            storedMaterials: currentPermit?.environmental?.storedMaterials || false,
            otherEnvironmental: currentPermit?.environmental?.otherEnvironmental || ""
        },
        confirmationStatus: {
            issuedTo: currentPermit?.confirmationStatus?.issuedTo || false,
            issuedBy: currentPermit?.confirmationStatus?.issuedBy || false,
            cancelledBy: currentPermit?.confirmationStatus?.cancelledBy || false,
            signedOffBy: currentPermit?.confirmationStatus?.signedOffBy || false,

        },

        authorization: {
            issuedToName: currentPermit?.authorization?.issuedToName || "",
            issuedToSignature: currentPermit?.authorization?.issuedToSignature || "",
            issuedToDate: currentPermit?.authorization?.issuedToDate || new Date().toISOString().split("T")[0],
            issuedByName: currentPermit?.authorization?.issuedByName || "",
            issuedBySignature: currentPermit?.authorization?.issuedBySignature || "",
            issuedByDate: currentPermit?.authorization?.issuedByDate || new Date().toISOString().split("T")[0]
        },
        cancellation: {
            cancelledByName: currentPermit?.cancellation?.cancelledByName || "",
            cancelledByDate: currentPermit?.cancellation?.cancelledByDate || new Date().toISOString().split("T")[0],
            cancelledBySignature: currentPermit?.cancellation?.cancelledBySignature || "",
            cancellationReason: currentPermit?.cancellation?.cancellationReason || "",
            cancellationDate: currentPermit?.cancellation?.cancellationDate || new Date().toISOString().split("T")[0],
            cancellationTime: currentPermit?.cancellation?.cancellationTime || "",

        },
        finalSignOff: {
            signedOffByName: currentPermit?.finalSignOff?.signedOffByName || "",
            signedOffByDate: currentPermit?.finalSignOff?.signedOffByDate || new Date().toISOString().split("T")[0],
            signedOffBySignature: currentPermit?.finalSignOff?.signedOffBySignature || "",
        },
        documentStatus: currentPermit?.documentStatus || DocumentStatus.SUBMITTED
    };


    // Section configurations for dynamic rendering
    const sections: SectionConfig[] = [
        {
            key: 'equipment',
            title: 'Equipment to be Used',
            fields: [
                { key: 'stepLadders', label: 'Step Ladders' },
                { key: 'mobileScaffold', label: 'Mobile Scaffold' },
                { key: 'extensionLadder', label: 'Extension Ladder' },
                { key: 'mewp', label: 'MEWP' },
                { key: 'correctFootwear', label: 'Correct Footwear' },
                { key: 'edgeProtection', label: 'Edge Protection' },
                { key: 'safetyNet', label: 'Safety Net' },
                { key: 'ropesHarnesses', label: 'Ropes / Harnesses' }
            ],
            otherFieldKey: 'otherEquipment',
            otherFieldLabel: 'Other Equipment'
        },
        {
            key: 'services',
            title: 'Services Isolated',
            fields: [
                { key: 'smokeDetectors', label: 'Smoke / Thermal Detectors' },
                { key: 'pipesTanks', label: 'Pipes, Tanks & Valves' },
                { key: 'electricalOutlets', label: 'Electrical Outlets / Appliances' }
            ],
            otherFieldKey: 'otherServices',
            otherFieldLabel: 'Other Services'
        },
        {
            key: 'controlMeasures',
            title: 'Control Measures',
            fields: [
                { key: 'barriers', label: 'Barriers' },
                { key: 'banksman', label: 'Banksman' },
                { key: 'signage', label: 'Signage' }
            ],
            otherFieldKey: 'otherMeasures',
            otherFieldLabel: 'Other Control Measures'
        },
        {
            key: 'environmental',
            title: 'Environmental Factors',
            fields: [
                { key: 'weather', label: 'Weather / Wind' },
                { key: 'groundConditions', label: 'Ground Conditions' },
                { key: 'storedMaterials', label: 'Stored Materials' }
            ],
            otherFieldKey: 'otherEnvironmental',
            otherFieldLabel: 'Other Environmental Factors'
        }
    ];


    const { formState, errors, isLoading, handleSubmit, getInputProps, getSelectProps, setFormState } =
        useForm<HeightPermit>({
            initialValues,
            submitAction: async (state, formData) => {
                return saveHeightPermit(state, formData);
            },
            onSuccess,
            onError: (error) => {
                console.log(error);
                onError?.(typeof error === "string" ? error : "Form validation failed");
            },
            resetOnSuccess: !currentPermit,
        });

    const [projectList, setProjectList] = useState<Array<{ value: string; label: string }>>([]);
    const [fullProjects, setFullProjects] = useState<Project[]>([]);
    const [project, setProject] = useState<Project | null>(null);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);

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


    useEffect(() => {
        if (signatureRefIssuedTo.current && formState.authorization.issuedToSignature) {
            signatureRefIssuedTo.current.fromDataURL(formState.authorization.issuedToSignature);
        }
        if (signatureRefIssuedBy.current && formState.authorization.issuedBySignature) {
            signatureRefIssuedBy.current.fromDataURL(formState.authorization.issuedBySignature);
        }
        if (signatureRefCancelledBy.current && formState.cancellation.cancelledBySignature) {
            signatureRefCancelledBy.current.fromDataURL(formState.cancellation.cancelledBySignature);
        }
        if (signatureRefFinalSignOffBy.current && formState.finalSignOff.signedOffBySignature) {
            signatureRefFinalSignOffBy.current.fromDataURL(formState.finalSignOff.signedOffBySignature);
        }
    }, [formState.authorization.issuedToSignature, formState.authorization.issuedBySignature,
        formState.cancellation.cancelledBySignature, formState.finalSignOff.signedOffBySignature]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Handle nested properties using dot notation
        if (name.includes('.')) {
            const [section, field] = name.split('.');
            setFormState(prev => ({
                ...prev,
                [section]: {
                    ...prev[section as keyof typeof prev] as Record<string, any>,
                    [field]: value
                }
            }));
        } else {
            setFormState(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCheckboxChange = (section: FormSection, field: string) => {
        setFormState(prev => {
            // Cast to any to avoid TypeScript errors with dynamic indexing
            const sectionData = prev[section] as any;
            return {
                ...prev,
                [section]: {
                    ...sectionData,
                    [field]: typeof sectionData[field] === 'boolean'
                        ? !sectionData[field]
                        : false
                }
            };
        });
    };

    const handleClearSignature = (ref: React.RefObject<SignaturePad>, signatureField: 'issuedToSignature' | 'issuedBySignature'
        | 'cancelledBySignature' | 'signedOffBySignature') => {
        if (ref.current) {
            ref.current.clear();

            if (signatureField === 'issuedToSignature') {
                setFormState(prev => ({
                    ...prev,
                    authorization: {
                        ...prev.authorization,
                        [signatureField]: ""
                    },
                    confirmationStatus: {
                        ...prev.confirmationStatus,
                        issuedTo: false

                    }
                }));
            }
            else if (signatureField === 'issuedBySignature') {
                setFormState(prev => ({
                    ...prev,
                    authorization: {
                        ...prev.authorization,
                        [signatureField]: ""
                    },
                    confirmationStatus: {
                        ...prev.confirmationStatus,
                        issuedBy: false

                    }
                }))
                // setIsSignatureConfirmed(prev => ({ ...prev, issuedBy: false }));
            }
            else if (signatureField === 'cancelledBySignature') {
                setFormState(prev => ({
                    ...prev,
                    cancellation: {
                        ...prev.cancellation,
                        [signatureField]: ""
                    },
                    confirmationStatus: {
                        ...prev.confirmationStatus,
                        cancelledBy: false

                    }
                }));

            }
            else {
                // setFormState(prev => ({ ...prev, confirmationStatus:{...prev.confirmationStatus,i} false })); 
                setFormState(prev => ({
                    ...prev,
                    finalSignOff: {
                        ...prev.finalSignOff,
                        [signatureField]: ""
                    },
                    confirmationStatus: {
                        ...prev.confirmationStatus,
                        signedOffBy: false

                    }
                }));

            }
        }
    };


    const handleCompletionSignatureEnd = (ref: React.RefObject<SignaturePad>, signatureField: 'cancelledBySignature' | 'signedOffBySignature') => {
        if (ref.current) {
            const signatureData = ref.current.toDataURL();
            if (signatureField == "cancelledBySignature") {
                setFormState(prev => ({
                    ...prev,
                    cancellation: {
                        ...prev.cancellation,
                        [signatureField]: signatureData
                    }
                }));
            }
            else {
                setFormState(prev => ({
                    ...prev,
                    finalSignOff: {
                        ...prev.finalSignOff,
                        [signatureField]: signatureData
                    },
                    confirmationStatus: {
                        ...prev.confirmationStatus,
                        signedOffBy: true

                    }
                }));

            }


        }
    };

    const handleSignatureEnd = (ref: React.RefObject<SignaturePad>, signatureField: 'issuedToSignature' | 'issuedBySignature') => {
        if (ref.current) {
            const signatureData = ref.current.toDataURL();
            setFormState(prev => ({
                ...prev,
                authorization: {
                    ...prev.authorization,
                    [signatureField]: signatureData
                },

            }));


        }
    };





    return (
        <>
            <div className="flex-1 overflow-y-auto px-6">
                <form id="height-permit-form" action={handleSubmit} className="space-y-6">
                    {currentPermit?._id && (
                        <input type="hidden" name="_id" value={currentPermit._id} />
                    )}

                    <Card>
                        <CardContent className="space-y-6 pt-6">
                            {/* Header Section */}
                            <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-md">
                                <h2 className="text-xl font-bold text-center pb-2  mb-4">Working at Height Permit</h2>
                                <div className="grid grid-cols-3 gap-6 sm:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="issueDate">Issue Date</Label>
                                        <div className="flex space-x-2">
                                            <Input
                                                id="issueDate"
                                                type="date"
                                                name="issueDate"
                                                value={formState.issueDate}
                                                onChange={handleInputChange}
                                                className={errors.issueDate ? "border-red-500" : ""}
                                            />
                                        </div>
                                        {errors.issueDate && (
                                            <p className="text-sm text-red-500">{errors.issueDate}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastReviewedDate">Last Reviewed</Label>
                                        <div className="flex space-x-2">
                                            <Input
                                                id="lastReviewedDate"
                                                type="date"
                                                name="lastReviewedDate"
                                                value={formState.lastReviewedDate}
                                                onChange={handleInputChange}
                                                className={errors.lastReviewedDate ? "border-red-500" : ""}
                                            />
                                        </div>
                                        {errors.lastReviewedDate && (
                                            <p className="text-sm text-red-500">{errors.lastReviewedDate}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nextReviewDate">Next Review Date</Label>
                                        <div className="flex space-x-2">
                                            <Input
                                                id="nextReviewDate"
                                                type="date"
                                                name="nextReviewDate"
                                                value={formState.nextReviewDate}
                                                onChange={handleInputChange}
                                                className={errors.nextReviewDate ? "border-red-500" : ""}
                                            />
                                        </div>
                                        {errors.nextReviewDate && (
                                            <p className="text-sm text-red-500">{errors.nextReviewDate}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Permit Details Section */}
                            <div className={`${sectionClasses} ${sectionColors[0]}`}>
                                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Permit Details</h3>
                                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2">
                                    <div className="space-y-2 ml-2 mb-2">
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
                                        <Label htmlFor="date">Date</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            name="date"
                                            value={formState.date}
                                            onChange={handleInputChange}
                                            className={errors.date ? "border-red-500" : ""}
                                        />
                                        {errors.date && (
                                            <p className="text-sm text-red-500">{errors.date}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 mt-4">
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
                                        <div className="space-y-2">
                                            <Label>Location</Label>
                                            <Input {...getInputProps("location")} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="contractor">Contractor / Employer</Label>
                                            <Input
                                                id="contractor"
                                                name="contractor"
                                                value={formState.contractor}
                                                onChange={handleInputChange}
                                                className={errors.contractor ? "border-red-500" : ""}
                                            />
                                            {errors.contractor && (
                                                <p className="text-sm text-red-500">{errors.contractor}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phoneNumber">Phone Number</Label>
                                            <Input
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                value={formState.phoneNumber}
                                                onChange={handleInputChange}
                                                className={errors.phoneNumber ? "border-red-500" : ""}
                                            />
                                            {errors.phoneNumber && (
                                                <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="validFrom">Permit Valid From</Label>
                                            <div className="flex space-x-2">
                                                <Input
                                                    id="validFrom"
                                                    type="date"
                                                    name="validFrom"
                                                    value={formState.validFrom}
                                                    onChange={handleInputChange}
                                                    className={errors.validFrom ? "border-red-500" : ""}
                                                />
                                                <Input
                                                    id="validFromTime"
                                                    type="time"
                                                    name="validFromTime"
                                                    value={formState.validFromTime}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            {errors.validFrom && (
                                                <p className="text-sm text-red-500">{errors.validFrom}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="validTo">Permit Valid To</Label>
                                            <div className="flex space-x-2">
                                                <Input
                                                    id="validTo"
                                                    type="date"
                                                    name="validTo"
                                                    value={formState.validTo}
                                                    onChange={handleInputChange}
                                                    className={errors.validTo ? "border-red-500" : ""}
                                                />
                                                <Input
                                                    id="validToTime"
                                                    type="time"
                                                    name="validToTime"
                                                    value={formState.validToTime}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            {errors.validTo && (
                                                <p className="text-sm text-red-500">{errors.validTo}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="descriptionOfWorks">Description of Works</Label>
                                        <Textarea
                                            id="descriptionOfWorks"
                                            name="descriptionOfWorks"
                                            value={formState.descriptionOfWorks}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className={errors.descriptionOfWorks ? "border-red-500" : ""}
                                        />
                                        {errors.descriptionOfWorks && (
                                            <p className="text-sm text-red-500">{errors.descriptionOfWorks}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic sections using the sections configuration */}
                            {sections.map((section, index) => (
                                <div key={section.key} className={`${sectionClasses} ${sectionColors[index + 1]}`}>
                                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">{section.title}</h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {section.fields.map((field) => (
                                            <div key={field.key} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`${section.key}.${field.key}`}
                                                    checked={(formState[section.key] as any)[field.key] || false}
                                                    onChange={() => handleCheckboxChange(section.key, field.key)}
                                                    className="h-4 w-4"
                                                />
                                                <Label htmlFor={`${section.key}.${field.key}`}>{field.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2 mt-4">
                                        <Label htmlFor={`${section.key}.${section.otherFieldKey}`}>{section.otherFieldLabel}</Label>
                                        <Input
                                            id={`${section.key}.${section.otherFieldKey}`}
                                            name={`${section.key}.${section.otherFieldKey}`}
                                            value={(formState[section.key] as any)[section.otherFieldKey] || ''}
                                            onChange={handleInputChange}
                                            placeholder={`Specify other ${section.title.toLowerCase()}`}
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Issued To Section */}
                            <div className={`${sectionClasses} ${sectionColors[5]}`}>
                                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Issued To</h3>
                                <div className="flex items-center space-x-2 mb-4">
                                    <input
                                        type="checkbox"
                                        id="confirmationStatus.issuedTo"
                                        className="h-4 w-4"
                                        checked={formState.confirmationStatus?.issuedTo}
                                        onChange={(e) => {
                                            setFormState(prev => ({
                                                ...prev,
                                                confirmationStatus: {
                                                    ...prev.confirmationStatus,
                                                    issuedTo: e.target.checked
                                                }

                                            }));
                                        }}
                                    />
                                    <Label htmlFor="confirmationStatus.issuedTo">
                                        I confirm this is my signature
                                    </Label>
                                </div>

                                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="authorization.issuedToName">Name</Label>
                                        <Input
                                            id="authorization.issuedToName"
                                            name="authorization.issuedToName"
                                            value={formState.authorization.issuedToName}
                                            onChange={handleInputChange}
                                            className={errors["authorization.issuedToName"] ? "border-red-500" : ""}
                                        />
                                        {errors["authorization.issuedToName"] && (
                                            <p className="text-sm text-red-500">{errors["authorization.issuedToName"]}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="authorization.issuedToDate">Date</Label>
                                        <Input
                                            id="authorization.issuedToDate"
                                            type="date"
                                            name="authorization.issuedToDate"
                                            value={formState.authorization.issuedToDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <Label>Signature</Label>
                                    <div className="rounded-md p-2">
                                        <SignaturePad
                                            ref={signatureRefIssuedTo}
                                            onEnd={() => handleSignatureEnd(signatureRefIssuedTo, 'issuedToSignature')}
                                            canvasProps={{
                                                className: cn(
                                                    "signature-canvas w-full h-40 border border-gray-700 rounded-sm dark:bg-gray-700",
                                                    errors["authorization.issuedToSignature"] && "border-red-500"
                                                ),
                                            }}
                                        />
                                        {errors["authorization.issuedToSignature"] && (
                                            <p className="text-sm text-red-500">{errors["authorization.issuedToSignature"]}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleClearSignature(signatureRefIssuedTo, 'issuedToSignature')}
                                    >
                                        Clear Signature
                                    </Button>
                                </div>
                            </div>

                            {/* Issued By Section */}
                            <div className={`${sectionClasses} ${sectionColors[5]}`}>
                                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Issued By</h3>
                                <div className="flex items-center space-x-2 mb-4">
                                    <input
                                        type="checkbox"
                                        id="confirmationStatus.issuedBy"
                                        className="h-4 w-4"
                                        checked={formState.confirmationStatus?.issuedBy}
                                        onChange={(e) => {
                                            setFormState(prev => ({
                                                ...prev,
                                                confirmationStatus: {
                                                    ...prev.confirmationStatus,
                                                    issuedBy: e.target.checked
                                                }

                                            }));
                                        }}
                                    />
                                    <Label htmlFor="confirmationStatus.issuedBy">
                                        I confirm this is my signature
                                    </Label>
                                </div>

                                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="authorization.issuedByName">Name</Label>
                                        <Input
                                            id="authorization.issuedByName"
                                            name="authorization.issuedByName"
                                            value={formState.authorization.issuedByName}
                                            onChange={handleInputChange}
                                            className={errors["authorization.issuedByName"] ? "border-red-500" : ""}
                                        />
                                        {errors["authorization.issuedByName"] && (
                                            <p className="text-sm text-red-500">{errors["authorization.issuedByName"]}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="authorization.issuedByDate">Date</Label>
                                        <Input
                                            id="authorization.issuedByDate"
                                            type="date"
                                            name="authorization.issuedByDate"
                                            value={formState.authorization.issuedByDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <Label>Signature</Label>
                                    <div className="rounded-md p-2">
                                        <SignaturePad
                                            ref={signatureRefIssuedBy}
                                            onEnd={() => handleSignatureEnd(signatureRefIssuedBy, 'issuedBySignature')}
                                            canvasProps={{
                                                className: cn(
                                                    "signature-canvas w-full h-40 border border-gray-700 rounded-sm dark:bg-gray-700",
                                                    errors["authorization.issuedBySignature"] && "border-red-500"
                                                ),
                                            }}
                                        />
                                        {errors["authorization.issuedBySignature"] && (
                                            <p className="text-sm text-red-500">{errors["authorization.issuedBySignature"]}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleClearSignature(signatureRefIssuedBy, 'issuedBySignature')}
                                    >
                                        Clear Signature
                                    </Button>
                                </div>
                            </div>

                            {/* Cancelled Section */}
                            <div className={`${sectionClasses} ${sectionColors[6]}`}>
                                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Cancelled By</h3>
                                <div className="flex items-center space-x-2 mb-4">
                                    <input
                                        type="checkbox"
                                        id="confirmationStatus.cancelledBy"
                                        className="h-4 w-4"
                                        checked={formState.confirmationStatus?.cancelledBy}
                                        onChange={(e) => {
                                            setFormState(prev => ({
                                                ...prev,
                                                confirmationStatus: {
                                                    ...prev.confirmationStatus,
                                                    cancelledBy: e.target.checked
                                                }

                                            }));
                                        }}
                                    />
                                    <Label htmlFor="confirmationStatus.cancelledBy">
                                        I confirm this is my signature
                                    </Label>
                                </div>

                                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="cancellation.cancelledByName">Name</Label>
                                        <Input
                                            id="cancellation.cancelledByName"
                                            name="cancellation.cancelledByName"
                                            value={formState.cancellation.cancelledByName}
                                            onChange={handleInputChange}
                                            className={errors["cancellation.cancelledByName"] ? "border-red-500" : ""}
                                        />
                                        {errors["cancellation.cancelledByName"] && (
                                            <p className="text-sm text-red-500">{errors["cancellation.cancelledByName"]}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cancellation.cancelledByDate">Date</Label>
                                        <Input
                                            id="cancellation.cancelledByDate"
                                            type="date"
                                            name="cancellation.cancelledByDate"
                                            value={formState.cancellation.cancelledByDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <Label>Signature</Label>
                                    <div className="rounded-md p-2">
                                        <SignaturePad
                                            ref={signatureRefCancelledBy}
                                            onEnd={() => handleCompletionSignatureEnd(signatureRefCancelledBy, 'cancelledBySignature')}
                                            canvasProps={{
                                                className: cn(
                                                    "signature-canvas w-full h-40 border border-gray-700 rounded-sm dark:bg-gray-700",
                                                    errors["cancellation.cancelledBySignature"] && "border-red-500"
                                                ),
                                            }}
                                        />
                                        {errors["cancellation.cancelledBySignature"] && (
                                            <p className="text-sm text-red-500">{errors["cancellation.cancelledBySignature"]}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleClearSignature(signatureRefCancelledBy, 'cancelledBySignature')}
                                    >
                                        Clear Signature
                                    </Button>
                                </div>

                                <div className="mt-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <h4 className="font-medium mb-2">Cancelled/ Returned At:</h4>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="cancellation.cancellationDate">Date</Label>
                                            <Input
                                                id="cancellation.cancellationDate"
                                                type="date"
                                                name="cancellation.cancellationDate"
                                                value={formState.cancellation.cancellationDate}
                                                onChange={handleInputChange}
                                                className={errors["cancellation.cancellationDate"] ? "border-red-500" : ""}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cancellation.cancellationTime">Time</Label>
                                            <Input
                                                id="cancellation.cancellationTime"
                                                type="time"
                                                name="cancellation.cancellationTime"
                                                value={formState.cancellation.cancellationTime}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <Label htmlFor="cancellation.cancellationReason">Cancellation Reason</Label>
                                    <Input
                                        id="cancellation.cancellationReason"
                                        name="cancellation.cancellationReason"
                                        value={formState.cancellation.cancellationReason}
                                        onChange={handleInputChange}
                                        className={errors["cancellation.cancellationReason"] ? "border-red-500" : ""}
                                    />
                                    {errors["cancellation.cancellationReason"] && (
                                        <p className="text-sm text-red-500">{errors["cancellation.cancellationReason"]}</p>
                                    )}
                                </div>
                            </div>

                            {/* Final Sign Off Section */}
                            <div className={`${sectionClasses} ${sectionColors[7]}`}>
                                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Final Sign Off</h3>
                                <p className="mb-4 italic">
                                    The worksite has been inspected by me at the cancellation / completion of the works at heights
                                    and declared safe for normal operations to resume.
                                </p>

                                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="finalSignOff.signedOffByName">Name</Label>
                                        <Input
                                            id="finalSignOff.signedOffByName"
                                            name="finalSignOff.signedOffByName"
                                            value={formState.finalSignOff.signedOffByName}
                                            onChange={handleInputChange}
                                            className={errors["finalSignOff.signedOffByName"] ? "border-red-500" : ""}
                                        />
                                        {errors["finalSignOff.signedOffByName"] && (
                                            <p className="text-sm text-red-500">{errors["finalSignOff.signedOffByName"]}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="finalSignOff.signedOffByDate">Date</Label>
                                        <Input
                                            id="finalSignOff.signedOffByDate"
                                            type="date"
                                            name="finalSignOff.signedOffByDate"
                                            value={formState.finalSignOff.signedOffByDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <Label>Signature</Label>
                                    <div className="rounded-md p-2">
                                        <SignaturePad
                                            ref={signatureRefFinalSignOffBy}
                                            onEnd={() => handleCompletionSignatureEnd(signatureRefFinalSignOffBy, 'signedOffBySignature')}
                                            canvasProps={{
                                                className: cn(
                                                    "signature-canvas w-full h-40 border border-gray-700 rounded-sm dark:bg-gray-700",
                                                    errors["finalSignOff.signedOffBySignature"] && "border-red-500"
                                                ),
                                            }}
                                        />
                                        {errors["finalSignOff.signedOffBySignature"] && (
                                            <p className="text-sm text-red-500">{errors["finalSignOff.signedOffBySignature"]}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleClearSignature(signatureRefFinalSignOffBy, 'signedOffBySignature')}
                                    >
                                        Clear Signature
                                    </Button>
                                </div>
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
                    form="height-permit-form"
                    disabled={isLoading}
                    className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
                >
                    {isLoading ? "Saving..." : (currentPermit ? "Update Permit" : "Submit Permit")}
                </Button>
            </ModalFooter>
        </>
    );
}

