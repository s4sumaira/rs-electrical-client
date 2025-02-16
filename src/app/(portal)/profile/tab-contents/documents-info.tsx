import { TabContentProps } from "@/lib/types/profile";
import { FileUploader } from "@/components/file-uploader";
import { Contact, ContactDocument } from "@/lib/types/contact";
import { useEffect, useState } from "react";
import { getContactDocuments } from "@/app/actions/uploadActions";

interface DocumentsInfoProps extends TabContentProps {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, type: "profile" | "document") => Promise<void>;
  documentName: string | null;
  setFormState: React.Dispatch<React.SetStateAction<Contact>>;
}

export const DocumentsInfo: React.FC<DocumentsInfoProps> = ({
  formState,
  handleFileUpload,
  documentName,
  setFormState,
}) => {
  const [documents, setDocuments] = useState<ContactDocument[]>([]);
  const [error, setError] = useState<string | null>("");
  const [selectedDocument, setSelectedDocument] = useState<ContactDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchDocuments() {
      const result = await getContactDocuments();
      if (result.success) {
        setDocuments(result.data as any);
      } else {
        setError(result.message);
      }
    }
    fetchDocuments();
  }, []);

  const handlePreview = (doc: ContactDocument) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  return (
    <div className="p-4">
      {error ? (
        <div className="text-red-600 font-medium">{error}</div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-4">Uploaded Documents</h2>
          {documents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-500">
                <thead className="bg-gray-50 text-sm dark:bg-gray-800 transition-colors">
                  <tr className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400">
                    <th className="border px-4 py-2">#</th>
                    <th className="border px-4 py-2">File Name</th>
                    <th className="border px-4 py-2">File Type</th>
                    <th className="border px-4 py-2">File Size</th>
                    <th className="border px-4 py-2">Document Type</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, index) => (
                    <tr key={doc._id} className="border-t text-sm border-gray-200 dark:border-gray-600 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{doc.fileName}</td>
                      <td className="border px-4 py-2">{doc.fileType}</td>
                      <td className="border px-4 py-2">{(parseInt(doc.fileSize) / 1024).toFixed(2)} KB</td>
                      <td className="border px-4 py-2">{doc.docType}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handlePreview(doc)}
                          className="text-blue-600 hover:underline"
                        >
                          Preview
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No documents uploaded yet.</p>
          )}
        </div>
      )}

      <div className="mt-6">
        <FileUploader />
      </div>

      {/* Preview Modal */}
      {isModalOpen && selectedDocument && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full h-[80vh] flex flex-col">
      
      {/* Modal Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{selectedDocument.fileName}</h3>
        <button onClick={closeModal} className="text-gray-600 hover:text-gray-900 text-2xl">✖</button>
      </div>

      {/* Modal Body */}
      <div className="flex-1 border p-4 overflow-auto flex justify-center items-center">
        {selectedDocument.fileType.startsWith("image/") ? (
          <img src={selectedDocument.presignedUrl} alt={selectedDocument.fileName} className="max-w-full max-h-[70vh] mx-auto" />
        ) : selectedDocument.fileType === "application/pdf" ? (
          <iframe
            src={selectedDocument.presignedUrl}
            className="w-full h-full"
            title={selectedDocument.fileName}
          />
        ) : (
          <p className="text-gray-500">Preview not available for this file type.</p>
        )}
      </div>
      
    </div>
  </div>
)}

    </div>
  );
};
