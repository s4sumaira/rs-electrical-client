"use client"

import type React from "react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ChevronUp, ChevronDown, Edit2, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

import type { TableProps, NestedKeyOf, SortDirection, TableColumn, CurrencyCode } from "@/lib/types/table"

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  onSort,
  onEdit,
  onDelete,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: NestedKeyOf<T>
    direction: SortDirection
  } | null>(null)

  const handleSort = (key: NestedKeyOf<T>) => {
    let direction: SortDirection = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
    if (onSort) {
      onSort(key, direction)
    }
  }

  const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
   
    return path.split(".").reduce<unknown>((acc, part) => {
      if (acc && typeof acc === "object" && acc !== null && part in acc) {
        return (acc as Record<string, unknown>)[part]
      }
      return undefined
    }, obj)
  }

  const renderCellContent = (row: T, column: TableColumn<T>): React.ReactNode => {
   
    const value = typeof column.key === "string" ? getNestedValue(row, column.key) : row[column.key as keyof T]

    // If there's a custom render function, use it
    if (column.render) {
      return column.render(value, row) // Pass the `row` for context
    }

    // Special case for fullName
    if (
      column.key === "fullName" &&
      "firstName" in row &&
      "lastName" in row &&
      typeof row.firstName === "string" &&
      typeof row.lastName === "string"
    ) {
      return `${row.firstName} ${row.lastName}`
    }

    if (column.isDate) {
     
      return new Date(value as Date).toLocaleDateString("en-GB");
    }

    if (column.isAmount && typeof value === "number") {
      const currencyOptions: Record<CurrencyCode, { locale: string; currency: CurrencyCode }> = {
        USD: { locale: "en-US", currency: "USD" },
        GBP: { locale: "en-GB", currency: "GBP" },
      }

      const { locale, currency } = currencyOptions[column.currency || "USD"]

      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
      }).format(value)
    }

    if (value === null || value === undefined) {
      return "-"
    }

    return value as React.ReactNode
  }

  return (
    <div className="relative w-full overflow-auto rounded-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 text-sm dark:bg-gray-800 transition-colors">
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className={cn(
                  "h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400",
                  onSort && "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
                  column.className,
                )}
                onClick={() => onSort && handleSort(column.key)}
              >
                <div className="flex items-center space-x-2">
                  <span>{column.header}</span>
                  {sortConfig?.key === column.key && (
                    <span className="ml-2">
                      {sortConfig.direction === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
             {(onEdit || onDelete) && (
            <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400">
              Actions
            </TableHead>
             )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={"id" in row ? String(row.id) : rowIndex}
              className="border-t text-sm border-gray-200 dark:border-gray-700 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              {columns.map((column) => (
                <TableCell
                  key={String(column.key)}
                  className={cn("p-4 align-middle text-gray-700 dark:text-gray-300", column.className)}
                >
                  {renderCellContent(row, column)}
                </TableCell>
              ))}
                {(onEdit || onDelete) && (
              <TableCell className="p-4 align-middle">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[160px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  >
                      {onEdit && (
                        <>
                          <DropdownMenuLabel className="text-sm">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(row)} className="text-sm cursor-pointer">
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        </>
                  
                      )}
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={() => onDelete(row)}
                        className="text-sm text-red-600 dark:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
                )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
