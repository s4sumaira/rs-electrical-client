"use client"

import { DataTable } from "@/components/data-table"
import { useModal } from "@/hooks/useModal"
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/modal"
import type { TableColumn, SortDirection } from "@/lib/types/table"
import toast from "react-hot-toast"
import { useFetch } from "@/hooks/useFetch"
import { Pagination } from "@/components/pagination"
import { useCallback, useState } from "react"
import { ListHeader } from "@/components/list-header"
import { FilterBadges } from "@/components/filter-badges"
import { Loader } from "@/components/loader"
import { Permissions } from "@/lib/types/permissions"
import { DocumentStatus } from "@/lib/helpers/enum"
// import { AccidentReportForm } from "./accident-incident-form"
// import { AccidentReportFilterModal } from "./accident-incident-filter-modal"
import type { NestedKeyOf } from "@/lib/types/table"

// Mock function to simulate fetching data (would be replaced with actual server action)
const getAccidentReports = async (
  filters: any,
  page: number,
  pageSize: number
) => {
  // This would be an actual API call in production
  return {
    success: true, 
    data: [
      {
        _id: "1",
        fullName: "John Smith",
        reportType: "Accident",
        date: "2025-02-15",
        project: { _id: "1", name: "Project A" },
        injuryDetails: "Cut on right hand",
        documentStatus: DocumentStatus.SUBMITTED,
        reporterName: "Jane Doe"
      },
      {
        _id: "2",
        fullName: "Sarah Johnson",
        reportType: "Near Miss",
        date: "2025-02-10",
        project: { _id: "2", name: "Project B" },
        injuryDetails: "N/A",
        documentStatus: DocumentStatus.APPROVED,
        reporterName: "Mike Wilson"
      }
    ],
    pagination: {
      totalRecords: 2,
      totalPages: 1,
      currentPage: page,
      pageSize: pageSize
    }
  };
};

