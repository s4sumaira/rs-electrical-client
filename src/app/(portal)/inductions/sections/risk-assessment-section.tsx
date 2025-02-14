// components/induction/sections/risk-assessment-section.tsx
import React, { useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { type SiteInduction } from "@/lib/types/induction"


interface SectionProps {
  formState: SiteInduction;
  errors: Record<string, string[]>;
  getInputProps: (name: string) => any;
  getSelectProps: (name: string) => any;
  setFormState: React.Dispatch<React.SetStateAction<SiteInduction>>;
}

export function RiskAssessmentSection({
  formState,
  errors,
  setFormState,
}: SectionProps) {


  useEffect(()=>{

    console.log(errors)
  },[errors])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Risk Assessment & Method Statement</CardTitle>
        <p className="text-sm text-muted-foreground">
          Please confirm your understanding of the risk assessment and safe systems of work.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Briefing Confirmation */}
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <Label className="text-base font-normal flex-1">
              Have you been briefed / trained in the RAMS and Safe Systems of Works appropriate to the works you will be carrying out on the project?
            </Label>
            <RadioGroup
              value={formState.riskAssessment.briefed ? 'yes' : 'no'}
              onValueChange={(value) => {
                setFormState((prev) => ({
                  ...prev,
                  riskAssessment: {
                    ...prev.riskAssessment,
                    briefed: value === 'yes',
                  },
                }))
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="briefed-yes" />
                <Label htmlFor="briefed-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="briefed-no" />
                <Label htmlFor="briefed-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          {/* {errors["riskAssessment"] && (
            <p className="text-sm text-destructive mt-1">
              {errors["riskAssessment"][0]}
            </p>
          )} */}
        </div>

        {/* Understanding Confirmation */}
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <Label className="text-base font-normal flex-1">
              I have read, understood, and signed all required parts of the RAMS
            </Label>
            <RadioGroup
              value={formState.riskAssessment.understood ? 'yes' : 'no'}
              onValueChange={(value) => {
                setFormState((prev) => ({
                  ...prev,
                  riskAssessment: {
                    ...prev.riskAssessment,
                    understood: value === 'yes',
                  },
                }))
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="understood-yes" />
                <Label htmlFor="understood-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="understood-no" />
                <Label htmlFor="understood-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          {errors["riskAssessment"] && (
            <p className="text-sm text-destructive mt-1">
              {errors["riskAssessment"][0]}
            </p>
          )}
        </div>

        {/* Warning Notice */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground space-y-1">
            You must confirm that you have been briefed on and understand the risk assessment before proceeding. 
            This is essential for your safety and the safety of others on site.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}