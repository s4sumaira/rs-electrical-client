"use server"

import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3Client, BUCKET_NAME } from "../../lib/aws-config"
import { FileWithDocType } from "@/components/file-uploader"


export async function uploadFiles(files: FileWithDocType[]) {
  const uploadPromises = files.map(async ({ file, docType }) => {
    const fileBuffer = await file.arrayBuffer()

    console.log(`Uploading file: ${file.name}, Document Type: ${docType}`)

    // const upload = new Upload({
    //   client: s3Client,
    //   params: {
    //     Bucket: process.env.AWS_S3_BUCKET_NAME!,
    //     Key: `${docType}/${file.name}`,
    //     Body: Buffer.from(fileBuffer),
    //     ContentType: file.type,
    //   },
    // })

    // try {
    //   const result = await upload.done()
    //   return { url: result.Location, docType }
    // } catch (error) {
    //   console.error("Error uploading file:", error)
    //   throw error
    // }
  })

  // try {
  //   const results = await Promise.all(uploadPromises)

  //   // Here you would typically save the URLs and document types to your database
  //   console.log("Uploaded file results:", results)

  //   return results.map((result) => result.url)
  // } catch (error) {
  //   console.error("Error uploading files:", error)
  //   throw error
  // }
}


// export async function uploadFile(formData: FormData) {
//   const file = formData.get("file") as File
//   if (!file) {
//     throw new Error("No file provided")
//   }

//   const buffer = await file.arrayBuffer()
//   const params = {
//     Bucket: BUCKET_NAME,
//     Key: file.name,
//     Body: Buffer.from(buffer),
//     ContentType: file.type,
//   }

//   try {
//     await s3Client.send(new PutObjectCommand(params))
//     return { success: true, message: "File uploaded successfully" }
//   } catch (error) {
//     console.error("Error uploading file:", error)
//     return { success: false, message: "Error uploading file" }
//   }
// }

export async function deleteFile(fileName: string) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
  }

  try {
    await s3Client.send(new DeleteObjectCommand(params))
    return { success: true, message: "File deleted successfully" }
  } catch (error) {
    console.error("Error deleting file:", error)
    return { success: false, message: "Error deleting file" }
  }
}

export async function getFileUrl(fileName: string) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
  }

  try {
    const command = new GetObjectCommand(params)
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    return url
  } catch (error) {
    console.error("Error generating signed URL:", error)
    return null
  }
}

