"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import toast from "react-hot-toast"
import { type SiteInduction} from "@/lib/types/induction"
import { DocumentStatus } from "@/lib/helpers/enum"
import { PersonalInfoSection } from "./sections/personal-info-section"
import { OccupationalHealthSection } from "./sections/occupational-health-section"
import { ComplianceSection } from "./sections/compliance-section"
import { DocumentsSection } from "./sections/documents-section"
import { RiskAssessmentSection } from "./sections/risk-assessment-section"
import { ConfirmationSection } from "./sections/confirmation-section"
import { ProjectDetailsSection } from "./sections/project-detail-section"
import { useFormWizard } from "@/hooks/useFormWizard"
import { saveInduction,approveInduction} from "@/app/actions/inductionActions"
import { initialInductionState } from "@/lib/types/induction"
import { Card } from "@/components/ui/card"
import { sectionSchemas } from "@/lib/validations/inductionSections"
import type { z } from "zod"
import { useAuth } from "@/hooks/useAuth"
import { Permissions } from "@/lib/types/permissions"
import { exportInductionToPDF } from "./pdf-induction" 

interface InductionFormProps {
  onClose: () => void
  currentInduction: SiteInduction | null
  onComplete: () => void
}

// Updated interface to match section component requirements
interface SectionProps {
  formState: SiteInduction
  errors: Record<string, string[]>
  getInputProps: (name: keyof SiteInduction) => any
  getSelectProps: (name: keyof SiteInduction) => any
  setFormState: React.Dispatch<React.SetStateAction<SiteInduction>>
}

const formSections = [
  {
    title: "Project Details",
    component: ProjectDetailsSection,
  },
  {
    title: "Personal Information",
    component: PersonalInfoSection,
  },
  {
    title: "Occupational Health",
    component: OccupationalHealthSection,
  },
  {
    title: "Compliance",
    component: ComplianceSection,
  },
  {
    title: "Documents",
    component: DocumentsSection,
  },
  {
    title: "Risk Assessment",
    component: RiskAssessmentSection,
  },
  {
    title: "Confirmation",
    component: ConfirmationSection,
  },
] as const

export function InductionForm({ onClose, currentInduction, onComplete }: InductionFormProps) {

  const{hasRole, hasPermission} = useAuth()

  const isEditMode = Boolean(currentInduction?._id)
 
  const {
    currentSection: CurrentSection,
    currentSectionIndex,
    totalSections,
    progress,
    sectionProps,
    handleNext,
    handleBack,
    handleSubmit,
    isLoading,
    isSaving,
    formState,
    errors,
  } = useFormWizard<SiteInduction, z.SafeParseReturnType<any, any>>({
    id: 'site-induction',
    initialValues: currentInduction || initialInductionState,
    sections: formSections.map(section => section.component),
    validate: async (sectionIndex, data) => {
     
      return sectionSchemas[sectionIndex].safeParse(data)
    },
    isValid: (result) => result.success,
    getValidationErrors: (result) => {
      if (result.success) return {}
      const fieldErrors: Record<string, string[]> = {}
      result.error.errors.forEach((error) => {
        const path = error.path.join(".")
        if (!fieldErrors[path]) {
          fieldErrors[path] = []
        }
        fieldErrors[path].push(error.message)
      })
      return fieldErrors
    },
    onSubmit: async (formData) => {
      
      return saveInduction(formSections.length - 1, formData, true)
      
    },   
    onComplete: (result) => {
      toast.success("Induction submitted successfully")
      onComplete?.()
      onClose()
    },
    onError: (error) => {
      console.error('Induction error:', error)
      toast.error("An error occurred while saving the induction")
    },
    
  })

  const handleExportPDF = () => {
    try {
      exportInductionToPDF(formState);
      toast.success("PDF export successful!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Error generating PDF. Please try again.");
    }
  };

  const handleStatusChange = async () => {
    if (!currentInduction?._id) {
      toast.error("No induction selected for review.");
      return;
    }   
  
    try {
      const response = await approveInduction(currentInduction._id);
  
      if (response.success) {
        toast.success("Induction reviewed successfully!");
        onComplete?.()
        onClose()
      } else {
        toast.error(response.message || "Failed to review induction.");
      }
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("An error occurred while reviewing the induction.");
    }
  };
  

  // Create properly typed section props with type assertion
  const commonSectionProps: SectionProps = {
    formState,
    errors,
    getInputProps: ((name: keyof SiteInduction) => sectionProps.getInputProps(name as string)) as (name: keyof SiteInduction) => any,
    getSelectProps: ((name: keyof SiteInduction) => sectionProps.getSelectProps(name as string)) as (name: keyof SiteInduction) => any,
    setFormState: sectionProps.setFormState,
  }


  if (isEditMode) {
    return (
      <Card className="p-6">
         <div className="flex justify-end mb-4">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
            onClick={handleExportPDF}
          >          
            Export as PDF
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-8">
            {formSections.map((section, index) => {
              const Section = section.component
              return (
                <div key={section.title} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{section.title}</h2>
                  </div>
                  <Section {...commonSectionProps} />
                </div>
              )
            })}
          </div>

          <div className="flex justify-end gap-2 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading || isSaving}
            >
              Cancel
            </Button>
            
            {hasPermission(Permissions.CREATE_INDUCTION)&&  currentInduction?.status != DocumentStatus.REVIEWED && (<Button
              type="submit"
              className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
              disabled={isLoading || isSaving}
            >
              {isLoading || isSaving ? "Saving..." : "Save Changes"}
            </Button>)
            }

            {hasPermission(Permissions.APPROVE_INDUCTION) && currentInduction?.status != DocumentStatus.REVIEWED && (<Button
            type="button"
              className="bg-green-600 hover:bg-green-800 text-btn-add-fg"
              disabled={isLoading || isSaving}
               onClick={handleStatusChange}
            >
              {isLoading || isSaving ? "Reviewing..." : "Review"}
            </Button>)}
          </div>
        </form>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {formSections[currentSectionIndex].title}
          </h2>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentSectionIndex + 1} of {totalSections}</span>
            <span>{totalSections - currentSectionIndex} steps remaining</span>
          </div>
        </div>

        {/* Current Section */}
        <div className="mt-6">
          <CurrentSection {...commonSectionProps} />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <div>
            {currentSectionIndex > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSaving || isLoading}
              >
                Previous
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving || isLoading}
            >
              Cancel
            </Button>

            {currentSectionIndex < totalSections - 1 ? (
              <Button
                type="button"
                className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
                onClick={handleNext}
                disabled={isSaving || isLoading}
              >
                {isSaving ? "Saving..." : "Next"}
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
                disabled={isLoading || isSaving}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Card>
  )
}