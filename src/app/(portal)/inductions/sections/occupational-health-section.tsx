// components/induction/sections/occupational-health-section.tsx
//import React, { useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { type SiteInduction } from "@/lib/types/induction"
import { cn } from "@/lib/utils"

interface SectionProps {
  formState: SiteInduction;
  errors: Record<string, string[]>;
  getInputProps: (name: string) => any;
  getSelectProps: (name: string) => any;
  setFormState: React.Dispatch<React.SetStateAction<SiteInduction>>;
}

export function OccupationalHealthSection({
  formState,
  errors,
  getInputProps,
  setFormState,
}: SectionProps) {

// useEffect(()=>{

//   console.log("errors:::",errors);

// },[errors])

  return (
    <Card>
     
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Main Health Condition Question */}
          <div className="flex justify-between items-start gap-4">
            <Label className="text-base font-normal flex-1">
              Do you suffer from any medical condition that may affect your or other safety or health whilst working?
            </Label>
            <RadioGroup
              value={formState.occupationalHealth.hasCondition ? 'yes' : 'no'}
              onValueChange={(value) => {
                setFormState((prev) => ({
                  ...prev,
                  occupationalHealth: {
                    ...prev.occupationalHealth,
                    hasCondition: value === 'yes',
                    epilepsy: value === 'no' ? false : prev.occupationalHealth.epilepsy,
                    deafness: value === 'no' ? false : prev.occupationalHealth.deafness,
                    asthma: value === 'no' ? false : prev.occupationalHealth.asthma,
                    heartConditions: value === 'no' ? false : prev.occupationalHealth.heartConditions,
                    details: value === 'no' ? "" : prev.occupationalHealth.details,
                  },
                }))
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="hasCondition-yes" />
                <Label htmlFor="hasCondition-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="hasCondition-no" />
                <Label htmlFor="hasCondition-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          {errors["occupationalHealth"] && (
            <p className="text-sm text-destructive">{errors["occupationalHealth"][0]}</p>
          )}

          {/* Medical Conditions Section */}
          {formState.occupationalHealth.hasCondition && (
            <div className="space-y-4 pl-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'epilepsy', label: 'Epilepsy' },
                  { key: 'deafness', label: 'Deafness' },
                  { key: 'asthma', label: 'Asthma' },
                  { key: 'heartConditions', label: 'Heart Conditions' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={(formState.occupationalHealth as any)[key] || false}
                      onCheckedChange={(checked) => {
                        setFormState((prev) => ({
                          ...prev,
                          occupationalHealth: {
                            ...prev.occupationalHealth,
                            [key]: checked,
                          },
                        }))
                      }}
                    />
                    <Label htmlFor={key} className="text-base font-normal">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>If yes to any of the above, please detail below</Label>
                <Textarea
                  {...getInputProps("occupationalHealth.details")}
                  className={cn(errors?.["occupationalHealth.details"] && "border-destructive")}
                  placeholder="Provide details of your condition(s)"
                />
                {errors?.["occupationalHealth.details"] && (
                  <p className="text-sm text-destructive">
                    {errors["occupationalHealth.details"][0]}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Medication Question */}
          <div className="flex justify-between items-start gap-4">
            <Label className="text-base font-normal flex-1">
              Do you currently need to take any form of medication that may affect your or others health and safety whilst at work?
            </Label>
            <RadioGroup
              value={formState.occupationalHealth.requiresMedication ? 'yes' : 'no'}
              onValueChange={(value) => {
                setFormState((prev) => ({
                  ...prev,
                  occupationalHealth: {
                    ...prev.occupationalHealth,
                    requiresMedication: value === 'yes',
                    medicationDetails: value === 'no' ? "" : prev.occupationalHealth.medicationDetails,
                  },
                }))
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="requiresMedication-yes" />
                <Label htmlFor="requiresMedication-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="requiresMedication-no" />
                <Label htmlFor="requiresMedication-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {formState.occupationalHealth.requiresMedication && (
            <div className="space-y-2 pl-6">
              <Label>Medication Details</Label>
              <Textarea
                {...getInputProps("occupationalHealth.medicationDetails")}
                className={cn(errors?.["occupationalHealth.medicationDetails"] && "border-destructive")}
                placeholder="Provide details about your medication"
              />
              {errors?.["occupationalHealth.medicationDetails"] && (
                <p className="text-sm text-destructive">
                  {errors["occupationalHealth.medicationDetails"][0]}
                </p>
              )}
            </div>
          )}

          {/* Night Work Assessment Question */}
          <div className="flex justify-between items-start gap-4">
            <Label className="text-base font-normal flex-1">
              If applicable, have you undertaken an annual health and safety assessment for night time working?
            </Label>
            <RadioGroup
              value={formState.occupationalHealth.nightWorkAssessment ? 'yes' : 'no'}
              onValueChange={(value) => {
                setFormState((prev) => ({
                  ...prev,
                  occupationalHealth: {
                    ...prev.occupationalHealth,
                    nightWorkAssessment: value === 'yes',
                  },
                }))
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="nightWorkAssessment-yes" />
                <Label htmlFor="nightWorkAssessment-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="nightWorkAssessment-no" />
                <Label htmlFor="nightWorkAssessment-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground">
            This information is confidential and will only be used to ensure your safety and wellbeing at work.
            Please ensure all provided information is accurate and up to date.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}