import { useState, useCallback, useEffect } from "react";
// import { useActionState } from "react";
import { useFormState } from "react-dom"
import { type ActionState, InitialState, type ValidationErrors } from "@/lib/types/form";
import { get, set } from "lodash";
import { SearchableSelectProps } from "@/lib/types";

type FormErrors<T> = Partial<Record<keyof T, string[]>>;

interface BaseFieldProps {
  name: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  id?: string;
  required?: boolean;
}

interface InputFieldProps extends BaseFieldProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

interface SelectFieldProps extends BaseFieldProps {
  value: string;
  onValueChange: (value: string) => void;
}

interface UseFormOptions<T> {
  initialValues: T;
  submitAction: (state: ActionState<T>, formData: FormData) => Promise<ActionState<T>>;
  onSuccess?: (data: T, message: string) => void;
  onError?: (error: string | ValidationErrors) => void;
  resetOnSuccess?: boolean;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  submitAction,
  onSuccess,
  onError,
  resetOnSuccess = true,
}: UseFormOptions<T>) => {
  const [formState, setFormState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (state: ActionState<T>, formData: FormData) => {
      setIsSubmitting(true);
      setErrors({});

      // Helper function to flatten object for FormData
      const flattenObject = (obj: any, parentKey = ''): Record<string, any> => {
        return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
          const value = obj[key];
          const newKey = parentKey ? `${parentKey}.${key}` : key;
      
          if (value === null || value === undefined) return acc;
      
          if (Array.isArray(value)) {
            // Convert array to JSON string to ensure it stays an array when sent
            acc[newKey] = JSON.stringify(value);
          } else if (typeof value === 'object' && !Array.isArray(value)) {
            // Recursively flatten nested objects
            Object.assign(acc, flattenObject(value, newKey));
          } else {
            acc[newKey] = value;
          }
      
          return acc;
        }, {});
      };

      // const flattenObject = (obj: any, parentKey = ''): Record<string, any> => {
      //   return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
      //     const value = obj[key];
      //     const newKey = parentKey ? `${parentKey}.${key}` : key;
      
      //     if (value === null || value === undefined) {
      //       return acc;
      //     }
      
      //     if (Array.isArray(value)) {
      //       // If it's an array of files, handle it later when appending to FormData
      //       acc[newKey] = value;
      //     } else if (value instanceof File) {
      //       // Directly store files to handle in FormData
      //       acc[newKey] = value;
      //     } else if (typeof value === 'object') {
      //       // Recursively flatten nested objects
      //       Object.assign(acc, flattenObject(value, newKey));
      //     } else {
      //       acc[newKey] = value;
      //     }
      
      //     return acc;
      //   }, {});
      // };
      
      
      

      // Flatten and set form data
      const flattenedData = flattenObject(formState);
      Object.entries(flattenedData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Append each array item individually
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.set(key, String(value));
        }
      });

      try {
        const result = await submitAction(state, formData);

        if (result.success) {
          if (resetOnSuccess) {
            setFormState(initialValues);
          }
          onSuccess?.(result.data as T, result.message);
        } else {
          if (result.error) {
            if (Array.isArray(result.error)) {
              onError?.(result.error[0]);
            } else {
              setErrors(result.error as FormErrors<T>);
              onError?.(typeof result.error === "object" ? "Please fill all fields correctly" : result.error);
            }
          }
        }
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        onError?.(errorMessage);
        return {
          success: false,
          message: errorMessage,
          error: errorMessage,
        };
      } finally {
        setIsSubmitting(false);
      }
    },
    [formState, initialValues, submitAction, onSuccess, onError, resetOnSuccess],
  );

  const [state, action, isPending] = useFormState(handleSubmit, InitialState<T>());

  useEffect(() => {
    if (state.data) {
      setFormState((prev) => ({ ...prev, ...state.data }));
    }
  }, [state.data]);

  const getInputProps = useCallback(
    (path: string): InputFieldProps => ({
      name: path,
      value: get(formState, path, "") || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setFormState((prev) => {
          const newState = { ...prev };
          set(newState, path, value);
          return newState;
        });
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[path];
          return newErrors;
        });
      },
      "aria-invalid": Boolean(get(errors, path)),
      "aria-describedby": get(errors, path) ? `${path}-error` : undefined,
      id: path,
      required: true,
    }),
    [formState, errors]
  );

  const getSelectProps = useCallback(
    (path: string): Omit<SearchableSelectProps, 'options'> => {
      const fieldValue = get(formState, path);
      const isArrayValue = Array.isArray(fieldValue);

      return {
        name: path,
        value: isArrayValue ? fieldValue : fieldValue || "",
        onChange: (value: string | string[]) => {
          setFormState((prev) => {
            const newState = { ...prev };
            set(newState, path, value);
            return newState;
          });
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[path];
            return newErrors;
          });
        },
        "aria-invalid": Boolean(get(errors, path)),
        "aria-describedby": get(errors, path) ? `${path}-error` : undefined,
        id: path,
        required: true,
      };
    },
    [formState, errors]
  );

  const reset = useCallback(() => {
    setFormState(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    formState,
    errors,
    isLoading: isSubmitting || isPending,
    handleSubmit: action,
    getInputProps,
    getSelectProps,
    reset,
    setFormState,
  };
};
