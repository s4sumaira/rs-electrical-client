"use server"

import { Upload } from "@aws-sdk/lib-storage";
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME } from "../../lib/aws-config";
import { FileWithDocType } from "@/components/file-uploader";
import { ContactDocument,DocTypes } from "@/lib/types/contact";
import { apiCall } from "@/lib/helpers/apiHelper";
import { getLoggedInUserContact } from "./contactActions";
import type { ActionState } from "@/lib/types/form";
import { ApiResponse } from "@/lib/types/api";

export async function uploadFiles(encodedFiles: { fileName: string, fileType: string, fileSize: number, docType: string, fileData: string }[]) {

     const contact = await getLoggedInUserContact() ;

  if (!contact) {
    return {
      success: false,
      message: "Contact not found.",
      error: "Contact not found.",
    };
   
  }

  const contactId = contact?.data?._id;

  const uploadedFiles: ContactDocument[] = [];

  const uploadPromises = encodedFiles.map(async ({ fileName, fileType, fileData, docType }) => {
   
    const base64Data = fileData.split(",")[1];

    const fileBuffer = Buffer.from(base64Data, "base64");
    const fileKey = `documents/${contactId}/${fileName.replace(/\s+/g, '_')}`;

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: fileType,
      },
    });

    try {
      const result = await upload.done();
      uploadedFiles.push({
        fileName,
        fileKey:fileKey,
        fileType,
        fileSize: fileBuffer.length.toString(),
        url: result.Location,
        docType,
        contact: contactId,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  });

  await Promise.all(uploadPromises);

  // console.log(JSON.stringify(uploadedFiles));
  
   try {
    const response = await apiCall<ContactDocument>("/contactDocs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(uploadedFiles),
    });

    if (!response.success) {
      return {
        success: false,
        message: response.error as string,
        error: response.error || "Unknown error occurred.",
      };
    }

    return {
      success: true,
      message: "Documents saved successfully.",
      data: response.data as ContactDocument,
    };
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
}

export async function deleteFile(fileName: string) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
    return { success: true, message: "File deleted successfully" };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, message: "Error deleting file" };
  }
}

export async function getContactDocuments(): Promise<ActionState<ContactDocument[]>>  {
  try {

    const contact = await getLoggedInUserContact() ;

  if (!contact) {
    return {
      success: false,
      message: "Contact not found.",
      error: "Contact not found.",
    };
   
  }

  const contactId = contact?.data?._id;

  const response = await apiCall<ContactDocument>(`/contactDocs/contact/${contactId}`);

 
  if (response.success && Array.isArray(response.data)) {
    
    const documentsWithPresignedUrls = await Promise.all(
      response.data.map(async (doc) => ({
        ...doc,
        presignedUrl: await generatePresignedUrl(doc.fileKey), 
      }))
    );

    return { success: true, message: "Documents fetched successfully.", data: documentsWithPresignedUrls };
  }
   else {
      return {
        success: false,
        message: "Failed to fetch contact documents. Please try again.",
        error: response.error || "Unknown error occurred.",
      
      };   

    
  }
 } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while fetching the contact documents.",
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}


async function generatePresignedUrl(fileKey: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 }); 
}