"use client"
import { DataTable } from "@/components/data-table"
import { getProjects } from "@/app/actions/projectActions"
import { useModal } from "@/hooks/useModal"
import type { Project } from "@/lib/types/project"
import { ProjectForm } from "./add-edit-modal"
import type { NestedKeyOf } from "@/lib/types/table"
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/modal"
import type { TableColumn, SortDirection } from "@/lib/types/table"
import toast from "react-hot-toast"
import { useFetch } from "@/hooks/useFetch"
import { Pagination } from "@/components/pagination"
import { useCallback } from "react"
import { ListHeader } from "@/components/list-header"
import { Avatar } from "@/components/avatar"
import { FilterModal } from "./filter-modal"
import { FilterBadges } from "@/components/filter-badges"
import { Loader } from "@/components/loader"
import { deleteProject } from "@/app/actions/projectActions"
import { useState } from "react"
import { Permissions } from "@/lib/types/permissions";

export const ProjectList = () => {
  const { isOpen: isFormOpen, currentRecord, openModal, closeModal } = useModal<Project>()
  const { isOpen: isFilterOpen, openModal: openFilterModal, closeModal: closeFilterModal } = useModal()
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    records: projects,
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
  } = useFetch<Project, { search: string; name: string; postCode: string }>({
    fetchAction: getProjects,
    initialFilters: { search: "", name: "", postCode: "" },
    initialPageSize: 10,
  })

  const columns: TableColumn<Project>[] = [
    {
      header: "Name",
      key: "name",
      className: "font-medium min-w-[200px]",
    },
    {
      header: "Address",
      key: "fullAddress",
      className: "min-w-[180px] truncate",
      render: (value) => (
        <span className="truncate block" title={value as string}>
          {value as string}
        </span>
      ),
    },
    {
      header: "Supervised By",
      key: "supervisedBy",
      className: "min-w-[120px]",
      render: (_, record) => (
        <span>
          {record?.supervisedBy?.map((person) => person.fullName).join(", ") || "N/A"}
        </span>
      ),
    },
    {
      header: "Inducted By",
      key: "inductedBy",
      className: "hidden xl:table-cell min-w-[140px] truncate",
      render: (_, record) => (
        <span>
          {record?.inductedBy?.map((person) => person.fullName).join(", ") || "N/A"}
        </span>
      ),
    },
  ]

  const handleEdit = (project: Project) => {
    
    openModal(project)
  }

  const handleAdd = () => {
    openModal()
  }

  const handleDelete = useCallback(async (project: Project) => {
    setIsDeleting(true);
    try {
      const result = await deleteProject(project._id);
      if (result.success) {
        toast.success(result.message || "Project deleted successfully!");
        refresh();
      } else {
        toast.error(result.error as string|| "Failed to delete project.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  }, [refresh]);

  const handleSort = (key: NestedKeyOf<Project>, direction: SortDirection) => {
    console.log("Sorting by:", key, direction)
    // Implement sorting logic here
  }

  const handleRefresh = () =>{

    refresh();
  }

  const handleSuccess = (data: Project, message: string) => {
    toast.success(message || "Project saved successfully!")
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

  const handleApplyFilters = (newFilters: { name: string; postCode: string }) => {
    setFilter("name", newFilters.name)
    setFilter("postCode", newFilters.postCode)
    setPage(1)
  }

  const handleRemoveFilter = (key: "search" | "name" | "postCode") => {
    setFilter(key, "")
    setPage(1)
    refresh()
  }

  return (
    <>
      <div className="mx-auto">
        <ListHeader
          title="Project List"
          searchPlaceholder="Quick Search.."
          onSearch={handleSearch}
          onAdd={handleAdd}
          onFilter={openFilterModal}
          onRefresh={handleRefresh}
          addButtonText="Add Project"
          className="bg-card"
          addPermission={Permissions.CREATE_PROJECT}
        />
        <FilterBadges filters={filters} onRemoveFilter={handleRemoveFilter} />

        {isLoading ? (
          <Loader />
        ) : (
          <DataTable<Project>
            data={projects}
            columns={columns}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {projects.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalRecords={totalRecords}
            currentRecords={projects.length}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            className="mt-4"
          />
        )}
      </div>

      <Modal open={isFormOpen} onOpenChange={closeModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{currentRecord ? "Edit Project" : "Add New Project"}</ModalTitle>
          </ModalHeader>
          <ProjectForm
            onClose={closeModal}
            onSuccess={handleSuccess}
            onError={handleError}
            currentProject={currentRecord}
          />
        </ModalContent>
      </Modal>

      <Modal open={isFilterOpen} onOpenChange={closeFilterModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Filter Projects</ModalTitle>
          </ModalHeader>
          <FilterModal
            onApply={handleApplyFilters}
            onClose={closeFilterModal}
            initialFilters={{ name: filters.name, postCode: filters.postCode }}
          />
        </ModalContent>
      </Modal>
    </>
  )
}

