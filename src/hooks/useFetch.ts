"use client"

import { useState, useEffect, useCallback, useTransition } from "react"
// import { useActionState } from "react"
import { useFormState } from "react-dom"
import { type ActionState, InitialState } from "@/lib/types/form"
import type { FetchResult } from "@/lib/types/api"

interface UseRecordsOptions<T, F> {
  fetchAction: (filters: F, page: number, pageSize: number) => Promise<ActionState<FetchResult<T>>>
  initialFilters: F
  initialPageSize?: number
}

export function useFetch<T, F extends Record<string, unknown>>({
  fetchAction,
  initialFilters,
  initialPageSize = 10,
}: UseRecordsOptions<T, F>) {
  const [filters, setFilters] = useState<F>(initialFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isPending, startTransition] = useTransition()
  //const fetchRecords = useCallback((state: ActionState<FetchResult<T>>) => {
  const fetchRecords = useCallback(() => {
      return fetchAction(filters, page, pageSize)
    },
    [fetchAction, filters, page, pageSize],
  )

  const [state, dispatch] = useFormState(fetchRecords, InitialState<FetchResult<T>>())

  const action = useCallback(() => {
    startTransition(() => {
      dispatch()
    })
  }, [dispatch])

  useEffect(() => {
    action()
  }, [action, filters, page, pageSize])

  useEffect(() => {
    if (state.success && state.data) {
      setTotalRecords(state.data.pagination.totalRecords)
      setTotalPages(state.data.pagination.totalPages)
    }
  }, [state])

  const setFilter = useCallback((key: keyof F, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1) // Reset to first page when filters change
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
    setPage(1)
  }, [initialFilters])

  return {
    records: Array.isArray(state.data?.records) ? state.data?.records : [] ,
    isLoading: isPending,
    error: state.error,
    filters,
    setFilter,
    resetFilters,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    refresh: action,
  }
}

