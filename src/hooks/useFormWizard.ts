// hooks/useFormWizard.ts
import { useState, useCallback, useEffect } from "react"
import { useForm } from "@/hooks/useForm"
//import toast from "react-hot-toast"
import type { ActionState } from "@/lib/types/form"
import { useAuth } from "./useAuth"

const STORAGE_KEY_PREFIX = 'form_wizard_draft_'

interface WizardOptions<T, V> {
  id: string // Unique identifier for this wizard instance
  initialValues: T
  sections: React.ComponentType<any>[]
  validate: (sectionIndex: number, data: Partial<T>) => V | Promise<V> // Returns validation result
  isValid: (result: V) => boolean // Interpret validation result
  getValidationErrors: (result: V) => Record<string, string[]> // Convert validation result to errors
  //onSaveSection?: (sectionIndex: number, sectionData: Partial<T>) => Promise<ActionState<T>>
  onSubmit: (formData: T) => Promise<ActionState<T>>
  onComplete?: (data: T) => void
  onError?: (error: unknown) => void
}

export function useFormWizard<T extends Record<string, any>, V = any>({
  id,
  initialValues,
  sections,
  validate,
  isValid,
  getValidationErrors,
  //onSaveSection,
  onSubmit,
  onComplete,
  onError,
}: WizardOptions<T, V>) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [sectionErrors, setSectionErrors] = useState<Record<string, string[]>>({})

  const {
    formState,
    isLoading,
    getInputProps,
    getSelectProps,
    setFormState,
    
  } = useForm<T>({
    initialValues,
    submitAction: async (state, formData) => {
      return { success: true, message: "" }
    },
  })

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
    if (savedDraft) {
      try {
        const { data, section } = JSON.parse(savedDraft);
        setFormState(data);
        setCurrentSectionIndex(section);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [id, setFormState]);

  const saveDraft = useCallback((data: T, section: number) => {
   
    // localStorage.setItem(`${STORAGE_KEY_PREFIX}${id}`, JSON.stringify({
    //   data,
    //   section,
    //   lastUpdated: new Date().toISOString()
    // }));

  }, [id]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${id}`);
  }, [id]);

  // Clear errors when form state changes
  useEffect(() => {
    setSectionErrors({});
  }, [formState]);

  const validateSection = useCallback(async () => {
    try {
      const validationResult = await validate(currentSectionIndex, formState);

      console.log("Validation Result",validationResult);
      
      if (!isValid(validationResult)) {
        setSectionErrors(getValidationErrors(validationResult));
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  }, [currentSectionIndex, formState, validate, isValid, getValidationErrors]);

  const handleSave = useCallback(
    async (isFinalSubmission = false) => {
      try {
        setIsSaving(true);

        // Validate current section
        const isValidSection = await validateSection();
        
        if (!isValidSection) {
          return false;
        }

        if (isFinalSubmission) {
          // On final submission, clear draft and submit
          saveDraft(formState, currentSectionIndex);

          const result = await onSubmit(formState as T);
          if (result.success) {
            clearDraft();
            return true;
          }
          if (result.error && typeof result.error === "object") {
            setSectionErrors(result.error as Record<string, string[]>);
          }
          return false;
        } else {
          // Save draft and optionally call onSaveSection
          saveDraft(formState, currentSectionIndex);
          
          // if (onSaveSection) {
          //   const result = await onSaveSection(currentSectionIndex, formState);
          //   if (!result.success) {
          //     if (result.error && typeof result.error === "object") {
          //       setSectionErrors(result.error as Record<string, string[]>);
          //     }
          //     return false;
          //   }
          // }
          
          return true;
        }
      } catch (error) {
        console.error('Save error:', error);
        onError?.(error);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [
      currentSectionIndex,
      formState,
      validateSection,
      //onSaveSection,
      onSubmit,
      onError,
      saveDraft,
      clearDraft,
    ]
  );

  const handleNext = useCallback(async () => {
    const saved = await handleSave(false);
    console.log("next",saved);
    if (saved && currentSectionIndex < sections.length - 1) {
      setSectionErrors({});
      setCurrentSectionIndex((prev) => prev + 1);
    }
  }, [currentSectionIndex, sections.length, handleSave]);

  const handleBack = useCallback(() => {
    if (currentSectionIndex > 0) {
      setSectionErrors({});
      setCurrentSectionIndex((prev) => prev - 1);
    }
  }, [currentSectionIndex]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const saved = await handleSave(true);
      if (saved) {
        onComplete?.(formState as T);
      }
    },
    [formState, handleSave, onComplete]
  );

  return {
    currentSection: sections[currentSectionIndex],
    currentSectionIndex,
    totalSections: sections.length,
    progress: ((currentSectionIndex + 1) / sections.length) * 100,
    sectionProps: {
      formState,
      errors: sectionErrors,
      getInputProps,
      getSelectProps,
      setFormState,
    },
    handleNext,
    handleBack,
    handleSubmit,
    formState,
    isLoading,
    isSaving,
    errors: sectionErrors,
  };
}