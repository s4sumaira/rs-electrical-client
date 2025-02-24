"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WeeklyCheck } from "@/lib/types/weeklyInspection";
import { createWeeklyInspection, updateWeeklyInspection, getProjects } from "@/app/actions/weeklyInspectionActions";
import { useForm } from "@/hooks/useForm";
import { useEffect, useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { ModalFooter } from "@/components/modal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { Project } from "@/lib/types/project";
import { SearchableSelect } from "@/components/searchable-select";
import { DocumentStatus } from "@/lib/helpers/enum";
import { cn } from "@/lib/utils";

interface WeeklyInspectionFormProps {
    onClose: () => void;
    onSuccess?: (data: WeeklyCheck, message: string) => void;
    onError?: (error: string) => void;
    currentInspection: WeeklyCheck | null;
}

type CheckItemKey = keyof Pick<WeeklyCheck,
    'wheelLugs' |
    'batteryCondition' |
    'warningStickers' |
    'hosesAndFittings' |
    'groundControls' |
    'lanyardAnchorage' |
    'controlsFunctions' |
    'liftingAccessories' |
    'scrubberCondition'
>;

export function WeeklyInspectionForm({
    onClose,
    onSuccess,
    onError,
    currentInspection,
}: WeeklyInspectionFormProps) {
    const signaturePadRef = useRef<SignaturePad>(null);

    const initialValues: WeeklyCheck = {
        _id: currentInspection?._id ?? "",
        project: currentInspection?.project ?? ({} as Project),
        jobNumber: currentInspection?.jobNumber ?? "",
        date: currentInspection?.date ?? new Date().toISOString().split("T")[0],
        supplier: currentInspection?.supplier ?? "",
        makeModel: currentInspection?.makeModel ?? "",
        wheelLugs: currentInspection?.wheelLugs ?? { status: true, details: "" },
        batteryCondition: currentInspection?.batteryCondition ?? { status: true, details: "" },
        warningStickers: currentInspection?.warningStickers ?? { status: true, details: "" },
        hosesAndFittings: currentInspection?.hosesAndFittings ?? { status: true, details: "" },
        groundControls: currentInspection?.groundControls ?? { status: true, details: "" },
        lanyardAnchorage: currentInspection?.lanyardAnchorage ?? { status: true, details: "" },
        controlsFunctions: currentInspection?.controlsFunctions ?? { status: true, details: "" },
        liftingAccessories: currentInspection?.liftingAccessories ?? { status: true, details: "" },
        scrubberCondition: currentInspection?.scrubberCondition ?? { status: true, details: "" },
        inspectionCompletion: currentInspection?.inspectionCompletion ?? {
            inspectorName: currentInspection?.inspectionCompletion?.inspectorName ?? "",
            signature: currentInspection?.inspectionCompletion?.signature ?? "",
            signedDate: currentInspection?.inspectionCompletion?.signedDate ?? new Date(),
        },
        documentStatus:currentInspection?.documentStatus ?? DocumentStatus.SUBMITTED
    };

    const { formState, errors, isLoading, handleSubmit, getInputProps, getSelectProps, setFormState } =
        useForm<WeeklyCheck>({
            initialValues,
            submitAction: async (state, formData) => {
                return currentInspection
                    ? updateWeeklyInspection(state, formData)
                    : createWeeklyInspection(state, formData);
            },
            onSuccess,
            onError: (error) => {
                console.log(error);
                onError?.(typeof error === "string" ? error : "Form validation failed");
            },
            resetOnSuccess: !currentInspection,
        });

    const [projects, setProjects] = useState<Array<{ value: string; label: string }>>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);

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
        if (signaturePadRef.current && formState.inspectionCompletion?.signature) {
            signaturePadRef.current.fromDataURL(formState.inspectionCompletion.signature);
        }
    }, [formState.inspectionCompletion?.signature]);
    

    const checkItems: Array<{ key: CheckItemKey; label: string }> = [
        { key: "wheelLugs", label: "Wheel lugs and nuts (visual check)" },
        { key: "batteryCondition", label: "Battery Condition / Electrical services" },
        { key: "warningStickers", label: "All guards and warning stickers in place" },
        { key: "hosesAndFittings", label: "Hoses, wiring valves and fittings secure & free from damage / leaks" },
        { key: "groundControls", label: "All ground controls / safety cut-outs operational / emergency lowering controls" },
        { key: "lanyardAnchorage", label: "Lanyard anchorage point / guard rails, gates & latches in good condition" },
        { key: "controlsFunctions", label: "Function of all controls / drives" },
        { key: "liftingAccessories", label: "Lifting / Handling accessories" },
        { key: "scrubberCondition", label: "Scrubber in place and in a good condition" },
    ];

    const handleClearSignature = () => {
        if (signaturePadRef.current) {
            signaturePadRef.current.clear();
        }
    };

    const handleSignatureEnd = () => {
        if (signaturePadRef.current) {
            const signatureData = signaturePadRef.current.toDataURL();
            if (formState.inspectionCompletion) {
                formState.inspectionCompletion.signature = signatureData;
                formState.inspectionCompletion.signedDate = new Date();
            }
        }
    };

   

    return (
        <>
            <div className="flex-1 overflow-y-auto px-6">
                <form id="inspection-form" action={handleSubmit} className="space-y-6">
                    {currentInspection?._id && (
                        <input type="hidden" name="_id" value={currentInspection._id} />
                    )}

                    <Card>
                        <CardContent className="space-y-6">
                            {/* Project Details */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                                    <Label className="text-sm font-medium">Job Number</Label>
                                    <Input {...getInputProps("jobNumber")} />
                                    {errors.jobNumber && (
                                        <p className="text-sm text-destructive">{errors.jobNumber[0]}</p>
                                    )}
                                </div>
                            </div>

                            {/* MEWP Details */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Date</Label>
                                    <Input {...getInputProps("date")} type="date" 
                                      value={formState.date ? 
                                        new Date(formState.date).toISOString().split('T')[0] : ''}  
                                    />
                                    {errors.date && (
                                        <p className="text-sm text-destructive">{errors.date[0]}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Supplier/Hirer</Label>
                                    <Input {...getInputProps("supplier")} />
                                    {errors.supplier && (
                                        <p className="text-sm text-destructive">{errors.supplier[0]}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Make & Model</Label>
                                    <Input {...getInputProps("makeModel")} />
                                    {errors.makeModel && (
                                        <p className="text-sm text-destructive">{errors.makeModel[0]}</p>
                                    )}
                                </div>
                            </div>

                            {/* Check items */}
                            {checkItems.map(({ key, label }) => (
                                <div key={key} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm flex-grow">{label}</Label>
                                        <RadioGroup
                                            value={formState[key]?.status ? "true" : "false"}
                                            onValueChange={(value) => {
                                                setFormState(prev => ({
                                                    ...prev,
                                                    [key]: {
                                                        status: value === "true",
                                                        details: value === "true" ? "" : prev[key]?.details ?? ""
                                                    }
                                                }));
                                            }}
                                            className="flex items-center space-x-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="true" id={`${key}-true`} />
                                                <Label htmlFor={`${key}-true`}>Yes</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="false" id={`${key}-false`} />
                                                <Label htmlFor={`${key}-false`}>No</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    {!formState[key]?.status && (
                                        <div className="ml-4">
                                            <Input
                                                {...getInputProps(`${key}.details`)}
                                                placeholder="Please provide details"
                                                className="w-full"
                                            />
                                            {/* {errors[`${key}.details`] && (
                        <p className="text-sm text-destructive">{errors[`${key}.details`][0]}</p>
                      )} */}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Inspection completion */}
                            <div className="space-y-4">
                                <Label className="text-base font-normal">Inspector Name</Label>
                                <Input {...getInputProps("inspectionCompletion.inspectorName")} />
                                {errors["inspectionCompletion.inspectorName"] && (
                                    <p className="text-sm text-destructive">
                                        {errors["inspectionCompletion.inspectorName"][0]}
                                    </p>
                                )}

                                <Label className="text-base font-normal">Signature</Label>
                                <div className="rounded-md p-2">
                                    <SignaturePad
                                        ref={signaturePadRef}
                                        onEnd={handleSignatureEnd}
                                        canvasProps={{
                                            className:cn(
                                                    "signature-canvas w-full h-40 border border-gray-700 rounded-sm dark:bg-gray-700",
                                                    errors?.["inspectionCompletion.signature"] && "border-destructive"
                                                    ),
                                        }}
                                    />
                                </div>
                                {errors["inspectionCompletion.signature"] && (
                                    <p className="text-sm text-destructive">
                                        {errors["inspectionCompletion.signature"][0]}
                                    </p>
                                )}
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" onClick={handleClearSignature}>
                                        Clear Signature
                                    </Button>
                                </div>
                            </div>
                            {formState.inspectionCompletion?.signedDate && (
                                <p className="text-sm text-muted-foreground">
                                    Signed on: {new Date(formState.inspectionCompletion?.signedDate).toLocaleString()}
                                </p>
                                )}
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
                    form="inspection-form"
                    disabled={isLoading}
                    className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
                >
                    Save
                </Button>
            </ModalFooter>
        </>
    );
}