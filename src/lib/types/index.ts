export interface Option {
    value: string
    label: string
  }
  
  export interface BaseFieldProps {
    name: string
    "aria-invalid"?: boolean
    "aria-describedby"?: string
    id?: string
    required?: boolean
  }
  
  export interface SearchableSelectProps extends BaseFieldProps {
    options: Option[]
    value: string | string[]
    onChange: (value: string | string[]) => void
    placeholder?: string
    isMulti?: boolean
    closeAfterSelect?: boolean
    isLoading?: boolean
    //isValid:boolean
  }