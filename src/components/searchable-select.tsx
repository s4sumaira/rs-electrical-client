"use client"

import { useState, useEffect, useRef } from "react"
import { Check, ChevronDown, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchableSelectProps } from "@/lib/types"

// interface Option {
//   value: string
//   label: string
// }


export function SearchableSelect({
  options,
  value = "",
  onChange,
  placeholder = "Select options...",
  name,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  id,
  required = false,
  isMulti = false,
  closeAfterSelect = false,
  isLoading = false,
}: SearchableSelectProps) {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState(options)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setFilteredOptions(options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase())))
  }, [search, options])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && (event.key === "Escape" || event.key === "Enter")) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (selectedValue: string) => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : []
      const newValue = currentValues.includes(selectedValue)
        ? currentValues.filter((v) => v !== selectedValue)
        : [...currentValues, selectedValue]
      onChange(newValue)
      if (closeAfterSelect) {
        setIsOpen(false)
      }
    } else {
      onChange(selectedValue)
      setIsOpen(false)
    }
  }

  const handleRemove = (valueToRemove: string, event: React.MouseEvent) => {
    event.stopPropagation()
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : []
      onChange(currentValues.filter((v) => v !== valueToRemove))
    }
  }

  // Convert value to array for multi-select or keep as string for single select
  const normalizedValue = isMulti
    ? (Array.isArray(value) ? value : value ? [value] : [])
    : (typeof value === 'string' ? value : '')

  // Get selected labels based on normalized value
  const selectedLabels = isMulti
    ? (normalizedValue as string[]).map((v) => options.find((option) => option.value === v)?.label ?? '')
    : [options.find((option) => option.value === normalizedValue)?.label].filter((label): label is string => Boolean(label))

  return (
    <div className="space-y-2" ref={containerRef}>
      <div className="relative">
        <div
          className={cn(
            "flex min-h-[2.5rem] w-full items-center justify-between rounded-md border dark:border-gray-700 bg-background text-foreground px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            ariaInvalid && "border-destructive",
            isLoading && "cursor-wait"
          )}
          onClick={() => !isLoading && setIsOpen(!isOpen)}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          id={id}
        >
          <div className="flex flex-wrap gap-1">
            {selectedLabels.map((label: string, index: number) => (
              <span
                key={index}
                className="bg-blue-300 text-black text-xs font-medium px-2 py-0.5 rounded flex items-center"
              >
                {label}
                {isMulti && !isLoading && (
                  <button
                    type="button"
                    onClick={(e) => handleRemove(Array.isArray(normalizedValue) ? normalizedValue[index] : "", e)}
                    className="ml-1 text-secondary-foreground hover:text-primary"
                  >
                    <X className="h-3 w-3 text-black" />
                  </button>
                )}
              </span>
            ))}
            {selectedLabels.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
          </div>
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-muted-foreground animate-spin flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </div>
        {isOpen && !isLoading && (
          <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
            <div className="relative border-b border-border">
              <input
                className="w-full px-3 py-2 text-sm bg-background text-foreground pr-8"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close dropdown"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="max-h-60 overflow-auto py-1 scrollbar-thin scrollbar-thumb-accent scrollbar-track-accent/20">
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer flex items-center",
                    (isMulti ?
                      Array.isArray(normalizedValue) && normalizedValue.includes(option.value)
                      : normalizedValue === option.value)
                      ? "bg-accent text-secondary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground",
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      (isMulti ?
                        Array.isArray(normalizedValue) && normalizedValue.includes(option.value)
                        : normalizedValue === option.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {isMulti ? (
        <select
          className="sr-only"
          name={name}
          multiple
          //required={required}
          value={Array.isArray(value) ? value : []}
          onChange={() => { }}
          aria-invalid={!value || (Array.isArray(value) && value.length === 0)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <select
          className="sr-only"
          name={name}
         // required={required}
          value={value as string}
          onChange={() => { }}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}