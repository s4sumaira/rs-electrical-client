"use client"

import { DataTable } from "@/components/data-table"
import { getAccidentIncidentReports } from "@/app/actions/accidentIncidentActions"
import { useModal } from "@/hooks/useModal"
import type { AccidentIncidentReport } from "@/lib/types/accidentIncident"
import { AccidentIncidentForm } from "./add-edit-modal"
import type { NestedKeyOf } from "@/lib/types/table"
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/modal"
import type { TableColumn, SortDirection } from "@/lib/types/table"
import toast from "react-hot-toast"
import { useFetch } from "@/hooks/useFetch"
import { Pagination } from "@/components/pagination"
import { useCallback, useState } from "react"
import { ListHeader } from "@/components/list-header"
import { AccidentIncidentFilterModal } from "./filter-modal"
import { FilterBadges } from "@/components/filter-badges"
import { Loader } from "@/components/loader"
import { Permissions } from "@/lib/types/permissions"
import { AccidentType, DocumentStatus } from "@/lib/helpers/enum"

export const AccidentIncidentList = () => {
  const { isOpen: isFormOpen, currentRecord, openModal, closeModal } = useModal<AccidentIncidentReport>()
  const { isOpen: isFilterOpen, openModal: openFilterModal, closeModal: closeFilterModal } = useModal()
  // const [isDeleting, setIsDeleting] = useState(false)

  const {
    records: reports,
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
  } = useFetch<AccidentIncidentReport, { search: string; fromDate: string; toDate: string; incidentType: string; incidentClassification: string }>({
    fetchAction: getAccidentIncidentReports,
    initialFilters: { search: "", fromDate: "", toDate: "", incidentType: "", incidentClassification: "" },
    initialPageSize: 10,
  })

  const columns: TableColumn<AccidentIncidentReport>[] = [
    {
      header: "Project",
      key: "project.name",
      className: "min-w-[120px]",
    },
    {
      header: "Date",
      key: "reportedDate",
      isDate: true,
      className: "min-w-[100px]",
    },
    {
      header: "Injured Person",
      key: "injuredPerson.fullName",
      className: "min-w-[150px]",
    },
    {
      header: "Type",
      key: "incidentDetails.type",
      className: "min-w-[100px]",
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
    {
      header: "Reporting Person",
      key: "reportingPerson.name",
      className: "min-w-[150px]",
    },
  ]

  const handleEdit = (report: AccidentIncidentReport) => {
    openModal(report)
  }

  const handleAdd = () => {
    openModal()
  }

  // const handleDelete = useCallback(async (report: AccidentIncidentReport) => {
  //   setIsDeleting(true)
  //   try {
  //     const result = await deleteAccidentIncidentReport(report._id as string)
  //     if (result.success) {
  //       toast.success(result.message || "Report deleted successfully!")
  //       refresh()
  //     } else {
  //       toast.error(result.error || "Failed to delete report.")
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred while deleting.")
  //   } finally {
  //     setIsDeleting(false)
  //   }
  // }, [refresh])

  const handleSort = (key: NestedKeyOf<AccidentIncidentReport>, direction: SortDirection) => {
    console.log("Sorting by:", key, direction)
    // Implement sorting logic here
  }

  const handleSuccess = (data: AccidentIncidentReport, message: string) => {
    toast.success(message || "Report saved successfully!")
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

  const handleApplyFilters = (newFilters: { 
    search: string; 
    fromDate: string; 
    toDate: string; 
    incidentType: string;
    incidentClassification: string;
  }) => {
    setFilter("search", newFilters.search)
    setFilter("fromDate", newFilters.fromDate)
    setFilter("toDate", newFilters.toDate)
    setFilter("incidentType", newFilters.incidentType)
    setFilter("incidentClassification", newFilters.incidentClassification)
    setPage(1)
  }


  const handleRemoveFilter = (key: "search" | "fromDate" | "toDate" | "incidentType" | "incidentClassification" ) => {
    setFilter(key, "")
    setPage(1)
    refresh()
  }

  return (
    <>
      <div className="mx-auto">
        <ListHeader
          title="Accident & Incident Reports"
          searchPlaceholder="Search reports..."
          onSearch={handleSearch}
          onAdd={handleAdd}
          onFilter={openFilterModal}
          onRefresh={refresh}
          addButtonText="New Report"
          className="bg-card"
          addPermission={Permissions.VIEW_DAILY_CHECK}
        />
        <FilterBadges filters={filters} onRemoveFilter={handleRemoveFilter} />

        {isLoading ? (
          <Loader />
        ) : (
          <DataTable<AccidentIncidentReport>
            data={reports}
            columns={columns}
            onSort={handleSort}
            onEdit={handleEdit}
           
          />
        )}

        {reports.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalRecords={totalRecords}
            currentRecords={reports.length}
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
              {currentRecord ? "Edit Accident & Incident Report" : "New Accident & Incident Report"}
            </ModalTitle>
          </ModalHeader>
          <AccidentIncidentForm
            onClose={closeModal}
            onSuccess={handleSuccess}
            onError={handleError}
            currentReport={currentRecord}
          />
        </ModalContent>
      </Modal>

      <Modal open={isFilterOpen} onOpenChange={closeFilterModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Filter Reports</ModalTitle>
          </ModalHeader>
          <AccidentIncidentFilterModal
            onApply={handleApplyFilters}
            onClose={closeFilterModal}
            initialFilters={{
              search: filters.search,
              fromDate: filters.fromDate,
              toDate: filters.toDate,
              incidentType: filters.incidentType,
              incidentClassification: filters.incidentClassification
            }}
          />
        </ModalContent>
      </Modal>
    </>
  )
}