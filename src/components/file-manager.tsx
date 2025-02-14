"use client"

import { useState, useRef } from "react"
import { uploadFile ,deleteFile, getFileUrl} from "@/app/actions/uploadActions"

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export  function FileManager() {
  const [files, setFiles] = useState<string[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    const file = formData.get("file") as File

    if (!file) {
      setError("No file selected")
      return
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Invalid file type. Allowed types: JPEG, PNG, PDF")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 5MB limit")
      return
    }

    const result = await uploadFile(formData)
    if (result.success) {
      setFiles([...files, file.name])
      if (fileInputRef.current) fileInputRef.current.value = ""
    } else {
      setError(result.message)
    }
  }

  const handleFileDelete = async (fileName: string) => {
    const result = await deleteFile(fileName)
    if (result.success) {
      setFiles(files.filter((file) => file !== fileName))
      if (preview === fileName) setPreview(null)
    } else {
      setError(result.message)
    }
  }

  const handleFilePreview = async (fileName: string) => {
    const url = await getFileUrl(fileName)
    if (url) {
      setPreview(url)
    } else {
      setError("Error generating preview URL")
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">S3 File Manager</h1>

      <form onSubmit={handleFileUpload} className="mb-4">
        <input type="file" name="file" ref={fileInputRef} accept={ALLOWED_FILE_TYPES.join(",")} className="mb-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Uploaded Files</h2>
          <ul>
            {files.map((file) => (
              <li key={file} className="flex items-center justify-between mb-2">
                <span>{file}</span>
                <div>
                  <button
                    onClick={() => handleFilePreview(file)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Preview
                  </button>
                  <button onClick={() => handleFileDelete(file)} className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">File Preview</h2>
          {preview && (
            <div className="border p-2">
              {preview.endsWith(".pdf") ? (
                <iframe src={preview} width="100%" height="500px" />
              ) : (
                <img src={preview || "/placeholder.svg"} alt="File preview" className="max-w-full h-auto" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

