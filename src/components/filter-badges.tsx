import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterBadgesProps<T extends Record<string, string>> {
  filters: T
  onRemoveFilter: (key: keyof T) => void
  /**
   * Optional mapping of filter keys to display names
   * If not provided, the key will be used as display name
   */
  displayNames?: Partial<Record<keyof T, string>>
}

export function FilterBadges<T extends Record<string, string>>({
  filters,
  onRemoveFilter,
  displayNames = {},
}: FilterBadgesProps<T>) {
  const activeFilters = Object.entries(filters).filter(([_, value]) => value !== "") as [keyof T, string][]

  if (activeFilters.length === 0) {
    return null
  }

  const getDisplayName = (key: keyof T): string => {
    return (
      (displayNames[key] as string) ||
      // Convert camelCase to Title Case
      key
        .toString()
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
    )
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {activeFilters.map(([key, value]) => (
        <span
          key={key.toString()}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full"
        >
          {getDisplayName(key)}: {value}
          <button onClick={() => onRemoveFilter(key)} className="ml-1 hover:text-orange-900 focus:outline-none">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  )
}

