// list.tsx
"use client"

import { DataTable } from "@/components/data-table"
import { getDailyInspections } from "@/app/actions/dailyInspectionActions"
import { useModal } from "@/hooks/useModal"
import type { DailyInspection } from "@/lib/types/dailyInspection"
import { DailyInspectionForm } from "./add-edit-modal" 
import type { NestedKeyOf } from "@/lib/types/table"
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/modal"
import type { TableColumn, SortDirection } from "@/lib/types/table"
import toast from "react-hot-toast"
import { useFetch } from "@/hooks/useFetch"
import { Pagination } from "@/components/pagination"
import { useCallback, useState } from "react"
import { ListHeader } from "@/components/list-header"
import { FilterModal } from "./filter-modal"
import { FilterBadges } from "@/components/filter-badges"
import { Loader } from "@/components/loader"
import { Permissions } from "@/lib/types/permissions"
import { DocumentStatus } from "@/lib/helpers/enum"

export const DailyInspectionList = () => {
  const { isOpen: isFormOpen, currentRecord, openModal, closeModal } = useModal<DailyInspection>()
  const { isOpen: isFilterOpen, openModal: openFilterModal, closeModal: closeFilterModal } = useModal()

  const {
    records: inspections,
    isLoading,
    filters,
    setFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    refresh,
  } = useFetch<DailyInspection, { search: string; supplier: string; jobNumber: string; weekStartDate: string }>({
    fetchAction: getDailyInspections,
    initialFilters: { search: "", supplier: "", jobNumber: "", weekStartDate: "" },
    initialPageSize: 10,
  })

  const columns: TableColumn<DailyInspection>[] = [
    {
      header: "Project",
      key: "project.name",
      className: "min-w-[120px]",
    },
    {
      header: "Job Number",
      key: "jobNumber",
      className: "min-w-[120px]",
    },
    {
      header: "Supplier",
      key: "supplier",
      className: "min-w-[120px]",
    },
    {
      header: "Week Start Date",
      key: "weekStartDate",
      isDate: true,
      className: "min-w-[120px]",
    },
    {
      header: "Inspector",
      key: "inspectorName",
      className: "min-w-[150px]",
    },
    {
      header: "Status",
      key: "documentStatus",
      className: "min-w-[100px]",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === DocumentStatus.SUBMITTED
              ? "bg-yellow-200 text-black"
              : value === DocumentStatus.APPROVED
                ? "bg-green-100 text-green-800"
                : "bg-purple-100 text-red-500"
          }`}
        >
          {value as DocumentStatus}
        </span>
      ),
    },
  ]

  const handleEdit = (inspection: DailyInspection) => {
    openModal(inspection)
  }

  const handleAdd = () => {
    openModal()
  }

  const handleSort = (key: NestedKeyOf<DailyInspection>, direction: SortDirection) => {
    console.log("Sorting by:", key, direction)
  }

  const handleSuccess = (data: DailyInspection, message: string) => {
    toast.success(message || "Inspection saved successfully!")
    refresh()
    closeModal()
  }

  const handleError = (error: string) => {
    toast.error(error)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPage(1)
  }

  const handleSearch = useCallback(
    (term: string) => {
      setFilter("search", term)
      setPage(1)
    },
    [setFilter, setPage],
  )

  const handleApplyFilters = (newFilters: { supplier: string; jobNumber: string; weekStartDate: string }) => {
    setFilter("supplier", newFilters.supplier)
    setFilter("jobNumber", newFilters.jobNumber)
    setFilter("weekStartDate", newFilters.weekStartDate)
    setPage(1)
  }

  const handleRemoveFilter = (key: "search" | "supplier" | "jobNumber" | "weekStartDate") => {
    setFilter(key, "")
    setPage(1)
    refresh()
  }

  return (
    <>
      <div className="mx-auto">
        <ListHeader
          title="Daily Checks"
          searchPlaceholder="Search inspections..."
          onSearch={handleSearch}
          onAdd={handleAdd}
          onFilter={openFilterModal}
          onRefresh={refresh}
          addButtonText="New Inspection"
          className="bg-card"
          addPermission={Permissions.CREATE_WEEKLY_CHECK}
        />
        <FilterBadges filters={filters} onRemoveFilter={handleRemoveFilter} />

        {isLoading ? (
          <Loader />
        ) : (
          <DataTable<DailyInspection>
            data={inspections}
            columns={columns}
            onSort={handleSort}
            onEdit={handleEdit}
          />
        )}

        {inspections.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalRecords={totalRecords}
            currentRecords={inspections.length}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            className="mt-4"
          />
        )}
      </div>

      <Modal open={isFormOpen} onOpenChange={closeModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {currentRecord ? "Edit Inspection" : "New Daily Inspection"}
            </ModalTitle>
          </ModalHeader>
          <DailyInspectionForm
            onClose={closeModal}
            onSuccess={handleSuccess}
            onError={handleError}
            currentInspection={currentRecord}
          />
        </ModalContent>
      </Modal>

      <Modal open={isFilterOpen} onOpenChange={closeFilterModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Filter Inspections</ModalTitle>
          </ModalHeader>
          <FilterModal
            onApply={handleApplyFilters}
            onClose={closeFilterModal}
            initialFilters={filters}
          />
        </ModalContent>
      </Modal>
    </>
  )
}