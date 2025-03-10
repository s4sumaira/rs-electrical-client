"use client";

import { DataTable } from "@/components/data-table";
import { getHeightPermits } from "@/app/actions/heightPermitActions";
import { useModal } from "@/hooks/useModal";
import type { HeightPermit } from "@/lib/types/heightPermit";
import { HeightPermitForm } from "./add-edit-modal"; 
import type { NestedKeyOf } from "@/lib/types/table";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/modal";
import type { TableColumn, SortDirection } from "@/lib/types/table";
import toast from "react-hot-toast";
import { useFetch } from "@/hooks/useFetch";
import { Pagination } from "@/components/pagination";
import { useCallback } from "react";
import { ListHeader } from "@/components/list-header";
import { FilterModal } from "./filter-modal";
import { FilterBadges } from "@/components/filter-badges";
import { Loader } from "@/components/loader";
import { Permissions } from "@/lib/types/permissions";
import { DocumentStatus } from "@/lib/helpers/enum";

export const HeightPermitList = () => {
  const { isOpen: isFormOpen, currentRecord, openModal, closeModal } = useModal<HeightPermit>();
  const { isOpen: isFilterOpen, openModal: openFilterModal, closeModal: closeFilterModal } = useModal();

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
  } = useFetch<HeightPermit, { search: string; permitNumber: string; site: string; contractor: string; date: string }>({
    fetchAction: getHeightPermits,
    initialFilters: { search: "", permitNumber: "", site: "", contractor: "", date: "" },
    initialPageSize: 10,
  });

  const columns: TableColumn<HeightPermit>[] = [
    {
      header: "Permit Number",
      key: "permitNumber",
      className: "min-w-[120px]",
    },
    {
      header: "Project",
      key: "project.name",
      className: "min-w-[150px]",
    },
    {
      header: "Location",
      key: "location",
      className: "min-w-[150px]",
    },
    {
      header: "Contractor",
      key: "contractor",
      className: "min-w-[150px]",
    },
    {
      header: "Date",
      key: "date",
      isDate: true,
      className: "min-w-[120px]",
    },
    {
      header: "Valid From",
      key: "validFrom",
      className: "min-w-[120px]",
      render: (value, record) => `${record.validFrom} ${record.validFromTime}`,
    },
    {
      header: "Valid To",
      key: "validTo",
      className: "min-w-[120px]",
      render: (value, record) => `${record.validTo} ${record.validToTime}`,
    },
    {
      header: "Status",
      key: "documentStatus",
      className: "min-w-[100px]",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            [ DocumentStatus.COMPLETED].includes(value as any)
              ? "bg-yellow-200 text-black"
              : [DocumentStatus.FINALISED].includes(value as any)
              ? "bg-green-100 text-green-800"
              : "bg-purple-100 text-red-500"
          }`}
        >
          {value as DocumentStatus}
        </span>
      ),
    },
  ];

  const handleEdit = (permit: HeightPermit) => {
    openModal(permit);
  };

  const handleAdd = () => {
    openModal();
  };

  const handleSort = (key: NestedKeyOf<HeightPermit>, direction: SortDirection) => {
    console.log("Sorting by:", key, direction);
    // Implement sorting logic here
  };

  const handleSuccess = (data: HeightPermit, message: string) => {
    toast.success(message || "Permit saved successfully!");
    refresh();
    closeModal();
  };

  const handleError = (error: string) => {
    toast.error(error);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleSearch = useCallback(
    (term: string) => {
      setFilter("search", term);
      setPage(1);
    },
    [setFilter, setPage],
  );

  const handleApplyFilters = (newFilters: { permitNumber: string; site: string; contractor: string; date: string }) => {
    setFilter("permitNumber", newFilters.permitNumber);
    setFilter("site", newFilters.site);
    setFilter("contractor", newFilters.contractor);
    setFilter("date", newFilters.date);
    setPage(1);
  };

  const handleRemoveFilter = (key: "search" | "permitNumber" | "site" | "contractor" | "date") => {
    setFilter(key, "");
    setPage(1);
    refresh();
  };

  return (
    <>
      <div className="mx-auto">
        <ListHeader
          title="Height Permits"
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
          <DataTable<HeightPermit>
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
              {currentRecord ? "Edit Height Permit" : "New Height Permit"}
            </ModalTitle>
          </ModalHeader>
          <HeightPermitForm
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
              permitNumber: filters.permitNumber,
              site: filters.site,
              contractor: filters.contractor,
              date: filters.date,
            }}
          />
        </ModalContent>
      </Modal>
    </>
  );
};