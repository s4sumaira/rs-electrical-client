import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SignaturePad from "react-signature-canvas";
import { cn } from "@/lib/utils";

interface HeightPermitFormProps {
    onClose: () => void;
    onSuccess?: (data: any, message: string) => void;
    onError?: (error: string) => void;
    currentPermit: any | null;
}

export function HeightPermitForm({
    onClose,
    onSuccess,
    onError,
    currentPermit,
}: HeightPermitFormProps) {
    const signaturePadRef = useRef<SignaturePad>(null);
    
    const [formState, setFormState] = useState({
        permitNumber: "",
        date: new Date().toISOString().split("T")[0],
        site: "",
        location: "",
        contractor: "",
        phoneNumber: "",
        validFrom: "",
        validFromTime: "",
        validTo: "",
        validToTime: "",
        descriptionOfWorks: "",
        equipment: {
            stepLadders: false,
            mobileScaffold: false,
            extensionLadder: false,
            mewp: false,
            correctFootwear: false,
            edgeProtection: false,
            safetyNet: false,
            ropesHarnesses: false,
            otherEquipment: ""
        },
        services: {
            smokeDetectors: false,
            pipesTanks: false,
            electricalOutlets: false,
            otherServices: ""
        },
        controlMeasures: {
            barriers: false,
            banksman: false,
            signage: false,
            otherMeasures: ""
        },
        environmental: {
            weather: false,
            groundConditions: false,
            storedMaterials: false,
            otherEnvironmental: ""
        },
        authorization: {
            issuedToName: "",
            issuedToSignature: "",
            issuedByName: "",
            issuedBySignature: "",
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value
        }));
    };

    type FormSection = 'equipment' | 'services' | 'controlMeasures' | 'environmental';
    
    const handleCheckboxChange = (section: FormSection, field: string) => {
        setFormState(prev => {
            const sectionData = prev[section] as Record<string, boolean | string>;
            return {
                ...prev,
                [section]: {
                    ...sectionData,
                    [field]: typeof sectionData[field] === 'boolean' ? !sectionData[field] : false
                }
            };
        });
    };

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
                authorization: {
                    ...prev.authorization,
                    issuedToSignature: signatureData
                }
            }));
        }
    };

    return (
        <div className="flex-1 overflow-y-auto px-6">
            <form className="space-y-6">
                <Card>
                    <CardContent className="space-y-6 pt-6">
                        {/* Permit Details Section */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Permit Number</Label>
                                <Input
                                    name="permitNumber"
                                    value={formState.permitNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input
                                    type="date"
                                    name="date"
                                    value={formState.date}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Site</Label>
                                <Input
                                    name="site"
                                    value={formState.site}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                    name="location"
                                    value={formState.location}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Equipment Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Equipment to be Used</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formState.equipment.stepLadders}
                                        onChange={() => handleCheckboxChange('equipment', 'stepLadders')}
                                        className="h-4 w-4"
                                    />
                                    <Label>Step Ladders</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formState.equipment.mobileScaffold}
                                        onChange={() => handleCheckboxChange('equipment', 'mobileScaffold')}
                                        className="h-4 w-4"
                                    />
                                    <Label>Mobile Scaffold</Label>
                                </div>
                                {/* Add more equipment checkboxes */}
                            </div>
                        </div>

                        {/* Services Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Services Isolated</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formState.services.smokeDetectors}
                                        onChange={() => handleCheckboxChange('services', 'smokeDetectors')}
                                        className="h-4 w-4"
                                    />
                                    <Label>Smoke/Thermal Detectors</Label>
                                </div>
                                {/* Add more services checkboxes */}
                            </div>
                        </div>

                        {/* Authorization Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Authorization</h3>
                            <div className="space-y-2">
                                <Label>Issued To (Name)</Label>
                                <Input
                                    name="issuedToName"
                                    value={formState.authorization.issuedToName}
                                    onChange={(e) => setFormState(prev => ({
                                        ...prev,
                                        authorization: {
                                            ...prev.authorization,
                                            issuedToName: e.target.value
                                        }
                                    }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Signature</Label>
                                <div className="rounded-md p-2">
                                    <SignaturePad
                                        ref={signaturePadRef}
                                        onEnd={handleSignatureEnd}
                                        canvasProps={{
                                            className: "signature-canvas w-full h-40 border border-gray-700 rounded-sm dark:bg-gray-700"
                                        }}
                                    />
                                </div>
                                <Button type="button" variant="outline" onClick={handleClearSignature}>
                                    Clear Signature
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="bg-btn-cancel hover:bg-btn-cancel-hover text-btn-cancel-fg"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
                    >
                        Submit Permit
                    </Button>
                </div>
            </form>
        </div>
    );
}

