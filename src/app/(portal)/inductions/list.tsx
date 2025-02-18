"use client";
import { DataTable } from "@/components/data-table";
import { getInductions } from "@/app/actions/inductionActions"; 
import { useModal } from "@/hooks/useModal";
import type { SiteInduction } from "@/lib/types/induction";
import { InductionStatus } from "@/lib/types/induction";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/modal";
import type { TableColumn, SortDirection } from "@/lib/types/table";
import { useFetch } from "@/hooks/useFetch";
import { Pagination } from "@/components/pagination";
import { useCallback } from "react";
import { ListHeader } from "@/components/list-header";
import { FilterModal } from "./filter-modal";
import { FilterBadges } from "@/components/filter-badges";
import { Loader } from "@/components/loader";
import { InductionForm } from "./add-edit-modal";
import { Permissions } from "@/lib/types/permissions";

export const InductionList = () => {
  const { isOpen: isFormOpen, currentRecord, openModal, closeModal } = useModal<SiteInduction>();
  const { isOpen: isFilterOpen, openModal: openFilterModal, closeModal: closeFilterModal } = useModal();

  const {
    records: inductions,
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
  } = useFetch<SiteInduction, { projectName: string; inductedBy: string; supervisedBy: string; createdAt: string }>({
    fetchAction: getInductions,
    initialFilters: { projectName: "", inductedBy: "", supervisedBy: "", createdAt: "" },
    initialPageSize: 10,
  });

  const columns: TableColumn<SiteInduction>[] = [

    {
      header: "Induction Project",
      key: "project.name",
      className: "font-medium min-w-[200px]",
     
    },
    {
      header: "Induction #",
      key: "inductionNumber",
      className: "font-medium min-w-[200px]",
     
    },
    
    {
      header: "Submission Date",
      key: "createdAt",
      isDate: true,
      className: "min-w-[120px]"    
    },
    {
      header: "Filled By",
      key: "inductedPerson.fullName",
      className: "min-w-[140px]"     
    },
    {
      header: "Inducted By",
      key: "inductedBy.fullName",
      className: "min-w-[140px]"     
    },
    {
      header: "Supervised By",
      key: "supervisedBy.fullName",
      className: "min-w-[140px]",
     
    },
    
    {
          header: "Status",
          key: "status",
          className: "min-w-[140px]",
          render: (value) => (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                value === InductionStatus.SUBMITTED
                  ? "bg-yellow-200 text-black"
                  : value === InductionStatus.APPROVED
                    ? "bg-green-100 text-green-800"
                    : "bg-purple-100 text-red-500"
              }`}
            >
              {value as InductionStatus}
            </span>
          ),
        },
 
  ];

  const handleEdit = (induction: SiteInduction) => openModal(induction);
  const handleAdd = () => openModal();
  const handleDelete = (induction: SiteInduction) => console.log("Deleting induction:", induction);

  const handleSort = (key: keyof SiteInduction, direction: SortDirection) => console.log("Sorting by:", key, direction);

  const handleSearch = useCallback(
    (term: string) => {
      setFilter("projectName", term);
      setPage(1);
    },
    [setFilter, setPage]
  );

  const handleApplyFilters = (newFilters: { projectName: string; inductedBy: string; supervisedBy: string; createdAt: string }) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      if (key in filters) {
        setFilter(key as keyof typeof filters, value); // Type assertion here
      }
    });
    setPage(1);
  };

  const handleRemoveFilter = (key: keyof typeof filters) => {
    setFilter(key, "");
    refresh();
  };

  const handleComplete = () =>{
    refresh();
  }

  return (
    <>
      <div className="mx-auto">
        <ListHeader
          title="Induction List"
          searchPlaceholder="Search by Project Name..."
          onSearch={handleSearch}
          onAdd={handleAdd}
          onFilter={openFilterModal}
          onRefresh={refresh}
          addButtonText="Add Induction"
          className="bg-card"
          addPermission={Permissions.CREATE_INDUCTION}
        />
        <FilterBadges filters={filters} onRemoveFilter={handleRemoveFilter} />

        {isLoading ? (
          <Loader />
        ) : (
          <DataTable<SiteInduction>
            data={inductions}
            columns={columns}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {inductions.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalRecords={totalRecords}
            currentRecords={inductions.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            className="mt-4"
          />
        )}
      </div>

      <Modal open={isFormOpen} onOpenChange={closeModal}>
        <ModalContent className="overflow-auto scrollbar-thin  scrollbar-thumb-accent scrollbar-track-accent/20">
          <ModalHeader>
            <ModalTitle>{currentRecord ? "Edit Induction" : "New Induction"}</ModalTitle>
          </ModalHeader>
          <InductionForm onComplete={handleComplete}  onClose={closeModal} currentInduction={currentRecord} />
        </ModalContent>
      </Modal>

      <Modal open={isFilterOpen} onOpenChange={closeFilterModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Filter Inductions</ModalTitle>
          </ModalHeader>
          <FilterModal
            onApply={handleApplyFilters}
            onClose={closeFilterModal}
            initialFilters={{
              projectName: filters.projectName || "",
              inductedBy: filters.inductedBy || "",
              supervisedBy: filters.supervisedBy || "",
              createdAt: filters.createdAt || "",
            }}
          />
        </ModalContent>
      </Modal>
    </>
  );
};
