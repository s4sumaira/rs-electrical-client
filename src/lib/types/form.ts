// Define the structure for field-level validation errors
export interface ValidationErrors {
    [key: string]: string[];
  }
  
  // Define possible error types that can be returned
  export type ErrorType = string | ValidationErrors;
  
  // Define the base ActionState interface
  export interface ActionState<T> {
    success: boolean;
    message: string;
    data?: T | null;
    error?: ErrorType;
  }
  
  // Helper type to extract field names from a type
  export type FieldKeys<T> = keyof T;
  
  // Helper function to check if error is ValidationErrors
  export function isValidationErrors(error: ErrorType): error is ValidationErrors {
    return typeof error === 'object' && error !== null;
  }
  
  // Helper function to safely get field error
  export function getFieldError<T>(state: ActionState<T>, field: FieldKeys<T>): string[] | undefined {
    if (state.error && isValidationErrors(state.error)) {
      return state.error[field as string];
    }
    return undefined;
  }
  
  // Initial state factory function
  export function InitialState<T>(): ActionState<T> {
    return {
      success: false,
      message: '',
      data: null
    };
  }