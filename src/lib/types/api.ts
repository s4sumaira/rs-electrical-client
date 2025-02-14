// Define the pagination type
export interface PaginationData {
  page: number
  pageSize: number
  totalRecords: number
  totalPages: number
}

// Define the fetch result type that matches our component expectations
export interface FetchResult<T> {
  records: T[] | T | [] 
  pagination: PaginationData 
}



export interface ApiResponse<T> {
     success: boolean
     data?: T | T[] | null | []
     message?: string | null
     error?: string | null
     pagination: PaginationData
  
}
