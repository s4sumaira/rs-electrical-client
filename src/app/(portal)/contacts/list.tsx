"use client"
import { DataTable } from "@/components/data-table"
import { getContacts } from "@/app/actions/contactActions"
import { useModal } from "@/hooks/useModal"
import { type Contact, ContactType } from "@/lib/types/contact"
import { ContactForm } from "./add-edit-modal"
import type { NestedKeyOf } from "@/lib/types/table"
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/modal"
import type { TableColumn, SortDirection } from "@/lib/types/table"
import toast from "react-hot-toast"
import { useFetch } from "@/hooks/useFetch"
import { Pagination } from "@/components/pagination"
import { useCallback, useState } from "react"
import { ListHeader } from "@/components/list-header"
import { Avatar } from "@/components/avatar"
import { FilterModal } from "./filter-modal"
import { FilterBadges } from "@/components/filter-badges"
import { UserPlus } from "lucide-react"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { UserForm } from "./user-modal"
import { getUser } from "@/app/actions/userActions"
import type{ User} from "@/lib/types/user"
import { useAuth } from "@/hooks/useAuth"
import { Permissions } from "@/lib/types/permissions"
import { deleteContact } from "@/app/actions/contactActions"



export const ContactList = () => {
  const {
    isOpen: isContactFormOpen,
    currentRecord: currentContact,
    openModal: openContactModal,
    closeModal: closeContactModal,
  } = useModal<Contact>()
  const {
    isOpen: isUserFormOpen,
    currentRecord: currentUser,
    openModal: openUserModal,
    closeModal: closeUserModal,
  } = useModal<User>()
  const { isOpen: isFilterOpen, openModal: openFilterModal, closeModal: closeFilterModal } = useModal()

  const [isLoadingUser, setIsLoadingUser] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false);

  const{hasPermission} = useAuth()

  const {
    records: contacts,
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
  } = useFetch<Contact, { search: string; contactType: string; email: string }>({
    fetchAction: getContacts,
    initialFilters: { search: "", contactType: "", email: "" },
    initialPageSize: 10,
  })

  const contactsList = contacts

  const columns: TableColumn<Contact>[] = [
    {
      header: "Name",
      key: "fullName",
      className: "font-medium min-w-[200px]",
      render: (value) => (
        <div className="flex items-center gap-3">
          <Avatar name={value as string} />
          <div className="flex flex-col">
            <span className="font-medium">{value as string}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      key: "email",
      className: "min-w-[180px] truncate",
      render: (value) => (
        <span className="truncate block" title={value as string}>
          {value as string}
        </span>
      ),
    },
    {
      header: "Phone",
      key: "phone",
      className: "min-w-[120px]",
    },
    {
      header: "Company",
      key: "company",
      className: "hidden xl:table-cell min-w-[140px] truncate",
    },
    {
      header: "Job Title",
      key: "jobTitle",
      className: "hidden xl:table-cell min-w-[140px] truncate",
    },
    {
      header: "Type",
      key: "contactType",
      className: "min-w-[100px]",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === ContactType.EMPLOYEE
              ? "bg-blue-100 text-purple-800"
              : value === ContactType.CONTRACTOR
                ? "bg-green-100 text-green-800"
                : "bg-purple-100 text-blue-800"
          }`}
        >
          {value as ContactType}
        </span>
      ),
    },
    {
      header: "User",
      key: "userId",
      className: "min-w-[80px]",
      hidden:!hasPermission(Permissions.CREATE_USER),
      render: (value, record) => (
        <Button variant="ghost" size="icon" onClick={() => handleUserClick(record)}>
          <UserPlus className="h-4 w-4" />
        </Button>)
      ,
    },
  ]

  const visibleColumns = columns.filter((column) => !column.hidden);

  const handleEdit = (contact: Contact) => {
    
    openContactModal(contact)
  }

  const handleAdd = () => {
    openContactModal()
  }

  const handleDelete = useCallback(async (contact: Contact) => {
    setIsDeleting(true);
    try {
      const result = await deleteContact(contact._id);
      if (result.success) {
        toast.success(result.message || "Contact deleted successfully!");
        refresh();
      } else {
        toast.error(result.error || "Failed to delete contact.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  }, [refresh]);

  const handleSort = (key: NestedKeyOf<Contact>, direction: SortDirection) => {
    console.log("Sorting by:", key, direction)
  }

  const handleRefresh = () => {
    refresh()
  }

  const handleSuccess = (data: Contact, message: string) => {
    toast.success(message || "Contact saved successfully!")
    refresh()
    closeContactModal()
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

  const handleApplyFilters = (newFilters: { contactType: string; email: string }) => {
    setFilter("contactType", newFilters.contactType)
    setFilter("email", newFilters.email)
    setPage(1)
  }

  const handleRemoveFilter = (key: "search" | "contactType" | "email") => {
    setFilter(key, "")
    setPage(1)
    refresh()
  }

  const handleUserClick = async (contact: Contact) => {
    setIsLoadingUser(true)
    try {
      
      const user = (await getUser(contact._id)) as User  

      if (user) {       
        openUserModal(user)
      } else {
        // Create a partial user object with required initial properties
        // and use contact's name for the username
        openUserModal({
          _id: "",
          name: `${contact.firstName} ${contact.lastName}`, 
          email: contact.email || "", 
          role: "",
          contact: contact._id,
        } )
      }
    } catch (error) {
      toast.error("Failed to fetch user information")
    } finally {
      setIsLoadingUser(false)
    }
  }

  const handleUserSuccess = (data: any, message: string) => {
    toast.success(message || "User saved successfully!")
    refresh()
    closeUserModal()
  }

  return (
    <>
      <div className="mx-auto">
        <ListHeader
          title="Contact List"
          searchPlaceholder="Quick Search.."
          onSearch={handleSearch}
          onAdd={handleAdd}
          onFilter={openFilterModal}
          onRefresh={handleRefresh}
          addButtonText="Add Contact"
          className="bg-card"
          addPermission={Permissions.CREATE_PROJECT}
        />
        <FilterBadges filters={filters} onRemoveFilter={handleRemoveFilter} />

        {isLoading ? (
          <Loader />
        ) : (
          <DataTable<Contact>
            data={contactsList}
            columns={visibleColumns}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {contactsList.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalRecords={totalRecords}
            currentRecords={contactsList.length}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            className="mt-4"
          />
        )}
      </div>

      <Modal open={isContactFormOpen} onOpenChange={closeContactModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{currentContact ? "Edit Contact" : "Add New Contact"}</ModalTitle>
          </ModalHeader>
          <ContactForm
            onClose={closeContactModal}
            onSuccess={handleSuccess}
            onError={handleError}
            currentContact={currentContact}
          />
        </ModalContent>
      </Modal>

      <Modal open={isUserFormOpen} onOpenChange={closeUserModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{currentUser?._id ? "Edit User" : "Add New User"}</ModalTitle>
          </ModalHeader>
          <UserForm
            onClose={closeUserModal}
            onSuccess={handleUserSuccess}
            onError={handleError}
            currentUser={currentUser}
          />
        </ModalContent>
      </Modal>

      <Modal open={isFilterOpen} onOpenChange={closeFilterModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Filter Contacts</ModalTitle>
          </ModalHeader>
          <FilterModal
            onApply={handleApplyFilters}
            onClose={closeFilterModal}
            initialFilters={{ contactType: filters.contactType, email: filters.email }}
          />
        </ModalContent>
      </Modal>
    </>
  )
}

