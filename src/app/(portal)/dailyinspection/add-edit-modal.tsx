"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DailyInspection,DailyInspectionDay } from "@/lib/types/dailyInspection";
import { createDailyInspection, getProjects } from "@/app/actions/dailyInspectionActions";
import { useForm } from "@/hooks/useForm";
// import { useSwipeable } from 'react-swipeable';
import { useEffect, useRef, useState } from "react";
import { ModalFooter } from "@/components/modal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { Project } from "@/lib/types/project";
import { SearchableSelect } from "@/components/searchable-select";
import { DocumentStatus } from "@/lib/helpers/enum";

interface DailyInspectionFormProps {
    onClose: () => void;
    onSuccess?: (data: DailyInspection, message: string) => void;
    onError?: (error: string) => void;
    currentInspection: DailyInspection | null;
}

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type CheckItemKey = 'generalCondition' | 'brakes' | 'tyres' | 'coolantLubricant' | 'pinsLockingDevices' |
    'hydraulicLeaks' | 'stabilisersRiggers' | 'controlInstrument' | 'alarms' | 'accessGate' |
    'coolantLubricant2' | 'wheelCovers';

    function createEmptyDailyInspectionDay(): DailyInspectionDay {
        return {
            generalCondition: { status: true, details: "" },
            brakes: { status: true, details: "" },
            tyres: { status: true, details: "" },
            coolantLubricant: { status: true, details: "" },
            pinsLockingDevices: { status: true, details: "" },
            hydraulicLeaks: { status: true, details: "" },
            stabilisersRiggers: { status: true, details: "" },
            controlInstrument: { status: true, details: "" },
            alarms: { status: true, details: "" },
            accessGate: { status: true, details: "" },
            coolantLubricant2: { status: true, details: "" },
            wheelCovers: { status: true, details: "" }
        };
    }

    type DailyInspectionItem = {
        id: keyof DailyInspectionDay;
        label: string;
    };
    
    // Then declare your inspectionItems constant
    const inspectionItems: DailyInspectionItem[] = [
        { id: 'generalCondition', label: 'General Condition' },
        { id: 'brakes', label: 'Brakes' },
        { id: 'tyres', label: 'Tyres' },
        { id: 'coolantLubricant', label: 'Coolant / Lubricant' },
        { id: 'pinsLockingDevices', label: 'Pins / Locking Devices' },
        { id: 'hydraulicLeaks', label: 'Hydraulic Leaks' },
        { id: 'stabilisersRiggers', label: 'Operation of stabilisers & out riggers' },
        { id: 'controlInstrument', label: 'Control instrument' },
        { id: 'alarms', label: 'Alarms' },
        { id: 'accessGate', label: 'Access Gate' },
        { id: 'coolantLubricant2', label: 'Coolant / Lubricant' },
        { id: 'wheelCovers', label: 'Wheel covers' }
    ];
    
   


