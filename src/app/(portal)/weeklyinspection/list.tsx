// list.tsx
"use client"

import { DataTable } from "@/components/data-table"
import { getWeeklyInspections } from "@/app/actions/weeklyInspectionActions"
import { useModal } from "@/hooks/useModal"
import type { WeeklyCheck } from "@/lib/types/weeklyInspection"
import { WeeklyInspectionForm } from "./add-edit-modal"
import type { NestedKeyOf } from "@/lib/types/table"
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/modal"
import type { TableColumn, SortDirection } from "@/lib/types/table"
import toast from "react-hot-toast"
import { useFetch } from "@/hooks/useFetch"
import { Pagination } from "@/components/pagination"
import { useCallback ,useState} from "react"
import { ListHeader } from "@/components/list-header"
import { FilterModal } from "@/app/(portal)/weeklyinspection/filter-modal"
import { FilterBadges } from "@/components/filter-badges"
import { Loader } from "@/components/loader"
import { Permissions } from "@/lib/types/permissions"


export const WeeklyInspectionList = () => {
  const { isOpen: isFormOpen, currentRecord, openModal, closeModal } = useModal<WeeklyCheck>()
  const { isOpen: isFilterOpen, openModal: openFilterModal, closeModal: closeFilterModal } = useModal()
  const [isDeleting, setIsDeleting] = useState(false)

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
  } = useFetch<WeeklyCheck, { search: string; supplier: string; jobNumber: string }>({
    fetchAction: getWeeklyInspections,
    initialFilters: { search: "", supplier: "", jobNumber: "" },
    initialPageSize: 10,
  })

  const columns: TableColumn<WeeklyCheck>[] = [
    {
      header: "Project",
      key: "project.name",
      className: "font-medium min-w-[200px]",
    },
    {
      header: "Job Number",
      key: "jobNumber",
      className: "min-w-[120px]",
    },
    {
      header: "Date",
      key: "date",
      isDate:true,
      className: "min-w-[120px]",
      
    },
    {
      header: "Inspector",
      key: "inspectionCompletion.inspectorName",
      className: "min-w-[150px]",
    },
    {
      header: "Status",
      key: "status",
      className: "min-w-[100px]"   
      
    },
  ]

  const handleEdit = (inspection: WeeklyCheck) => {
    openModal(inspection)
  }

  const handleAdd = () => {
    openModal()
  }

  const handleDelete = useCallback(async (inspection: WeeklyCheck) => {
    // setIsDeleting(true)
    // try {
    //   const result = await deleteWeeklyInspection(inspection._id)
    //   if (result.success) {
    //     toast.success(result.message || "Inspection deleted successfully!")
    //     refresh()
    //   } else {
    //     toast.error(result.error || "Failed to delete inspection.")
    //   }
    // } catch (error) {
    //   toast.error("An error occurred while deleting.")
    // } finally {
    //   setIsDeleting(false)
    // }
  }, [refresh])

  const handleSort = (key: NestedKeyOf<WeeklyCheck>, direction: SortDirection) => {
    console.log("Sorting by:", key, direction)
    // Implement sorting logic here
  }

  const handleSuccess = (data: WeeklyCheck, message: string) => {
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

  const handleApplyFilters = (newFilters: { supplier: string; jobNumber: string }) => {
    setFilter("supplier", newFilters.supplier)
    setFilter("jobNumber", newFilters.jobNumber)
    setPage(1)
  }

  const handleRemoveFilter = (key: "search" | "supplier" | "jobNumber") => {
    setFilter(key, "")
    setPage(1)
    refresh()
  }

  return (
    <>
      <div className="mx-auto">
        <ListHeader
          title="Weekly MEWP Inspections"
          searchPlaceholder="Search inspections..."
          onSearch={handleSearch}
          onAdd={handleAdd}
          onFilter={openFilterModal}
          onRefresh={refresh}
          addButtonText="New Inspection"
          className="bg-card"
          //addPermission={Permissions.CREATE_WEEKLY_INSPECTION}
          addPermission={Permissions.CREATE_PROJECT}
        />
        <FilterBadges filters={filters} onRemoveFilter={handleRemoveFilter} />

        {isLoading ? (
          <Loader />
        ) : (
          <DataTable<WeeklyCheck>
            data={inspections}
            columns={columns}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
              {currentRecord ? "Edit Inspection" : "New Weekly Inspection"}
            </ModalTitle>
          </ModalHeader>
          <WeeklyInspectionForm
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
            initialFilters={{  supplier : filters.supplier , jobNumber: filters.jobNumber }}
          />
        </ModalContent>
      </Modal>
    </>
  )
}