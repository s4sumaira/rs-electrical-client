"use client"

import { DataTable } from "@/components/data-table"
import { getHotWorkPermits } from "@/app/actions/hotWorkPermitActions"
import { useModal } from "@/hooks/useModal"
import type { HotWorkPermit } from "@/lib/types/hotWorkPermit"
import { HotWorkPermitForm } from "./add-edit-modal"
import type { TableColumn, SortDirection, NestedKeyOf } from "@/lib/types/table"
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/modal"
import toast from "react-hot-toast"
import { useFetch } from "@/hooks/useFetch"
import { Pagination } from "@/components/pagination"
import { useCallback } from "react"
import { ListHeader } from "@/components/list-header"
import { FilterModal } from "./filter-modal"
import { FilterBadges } from "@/components/filter-badges"
import { Loader } from "@/components/loader"
import { Permissions } from "@/lib/types/permissions"
import { DocumentStatus } from "@/lib/helpers/enum"

export const HotWorkPermitList = () => {
  const { isOpen: isFormOpen, currentRecord, openModal, closeModal } = useModal<HotWorkPermit>()
  const { isOpen: isFilterOpen, openModal: openFilterModal, closeModal: closeFilterModal } = useModal()

  const {
    records: permits,
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
  } = useFetch<HotWorkPermit, { 
    search: string; 
    jobNumber: string;
    companyName: string;
    dateOfWorks: string;
    permitNumber: string;
  }>({
    fetchAction: getHotWorkPermits,
    initialFilters: { 
      search: "", 
      jobNumber: "", 
      companyName: "", 
      dateOfWorks: "",
      permitNumber: ""
    },
    initialPageSize: 10,
  })

  const columns: TableColumn<HotWorkPermit>[] = [
    {
      header: "Project",
      key: "project.name",
      className: "min-w-[120px]",
    },
    {
      header: "Company",
      key: "companyName",
      className: "min-w-[150px]",
    },
    {
      header: "Permit #",
      key: "permitNumber",
      className: "min-w-[120px]",
    },
    {
      header: "Job #",
      key: "jobNumber",
      className: "min-w-[120px]",
    },
    {
      header: "Date",
      key: "dateOfWorks",
      isDate: true,
      className: "min-w-[120px]",
    },
    {
      header: "Supervisor",
      key: "supervisor.fullName",
      className: "min-w-[150px]",
    },
    {
      header: "Status",
      key: "documentStatus",
      className: "min-w-[100px]",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === DocumentStatus.SUBMITTED
            ? "bg-yellow-200 text-black"
            : value === DocumentStatus.APPROVED
              ? "bg-green-100 text-green-800"
              : "bg-purple-100 text-red-500"
        }`}>
          {value as DocumentStatus}
        </span>
      ),
    },
  ]

  const handleEdit = (permit: HotWorkPermit) => {
   // console.log(permit);
    openModal(permit)
  }

  const handleAdd = () => {
    openModal()
  }

  const handleSort = (key: NestedKeyOf<HotWorkPermit>, direction: SortDirection) => {
    console.log("Sorting by:", key, direction)
  }

  const handleSuccess = (data: HotWorkPermit, message: string) => {
    toast.success(message || "Permit saved successfully!")
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
    jobNumber: string;
    companyName: string;
    dateOfWorks: string;
    permitNumber: string;
  }) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      setFilter(key as keyof typeof newFilters, value)
    })
    setPage(1)
  }

  const handleRemoveFilter = (key: keyof typeof filters) => {
    setFilter(key, "")
    setPage(1)
    refresh()
  }

  return (
    <>
      <div className="mx-auto">
        <ListHeader
          title="Hot Work Permits"
          searchPlaceholder="Search permits..."
          onSearch={handleSearch}
          onAdd={handleAdd}
          onFilter={openFilterModal}
          onRefresh={refresh}
          addButtonText="New Permit"
          className="bg-card"
          addPermission={Permissions.CREATE_WEEKLY_CHECK}
        />
        <FilterBadges filters={filters} onRemoveFilter={handleRemoveFilter} />

        {isLoading ? (
          <Loader />
        ) : (
          <DataTable<HotWorkPermit>
            data={permits}
            columns={columns}
            onSort={handleSort}
            onEdit={handleEdit}
          />
        )}

        {permits.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalRecords={totalRecords}
            currentRecords={permits.length}
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
              {currentRecord ? "Edit Permit" : "New Hot Work Permit"}
            </ModalTitle>
          </ModalHeader>
          <HotWorkPermitForm
            onClose={closeModal}
            onSuccess={handleSuccess}
            onError={handleError}
            currentPermit={currentRecord}
          />
        </ModalContent>
      </Modal>

      <Modal open={isFilterOpen} onOpenChange={closeFilterModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Filter Permits</ModalTitle>
          </ModalHeader>
          <FilterModal
            onApply={handleApplyFilters}
            onClose={closeFilterModal}
            initialFilters={{
              jobNumber: filters.jobNumber,
              companyName: filters.companyName,
              dateOfWorks: filters.dateOfWorks,
              permitNumber: filters.permitNumber
            }}
          />
        </ModalContent>
      </Modal>
    </>
  )
}