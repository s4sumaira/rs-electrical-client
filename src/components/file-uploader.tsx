"use client"

import { useState, useRef, useCallback } from "react"
import { FilePreview } from "@/components/file-preview"
import { uploadFiles } from "@/app/actions/uploadActions" 
import { Camera, Upload } from "lucide-react"
import type React from "react"
import { DocTypes } from "@/lib/types/contact"
import { Card, CardContent } from "./ui/card";



const ALLOWED_FILE_TYPES = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]
const MAX_FILES = 5
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface FileWithDocType {
  file: File
  docType: DocTypes | string
}

export function FileUploader() {
  const [files, setFiles] = useState<FileWithDocType[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedDocType, setSelectedDocType] = useState<DocTypes | "">("")
  const [otherDocType, setOtherDocType] = useState<string>("OTHER")
  const [isUploading, setIsUploading] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const processFiles = useCallback(
    (selectedFiles: File[]) => {
      if (files.length + selectedFiles.length > MAX_FILES) {
        setError(`You can only upload a maximum of ${MAX_FILES} files.`);
        return;
      }

      const validFiles = selectedFiles.filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          setError(`${file.name} is too large. Maximum file size is 5 MB.`);
          return false;
        }

        const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
        if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
          setError(`${file.name} is not an allowed file type.`);
          return false;
        }
        return true;
      });

      const newFiles = validFiles.map((file) => ({
        file,
        docType: selectedDocType,
      }));

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setError(null);
      setSelectedDocType("") 

     
    },
    [files, selectedDocType]
    
  );
  console.log('Processed files ....' , files);
  const closeCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setIsCameraOpen(false)
  }, [])

  const capturePhoto = useCallback(async () => {
    console.log("Capturing photo...")
    await delay(500) // Wait for 500ms to ensure the video is ready
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")
      if (context) {
        console.log("Drawing image on canvas...")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log("Blob created, creating File...")
              const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
              console.log("Processing captured file...")
              processFiles([file])
              closeCamera() // Close the camera after capturing the photo
            } else {
              console.error("Failed to create blob from canvas")
            }
          },
          "image/jpeg",
          0.8,
        )
      } else {
        console.error("Failed to get canvas context")
      }
    } else {
      console.error("Video or canvas ref is null")
    }
  }, [processFiles, closeCamera])

  const openCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
        }
      }
      setIsCameraOpen(true)
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Unable to access camera. Please make sure you've granted permission.")
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    processFiles(selectedFiles)
  }

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const encodeFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); 
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  

 
  const isDocTypeSelected = selectedDocType !== ""

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <select
          id="docType"
          value={selectedDocType}
          onChange={(e) => setSelectedDocType(e.target.value as DocTypes)}
          className="block w-1/3 pl-3 pr-10 py-2 text-sm border-input bg-background text-foreground rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
        >
          <option value="" disabled>
            Select document type
          </option>
          {Object.values(DocTypes).map((type) => (
            <option key={type} value={type}>
              {type.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center px-4 py-2 bg-btn-add text-btn-add-fg rounded-md hover:bg-btn-add-hover focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
          disabled={!isDocTypeSelected}
        >
          <Upload className="w-5 h-5 mr-2" />
          Select Files
        </button>
        <button
          type="button"
          onClick={openCamera}
          className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
          aria-label="Take a photo"
          disabled={!isDocTypeSelected}
        >
          <Camera className="w-5 h-5 mr-2" />
          Take Photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          multiple
          accept={ALLOWED_FILE_TYPES.join(",")}
        />
      </div>

      {selectedDocType === DocTypes.OTHER && (
        <div>
          <label htmlFor="otherDocType" className="block text-sm font-medium text-foreground">
            Specify Document Type
          </label>
          <input
            type="text"
            id="otherDocType"
            value={otherDocType}
            onChange={(e) => setOtherDocType(e.target.value)}
            placeholder="Enter document type"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-input bg-background text-foreground rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
          />
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Allowed file types: {ALLOWED_FILE_TYPES.join(", ")} | Max file size: 5 MB | Max files: {MAX_FILES}
      </p>

      {isCameraOpen && (
        <div className="space-y-4">
          <video ref={videoRef} className="w-full h-auto rounded-lg" />
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={capturePhoto}
              className="px-4 py-2 bg-btn-add text-btn-add-fg rounded-md hover:bg-btn-add-hover focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Capture Photo
            </button>
            <button
              type="button"
              onClick={closeCamera}
              className="px-4 py-2 bg-btn-cancel text-btn-cancel-fg rounded-md hover:bg-btn-cancel-hover focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Close Camera
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {error && <p className="text-destructive">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {files.map(({ file, docType }, index) => (
          <div key={index} className="space-y-2">
            <FilePreview file={file} onRemove={() => removeFile(index)} />
            <p className="text-sm text-muted-foreground">Document Type: {docType}</p>
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 bg-background py-4">
      <button
      
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        disabled={files.length === 0 || isUploading}
        onClick={async () => {         
          setIsUploading(true);  
          
          const encodedFiles = await Promise.all(
            files.map(async ({ file, docType }) => ({
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
              docType,
              fileData: await encodeFileToBase64(file), // Convert file to Base64
            }))
          );
          await uploadFiles(encodedFiles);
          setIsUploading(false);
          setFiles([]);
        }}
      >
        {isUploading ? "Uploading..." : "Upload Files"}
      </button>
      </div>
      </CardContent>
      </Card>
  )
}