export function DailyInspectionForm({
    onClose,
    onSuccess,
    onError,
    currentInspection,
}: DailyInspectionFormProps) {
    const inspectionItems = [
        { id: 'generalCondition', label: 'General Condition' },
        { id: 'brakes', label: 'Brakes' },
        { id: 'tyres', label: 'Tyres' },
        { id: 'coolantLubricant', label: 'Coolant / Lubricant' },
        { id: 'pinsLockingDevices', label: 'Pins / Locking Devices' },
        { id: 'hydraulicLeaks', label: 'Hydraulic Leaks' },
        { id: 'stabilisersRiggers', label: 'Operation of stabilisers & out riggers' },
        { id: 'controlInstrument', label: 'Control instrument' },
        { id: 'alarms', label: 'Alarms' },
        { id: 'accessGate', label: 'Access Gate' },
        { id: 'coolantLubricant2', label: 'Coolant / Lubricant' },
        { id: 'wheelCovers', label: 'Wheel covers' }
    ] as const;

    const days: Array<{ key: DayKey; label: string }> = [
        { key: 'monday', label: 'Monday' },
        { key: 'tuesday', label: 'Tuesday' },
        { key: 'wednesday', label: 'Wednesday' },
        { key: 'thursday', label: 'Thursday' },
        { key: 'friday', label: 'Friday' },
        { key: 'saturday', label: 'Saturday' },
        { key: 'sunday', label: 'Sunday' }
    ];

  
        const initialValues: DailyInspection = {
            _id: currentInspection?._id ?? "",
            project: currentInspection?.project ?? ({} as Project),
            jobNumber: currentInspection?.jobNumber ?? "",
            weekStartDate: currentInspection?.weekStartDate ?? new Date().toISOString().split("T")[0],
            supplier: currentInspection?.supplier ?? "",
            makeModel: currentInspection?.makeModel ?? "",
            inspectorName: currentInspection?.inspectorName ?? "",
            monday: currentInspection?.monday ?? createEmptyDailyInspectionDay(),
            tuesday: currentInspection?.tuesday ?? createEmptyDailyInspectionDay(),
            wednesday: currentInspection?.wednesday ?? createEmptyDailyInspectionDay(),
            thursday: currentInspection?.thursday ?? createEmptyDailyInspectionDay(),
            friday: currentInspection?.friday ?? createEmptyDailyInspectionDay(),
            saturday: currentInspection?.saturday ?? createEmptyDailyInspectionDay(),
            sunday: currentInspection?.sunday ?? createEmptyDailyInspectionDay(),
            documentStatus: currentInspection?.documentStatus ?? DocumentStatus.SUBMITTED,
        }; 



    const { formState, errors, isLoading, handleSubmit, getInputProps, getSelectProps, setFormState } =
        useForm<DailyInspection>({
            initialValues,
            submitAction: async (state, formData) => {
                return  createDailyInspection(state, formData);
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

    const handleCheckChange = (itemId: CheckItemKey, day: DayKey, value: boolean) => {
        setFormState(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [itemId]: {
                    status: value,
                    details: value ? "" : prev[day][itemId]?.details ?? ""
                }
            }
        }));
    };

    const handleDetailsChange = (itemId: CheckItemKey, day: DayKey, details: string) => {
        setFormState(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [itemId]: {
                    ...prev[day][itemId],
                    details
                }
            }
        }));
    };

   

    return (
      <>
        <form id="daily-inspection-form" action={handleSubmit} className="flex flex-col max-h-[85vh]">
        {currentInspection?._id && (
                    <input type="hidden" name="_id" value={currentInspection._id} />
                )}
        <Card>
          <CardContent>
           
              <div className="p-4 dark:bg-[#0D1117] space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <Label className="text-sm text-gray-400">Project</Label>
                        <SearchableSelect {...getSelectProps("project._id")} options={projects} placeholder="Select project..." 
                        isLoading={isLoadingProjects}/>
                         {errors["project._id"] && (
                                        <p className="text-sm text-destructive">{errors["project._id"][0]}</p>
                                    )}
                </div>
                <div>
                    <Label className="text-sm text-gray-400">Job #</Label>
                    <Input {...getInputProps("jobNumber")} className="dark:bg-[#0D1117] border-[#30363D] dark:text-white" />
                    {errors.jobNumber && (
                                        <p className="text-sm text-destructive">{errors.jobNumber[0]}</p>
                                    )}
                  </div>
                </div>
               
               
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-gray-400">Week Start Date</Label>
                    <Input type="date" {...getInputProps("weekStartDate")}
                     value={formState.weekStartDate ? 
                        new Date(formState.weekStartDate).toISOString().split('T')[0] : ''} 
                     className="dark:bg-[#0D1117] border-[#30363D] dark:text-white mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-400">Supplier/Hirer</Label>
                    <Input {...getInputProps("supplier")} className="dark:bg-[#0D1117] border-[#30363D] dark:text-white mt-1" />
                    {errors.supplier && (
                                        <p className="text-sm text-destructive">{errors.supplier[0]}</p>
                                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-gray-400">Make & Model</Label>
                    <Input {...getInputProps("makeModel")} className="dark:bg-[#0D1117] border-[#30363D] dark:text-white mt-1" />
                  </div>
                </div>
              </div>
    
              {/* Table Section */}
              <div className="flex-1 overflow-auto dark:bg-[#0D1117]">
                <div className="min-w-max">
                  {/* Header Row with Inspection Items */}
                  <div className="grid" style={{ gridTemplateColumns: `150px repeat(${inspectionItems.length}, 180px)` }}>
                    <div className="sticky left-0 dark:bg-[#21262D] h-12 flex items-center justify-center border-b border-[#30363D] font-medium">Day</div>
                    {inspectionItems.map((item) => (
                      <div key={item.id} className="dark:bg-[#21262D] h-12 flex items-center justify-center border-b border-r border-[#30363D] font-medium">
                        {item.label}
                      </div>
                    ))}
    
                    {/* Rows for Days */}
                    {days.map((day) => (
                      <>
                        <div key={day.key} className="sticky left-0 dark:bg-[#0D1117] border-t border-b border-[#30363D] flex items-center justify-center font-medium">
                          {day.label}
                        </div>
                        {inspectionItems.map((item) => (
                          <div key={`${day.key}-${item.id}`} className="border-t border-b border-r border-[#30363D] p-2 flex flex-col items-center justify-center">
                          
                          <RadioGroup
                                                value={formState[day.key]?.[item.id]?.status?.toString() ?? "true"}
                                                onValueChange={(value) => handleCheckChange(item.id as CheckItemKey, day.key, value === "true")}
                                                className="flex justify-center space-x-4"
                                            >
                                                <div className="flex items-center">
                                                    <RadioGroupItem
                                                        value="true"
                                                        id={`${item.id}-${day.key}-true`}
                                                        className="border-[#30363D] data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500"
                                                    />
                                                    <Label htmlFor={`${item.id}-${day.key}-true`} className="ml-1 cursor-pointer">✓</Label>
                                                </div>
                                                <div className="flex items-center">
                                                    <RadioGroupItem
                                                        value="false"
                                                        id={`${item.id}-${day.key}-false`}
                                                        className="border-[#30363D] data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500"
                                                    />
                                                    <Label htmlFor={`${item.id}-${day.key}-false`} className="ml-1 cursor-pointer">✗</Label>
                                                </div>
                                            </RadioGroup>
                          
                          
                          
                          
                            {formState[day.key]?.[item.id]?.status === false && (
                              <Input
                                value={formState[day.key]?.[item.id]?.details ?? ""}
                                onChange={(e) => handleDetailsChange(item.id, day.key, e.target.value)}
                                placeholder="Details..."
                                className="w-full h-6 text-xs bg-[#0D1117] border-[#30363D] text-white mt-1"
                              />
                            )}
                          </div>
                        ))}
                         
                   
               
                      </>
                    ))}
                  </div>
                </div>
              </div>
    
              {/* Footer Section */}

               
              <div className="p-4 border-[#30363D] dark:bg-[#0D1117] space-y-4">
                <div>
                  <Label className="text-sm text-gray-400">Inspector Name</Label>
                  <Input {...getInputProps("inspectorName")} className="dark:bg-[#0D1117] border-[#30363D] dark:text-white mt-1" />
                </div>
               
              </div> 
           
          </CardContent>
        </Card>
        </form>
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
                       form="daily-inspection-form"
                       disabled={isLoading}
                       className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
                   >
                       {isLoading ? "Saving..." : (currentInspection ? "Update" : "Save")}
                   </Button>
               </ModalFooter> 
       
                   
                </>
      );
}