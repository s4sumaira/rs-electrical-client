"use server"

import { list } from "@vercel/blob"

export async function getSecureUrl(fileId: string, fileName: string) {
  try {
    // In a real application, you would:
    // 1. Check if the user is authenticated
    // 2. Verify if the user has permission to access this file
    // 3. Retrieve the actual file name from your database using the fileId

    const fullFileName = `${fileId}-${fileName}`
    const { blobs } = await list({ prefix: fullFileName, limit: 1 })

    if (blobs.length === 0) {
      return { error: "File not found." }
    }

    const blob = blobs[0]

    // Generate a signed URL that expires in 60 seconds
    const signedUrl = new URL(blob.url)
    signedUrl.searchParams.set("token", blob.downloadUrl.split("?token=")[1])
    signedUrl.searchParams.set("expires", (Date.now() + 60000).toString())

    return { url: signedUrl.toString() }
  } catch (error) {
    console.error("Error getting secure URL:", error)
    return { error: "Failed to get secure URL." }
  }
}

