"use server"

import { Upload } from "@aws-sdk/lib-storage";
import { DeleteObjectsCommand, GetObjectCommand ,ListObjectsV2Command} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME } from "../../lib/aws-config";
import { ContactDocument,Contact } from "@/lib/types/contact";
import { apiCall } from "@/lib/helpers/apiHelper";
import { getLoggedInUserContact } from "./contactActions";
import type { ActionState } from "@/lib/types/form";

export async function DelBeforeSave(contactId:string){

  const folderPrefix = `profile-images/${contactId}/`;
  const listCommand = new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Prefix: folderPrefix,
  });

  const listedObjects = await s3Client.send(listCommand);

  if (listedObjects.Contents && listedObjects.Contents.length > 0) {
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Delete: {
        Objects: listedObjects.Contents.map((item) => ({ Key: item.Key! })),
      },
    };

    // 🗑️ Step 2: Delete all files in the folder
    await s3Client.send(new DeleteObjectsCommand(deleteParams));

}
}


export async function uploadProfileImg(formData: FormData): Promise<ActionState<string>>{

  const file = formData.get("file") as File;
 

  

  if (!file) return { success: false, message : " File not found",error: "No file provided"  };

  const contact = await getLoggedInUserContact() ;

  if (!contact) {
    return {
      success: false,
      message: "Contact not found.",
      error: "Contact not found.",
    }}
    else{
     
      try{

     const res =  await  DelBeforeSave(contact?.data?._id as any);
        const fileName = file.name;       
        const contactId = contact?.data?._id;
        const fileKey = `profile-images/${contactId}/${fileName.replace(/\s+/g, '_')}`;      
        const fileBuffer = Buffer.from(await file.arrayBuffer());   
       
      
        const upload = new Upload({
          client: s3Client,
          params: {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: fileKey,
            Body: fileBuffer,
            ContentType: file.type,
          },
        });   
        
        const result = await upload.done();

       

        if(!result.Location){
          return {
            success: false,
            message: "Profile upload failed" as string,
            error: "Unknown error occurred.",
          };
        }      
       

        try {
          const response = await apiCall<Contact>(`/contacts/upload/${contactId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profileImage: fileKey}),
          });
      
          if (!response.success) {
            return {
              success: false,
              message: response.error as string,
              error: response.error || "Unknown error occurred.",
            };
          }

     
      const img = await generatePresignedUrl(fileKey);
          return {
            success: true,
            message: "Profile image uploaded and saved successfully.",
            data: img,
             
          }
          ;
        } catch (error) {
          console.error("Error saving file:", error);
          throw error;
        }
        
      }
      catch (error) {
        console.error("Error uploading profile image:", error);
        throw error;
      }
    }

    


}

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

export async function deleteFile() {

  const contact = await getLoggedInUserContact() ;

  if (!contact) {
    return {
      success: false,
      message: "Contact not found.",
      error: "Contact not found.",
    };
   
  }

  const contactId = contact?.data?._id;  
 await  DelBeforeSave(contactId as any);

 try {
  const response = await apiCall<Contact>(`/contacts/upload/${contactId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileImage: ""}),
  });

  if (!response.success) {
    return {
      success: false,
      message: response.error as string,
      error: response.error || "Unknown error occurred.",
    };
  }

const profileImage = "";

  return {
    success: true,
    message: "Profile image uploaded and saved successfully.",
    data: profileImage,
     
  }
  ;
} catch (error) {
  console.error("Error saving file:", error);
  throw error;
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


export async function generatePresignedUrl(fileKey: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 }); 
}