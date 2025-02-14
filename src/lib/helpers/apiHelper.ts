"use server"
import { getServerSession } from "next-auth/next"
import { options as NextAuthOptions } from "@/app/api/auth/[...nextauth]/options"
import type { ApiResponse } from "../types/api"

const API_URL = process.env.API_URL

// Generic API call utility function
export const apiCall = async <T>(endpoint: string, options: RequestInit = {}) : Promise<ApiResponse<T>>=>
{
  const url = `${API_URL}${endpoint}`
  const session = await getServerSession(NextAuthOptions)
  const headers = new Headers(options.headers)

  headers.set("Content-Type", "application/json")
  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`)
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    const responseBody: ApiResponse<T> = await response.json()

    if (response.ok) {

      return responseBody;
    }

    // If the response is not ok, but we got a structured error from the API
    if (responseBody.error) {
      return responseBody;
    }

    // If we didn't get a structured error, create one
    return {
      success: false, 
      message: `API call failed: ${response.statusText}`,
      error: `${response.status}`,
      pagination:{
        page: 1,
        pageSize: 0,
        totalRecords: 0,
        totalPages: 0,
      }
    
    };
  } catch (error) {
    console.error(`API call to ${url} failed:`, error)
    return {
      success: false,
      message: 'Unexpected error occurred while making API call.',
      error: error instanceof Error ? error.message : 'Unknown error',
      pagination:{
        page: 1,
        pageSize: 0,
        totalRecords: 0,
        totalPages: 0,
      }
    };
  }
}

