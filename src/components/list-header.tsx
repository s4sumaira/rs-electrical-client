import React, { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search, Filter, RefreshCw ,FileBadge,ChevronDown,File,Sheet} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"


interface ListHeaderProps {
  title: string
  searchPlaceholder?: string
  onSearch: (searchTerm: string) => void
  onAdd?: () => void
  onFilter: () => void
  onRefresh: () => void
  onExport?: () => void
  onExportPDF?: () => void;  
  onExportExcel?: () => void;
  addButtonText?: string
  exportButtonText?:string
  className?: string,
  addPermission:string
}

export function ListHeader({
  title,
  searchPlaceholder = "Search...",
  onSearch,
  onAdd,
  onFilter,
  onRefresh,
  onExport,
  onExportPDF,
  onExportExcel,
  addButtonText = "Add",
  exportButtonText ="Export",
  className,
  addPermission,
}: ListHeaderProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const{hasPermission} = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleSearch = () => {
    if (searchInputRef.current) {
      onSearch(searchInputRef.current.value)
    }
  }

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev)

 


  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <h2 className="text-md font-semibold text-[hsl(var(--foreground))] whitespace-nowrap">{title}</h2>
            <div className="flex items-center gap-2">
            
              <Input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                className="w-[250px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch()
                  }
                }}
              />
              <Button
                size="icon"
                onClick={handleSearch}
                type="button"
                className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
              >
                <Search className="h-4 w-4 text-[hsl(var(--btn-add-fg))]" />
                <span className="sr-only">Search</span>
              </Button>
              <Button
                size="icon"
                onClick={onFilter}
                type="button"
                className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
              >
                <Filter className="h-4 w-4 text-[hsl(var(--btn-add-fg))]" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">

          <Button
              className="bg-[hsl(var(--btn-add))] hover:bg-[hsl(var(--btn-add-hover))] text-[hsl(var(--btn-add-fg))]"
              onClick={onRefresh}
            >
                <RefreshCw className="w-4 h-4" />
            </Button>

            { onAdd && hasPermission(addPermission) && (
            <Button
              className="bg-[hsl(var(--btn-add))] hover:bg-[hsl(var(--btn-add-hover))] text-[hsl(var(--btn-add-fg))]"
              onClick={onAdd}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              {addButtonText}
            </Button>
          )}
           {onExport && (
              <div className="relative">
                <Button
                  onClick={toggleDropdown}
                  className="bg-[hsl(var(--btn-add))] hover:bg-[hsl(var(--btn-add-hover))] text-[hsl(var(--btn-add-fg))]"
                >
                  <FileBadge className="w-4 h-4 mr-2" />
                  {exportButtonText}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>

                {isDropdownOpen && (
                  <div className="absolute z-50 mt-2 bg-background border shadow-lg rounded-md w-full">
                    <ul>
                      <li
                        onClick={onExportPDF}
                        className="text-sm px-4 py-2 cursor-pointer hover:bg-accent flex items-center gap-2 w-full"
                      >
                        <File className="w-4 h-4 text-red-500" />
                         PDF
                      </li>
                      <li
                        onClick={onExportExcel}
                        className="text-sm px-4 py-2 cursor-pointer hover:bg-accent flex items-center gap-2 w-full"
                      >
                        <Sheet className="w-4 h-4 text-green-500" />
                         Excel
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

