// components/induction/sections/compliance-section.tsx
import React from "react"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { type SiteInduction } from "@/lib/types/induction"
import { cn } from "@/lib/utils"

interface SectionProps {
  formState: SiteInduction;
  errors: Record<string, string[]>;
  getInputProps: (name: string) => any;
  getSelectProps: (name: string) => any;
  setFormState: React.Dispatch<React.SetStateAction<SiteInduction>>;
}

export function ComplianceSection({
  formState,
  errors,
  getInputProps,
  setFormState,
}: SectionProps) {
  return (
    <Card>
      
      <CardContent className="space-y-6">
        {/* CSCS Card Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <Label className="text-base font-normal flex-1">
              Do you have a CSCS / ECS Card or equivalent? (If yes please say which and provide your registration number)
            </Label>
            <RadioGroup
              value={formState.compliance.hasCSCSCard ? 'yes' : 'no'}
              onValueChange={(value) => {
                setFormState((prev) => ({
                  ...prev,
                  compliance: {
                    ...prev.compliance,
                    hasCSCSCard: value === 'yes',
                    cardType: value === 'no' ? '' : prev.compliance.cardType,
                    cardNumber: value === 'no' ? '' : prev.compliance.cardNumber,
                  },
                }))
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="hasCSCSCard-yes" />
                <Label htmlFor="hasCSCSCard-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="hasCSCSCard-no" />
                <Label htmlFor="hasCSCSCard-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {formState.compliance.hasCSCSCard && (
            <div className="grid grid-cols-2 gap-4 pl-6">
              <div className="space-y-2">
                <Label htmlFor="cardType">Card Type:</Label>
                <Input
                  {...getInputProps("compliance.cardType")}
                  className={cn(errors?.["compliance.cardType"] && "border-destructive")}
                />
                {errors?.["compliance.cardType"] && (
                  <p className="text-sm text-destructive">{errors["compliance.cardType"][0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number:</Label>
                <Input
                  {...getInputProps("compliance.cardNumber")}
                  className={cn(errors?.["compliance.cardNumber"] && "border-destructive")}
                />
                {errors?.["compliance.cardNumber"] && (
                  <p className="text-sm text-destructive">{errors["compliance.cardNumber"][0]}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Asbestos Awareness Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <Label className="text-base font-normal flex-1">
              Do you hold a current Asbestos Awareness Certificate?
            </Label>
            <RadioGroup
              value={formState.compliance.hasAsbestosAwareness ? 'yes' : 'no'}
              onValueChange={(value) => {
                setFormState((prev) => ({
                  ...prev,
                  compliance: {
                    ...prev.compliance,
                    hasAsbestosAwareness: value === 'yes',
                    asbestosCompletionDate: undefined,
                  },
                }))
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="hasAsbestosAwareness-yes" />
                <Label htmlFor="hasAsbestosAwareness-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="hasAsbestosAwareness-no" />
                <Label htmlFor="hasAsbestosAwareness-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {!formState.compliance.hasAsbestosAwareness && (
            <div className="space-y-2 pl-6">
              <Label htmlFor="asbestosCompletionDate">If no, please advise when this will be completed by:</Label>
              <Input
                type="date"
               {...getInputProps("compliance.asbestosCompletionDate")}  
               value={formState.compliance.asbestosCompletionDate ? 
                new Date(formState.compliance.asbestosCompletionDate).toISOString().split('T')[0] : ''}            
                   
                className={cn(errors?.["compliance.asbestosCompletionDate"] && "border-destructive")}
              />
              {errors?.["compliance.asbestosCompletionDate"] && (
                <p className="text-sm text-destructive">{errors["compliance.asbestosCompletionDate"][0]}</p>
              )}
            </div>
          )}
        </div>

        {/* Other Qualifications Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <Label className="text-base font-normal flex-1">
              Do you hold any other vocational or other safety training qualifications?
            </Label>
            <RadioGroup
              value={formState.compliance.hasOtherQualifications ? 'yes' : 'no'}
              onValueChange={(value) => {
                setFormState((prev) => ({
                  ...prev,
                  compliance: {
                    ...prev.compliance,
                    hasOtherQualifications: value === 'yes',
                    otherQualificationsDetails: value === 'no' ? '' : prev.compliance.otherQualificationsDetails,
                  },
                }))
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="hasOtherQualifications-yes" />
                <Label htmlFor="hasOtherQualifications-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="hasOtherQualifications-no" />
                <Label htmlFor="hasOtherQualifications-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {formState.compliance.hasOtherQualifications   && (
            <div className="space-y-2 pl-6">
              <Label>If yes, please detail:</Label>
              <Textarea
                {...getInputProps("compliance.otherQualificationsDetails")}
                className={cn(errors?.["compliance.otherQualificationsDetails"] && "border-destructive")}
              />
              {errors?.["compliance.otherQualificationsDetails"] && (
                <p className="text-sm text-destructive">
                  {errors["compliance.otherQualificationsDetails"][0]}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Under 18 Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <Label className="text-base font-normal flex-1">
              Are you under 18 years of age?
            </Label>
            <RadioGroup
              value={formState.compliance.isUnder18 ? 'yes' : 'no'}
              onValueChange={(value) => {
                setFormState((prev) => ({
                  ...prev,
                  compliance: {
                    ...prev.compliance,
                    isUnder18: value === 'yes',
                    under18Details: value === 'no' ? undefined : prev.compliance.under18Details,
                  },
                }))
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="isUnder18-yes" />
                <Label htmlFor="isUnder18-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="isUnder18-no" />
                <Label htmlFor="isUnder18-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {formState.compliance.isUnder18 && (
            <div className="space-y-2 pl-6">
              <Label>If yes, please state who your mentor is and provide your "young persons" risk assessment:</Label>
              <Textarea
                {...getInputProps("compliance.under18Details")}
                className={cn(errors?.["compliance.under18Details"] && "border-destructive")}
              />
              {errors?.["compliance.under18Details"] && (
                <p className="text-sm text-destructive">{errors["compliance.under18Details"][0]}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}