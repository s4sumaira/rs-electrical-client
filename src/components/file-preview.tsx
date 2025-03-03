"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

type FilePreviewProps = {
  file: File | Blob
  onRemove: () => void
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [file])

  return (
    <div className="relative bg-gray-100 p-4 rounded-lg shadow">
      <div className="flex items-center space-x-4">
        {preview ? (
          <Image
            src={preview || "/placeholder.svg"}
            alt={file instanceof File ? file.name : "Captured image"}
            width={64}
            height={64}
            className="rounded object-cover"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded">
            <span className="text-gray-500 text-xl font-bold">
              {file instanceof File ? file.name.split(".").pop()?.toUpperCase() : "IMG"}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file instanceof File ? file.name : "Captured image"}
          </p>
          <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        <button
          onClick={onRemove}
          className="flex-shrink-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";

// type FilePreviewProps = {
//   file?: File | Blob; // Local file
//   remoteUrl?: string; // Presigned URL
//   fileName: string;
//   fileType: string;
//   onRemove?: () => void;
// };

// export function FilePreview({ file, remoteUrl, fileName, fileType, onRemove }: FilePreviewProps) {
//   const [preview, setPreview] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const generatePreview = async () => {
//       if (fileType.startsWith("image/")) {
//         if (file) {
//           // Local file
//           const reader = new FileReader();
//           reader.onloadend = () => setPreview(reader.result as string);
//           reader.readAsDataURL(file);
//         } else if (remoteUrl) {
//           // Remote file
//           try {
//             const response = await fetch(remoteUrl);
//             if (!response.ok) throw new Error("Failed to fetch image");
//             const blob = await response.blob();
//             const reader = new FileReader();
//             reader.onloadend = () => setPreview(reader.result as string);
//             reader.readAsDataURL(blob);
//           } catch (err) {
//             setError("Failed to load image preview");
//             setPreview(null);
//           }
//         }
//       }
//     };
//     generatePreview();
//   }, [file, remoteUrl, fileType]);

//   return (
//     <div className="relative bg-gray-100 p-4 rounded-lg shadow">
//       <div className="flex items-center space-x-4">
//         {preview ? (
//           <Image
//             src={preview}
//             alt={fileName}
//             width={64}
//             height={64}
//             className="rounded object-cover"
//             onError={() => setError("Image failed to load")}
//           />
//         ) : (
//           <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded">
//             <span className="text-gray-500 text-xl font-bold">
//               {fileType.split("/").pop()?.toUpperCase() || "FILE"}
//             </span>
//           </div>
//         )}
//         <div className="flex-1 min-w-0">
//           <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
//           {file && <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>}
//           {error && <p className="text-sm text-red-500">{error}</p>}
//         </div>
//         {onRemove && (
//           <button
//             onClick={onRemove}
//             className="flex-shrink-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//             type="button"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }