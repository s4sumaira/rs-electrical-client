"use client"
import { DataTable } from "@/components/data-table"
import { getAttendance } from "@/app/actions/attendanceActions"
import { useModal } from "@/hooks/useModal"
import type { TimeSheet } from "@/lib/types/timesheet" 
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/modal"
import type { TableColumn } from "@/lib/types/table"
import { useFetch } from "@/hooks/useFetch"
import { Pagination } from "@/components/pagination"
import { useCallback } from "react"
import { ListHeader } from "@/components/list-header"
import { FilterModal } from "../timesheet/filter-modal" 
import { FilterBadges } from "@/components/filter-badges"
import { Loader } from "@/components/loader"
import { Permissions } from "@/lib/types/permissions"
import { Avatar } from "@/components/avatar"
import {jsPDF} from "jspdf";
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx";

export const AttendanceList = () => {
  const { isOpen: isFilterOpen, openModal: openFilterModal, closeModal: closeFilterModal } = useModal()

  const {
    records: timesheet,
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
  } = useFetch<TimeSheet, { search: string; name: string; startDate: string; endDate: string }>({
    fetchAction: getAttendance,
    initialFilters: { search: "", name: "", startDate: "", endDate: "" },
    initialPageSize: 10,
  })

  const attendanceList = timesheet


  
  const columns: TableColumn<TimeSheet>[] = [
    {
      header: "Name",
      key: "name",
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
      className: "hidden xl:table-cell min-w-[180px] truncate",
    },
    {
      header: "Check In",
      key: "checkIn",
      className: "min-w-[120px]",
      
    },
    {
      header: "Check Out",
      key: "checkOut",
      className: "min-w-[120px]",
    },
    {
      header: "Total Hours",
      key: "totalHours",
      className: "min-w-[120px]",
    },
    {
      header: "On Site",
      key: "isOnSite",
      className: "min-w-[120px]  text-center",
      render: (value) => (
        <div className="items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value as boolean}
              disabled
              className="sr-only" 
            />
            <span className="h-5 w-5 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center transition-all duration-300 ease-in-out">
              <span
                className={`h-3 w-3 rounded-full bg-green-500 transition-all duration-300 ease-in-out transform ${
                  value ? "scale-100" : "scale-0"
                }`}
              />
            </span>
          </label>
        </div>
      ),
    }
    
     
  ];

  const visibleColumns = columns.filter((column) => !column.hidden)

  const handleRefresh = () => {
    refresh()
  }



// const handleExportPDF = () => {
//   const doc = new jsPDF();
 
//   doc.setFontSize(18);
//   doc.text("Attendance List", 14, 20);

 
//   const currentDate = new Date().toISOString().split("T")[0]; 
 
//   const headers = columns
//    // .filter((column) => column.key !== "isOnSite") 
//     .map((column) => column.header);
 
//   const rows = attendanceList.map((item) =>
//     columns
//       //.filter((column) => column.key !== "isOnSite")
//       .map((column) =>
//         column.key === "isOnSite" ? (item[column.key] ? "Yes" : "No") : item[column.key]
//       )
//   );
 
//   (doc as any).autoTable({
//     head: [headers],
//     body: rows,
//     theme: "grid",
//     headStyles: { fontSize: 10, fontStyle: "bold" },
//     bodyStyles: { fontSize: 9 },
//     startY: 30,
//   });

//   // Save the PDF file
//   doc.save(`attendance_list_${currentDate}.pdf`);
// };

const handleExportPDF = () => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text("Attendance List", 14, 20);

  const currentDate = new Date().toISOString().split("T")[0]; 
  
  const headers = columns
    .map((column) => column.header);

    const rows: (string | number)[][] = attendanceList.map((item) => {
      return columns.map((column) => {
        const value = item[column.key as keyof TimeSheet]; // Access the value using keyof TimeSheet
  
        if (column.key === "isOnSite") {
          return value ? "Yes" : "No"; // Handle boolean value for isOnSite
        }
  
        // Ensure that the value returned is either a string or number
        return typeof value === 'string' || typeof value === 'number' ? value : '';
      });
    });
  
  
  // Use autoTable after importing the plugin
  autoTable(doc, {
    head: [headers],
    body: rows,
    theme: "grid",
    headStyles: { fontSize: 10, fontStyle: "bold" },
    bodyStyles: { fontSize: 9 },
    startY: 30,
  });

  // Save the PDF file
  doc.save(`attendance_list_${currentDate}.pdf`);
};

const handleExportExcel = () => {
  const currentDate = new Date().toISOString().split("T")[0]; 

  const ws = XLSX.utils.aoa_to_sheet([
    columns.map((column) => column.header),
    ...attendanceList.map((item) =>
      columns.map((column) =>
        column.key === "isOnSite" ? (item[column.key] ? "Yes" : "No") : item[column.key]
      )
    ),
  ]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Attendance");

 
  XLSX.writeFile(wb, `attendance_list_${currentDate}.xls`);
};

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

  const handleApplyFilters = (newFilters: { name: string; startDate: string; endDate: string }) => {
    setFilter("name", newFilters.name)
    setFilter("startDate", newFilters.startDate)
    setFilter("endDate", newFilters.endDate)
    setPage(1)
  }

  const handleRemoveFilter = (key: "search" | "name" | "startDate" | "endDate") => {
    setFilter(key, "")
    setPage(1)
    refresh()
  }

  return (
    <>
      <div className="mx-auto">
        <ListHeader
          title="Attendance List"
          searchPlaceholder="Quick Search.."
          onSearch={handleSearch}        
          onFilter={openFilterModal}
          onRefresh={handleRefresh}  
          onExport={() => {}}
          onExportPDF={handleExportPDF} 
          onExportExcel={handleExportExcel}
          addPermission={Permissions.GET_ALL_USER}    
          className="bg-card"
        />
        <FilterBadges filters={filters} onRemoveFilter={handleRemoveFilter} />

        {isLoading ? (
          <Loader />
        ) : (
          <DataTable<TimeSheet>
            data={attendanceList}
            columns={visibleColumns}
          />
        )}

        {attendanceList.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalRecords={totalRecords}
            currentRecords={attendanceList.length}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            className="mt-4"
          />
        )}
      </div>

      <Modal open={isFilterOpen} onOpenChange={closeFilterModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Filter Timesheet</ModalTitle>
          </ModalHeader>
          <FilterModal
            onApply={handleApplyFilters}
            onClose={closeFilterModal}
            initialFilters={{ name: filters.name, startDate: filters.startDate, endDate: filters.endDate }}
          />
        </ModalContent>
      </Modal>
    </>
  )
}
