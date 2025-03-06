import type React from "react"
import type { SiteInduction } from "@/lib/types/induction"
import { ContactDocument } from "@/lib/types/contact";
import { useEffect, useState } from "react";
import { getContactDocuments, getInductionDocuments } from "@/app/actions/uploadActions";
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent } from "@/components/ui/card";
import { DocumentStatus } from "@/lib/helpers/enum";

interface SectionProps {
  formState: SiteInduction
  errors: Partial<Record<keyof SiteInduction, string[]>>
  getInputProps: (name: keyof SiteInduction) => any
  getSelectProps: (name: keyof SiteInduction) => any
  setFormState: React.Dispatch<React.SetStateAction<SiteInduction>>
}

export function DocumentsSection({ formState, errors, setFormState }: SectionProps) {
  const [documents, setDocuments] = useState<ContactDocument[]>([]);
  const [error, setError] = useState<string | null>("");
  const [savedDocument, setSavedDocument] = useState<ContactDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const hasApprovePermission = user?.permissions?.includes('INDUCTION.APPROVE');
  const shouldHideCheckboxes = formState.inductionStatus === DocumentStatus.REVIEWED || hasApprovePermission;

  // Fetch documents on initial load and when formState.documents changes
  useEffect(() => {
    async function fetchDocuments() {
      try {
        let fetchedDocs: ContactDocument[] = [];
        const savedDocs = formState.documents || [];
        const savedIdsSet = new Set(savedDocs.map(doc => doc._id).filter(Boolean) as string[]);
        
        // Initialize selectedDocuments with saved document IDs
        setSelectedDocuments(new Set(savedIdsSet));

        if (formState._id) {
          // For existing inductions, fetch specific documents
          const contactId = formState.inductedPerson._id;
          const res = await getInductionDocuments(contactId);

          if (res.success) {
            fetchedDocs = (res.data as any[]).map(doc => ({
              _id: doc._id,
              url: doc.url,
              contact: doc.contact,
              fileName: doc.fileName,
              fileType: doc.fileType,
              fileSize: doc.fileSize,
              docType: doc.docType,
              fileKey: doc.fileKey,
              description: doc.description,
              presignedUrl: doc.presignedUrl
            }));

            if (hasApprovePermission) {
              // For approvers, only show selected documents
              fetchedDocs = fetchedDocs.filter(doc => doc._id && savedIdsSet.has(doc._id));
            }
          }
        } else {
          // For new inductions, fetch all contact documents
          const result = await getContactDocuments();
          if (result.success) {
            fetchedDocs = result.data as ContactDocument[];
          }
        }

        setDocuments(fetchedDocs);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError("Failed to load documents");
      }
    }

    fetchDocuments();
  }, [formState._id, formState.inductedPerson._id]);

  // Update formState.documents when selectedDocuments changes
  useEffect(() => {
    // Only update if we have documents to work with
    if (documents.length > 0) {
      const updatedDocuments = documents.map(doc => ({
        ...doc,
        isSelected: doc._id ? selectedDocuments.has(doc._id) : false
      }));

      // Filter to only include selected documents in formState
      const selectedDocs = updatedDocuments.filter(
        doc => doc._id && selectedDocuments.has(doc._id)
      );

      setFormState(prevState => ({
        ...prevState,
        documents: selectedDocs
      }));
    }
  }, [selectedDocuments, documents, setFormState]);

  const handleDocSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const docId = event.target.id;
    const isChecked = event.target.checked;
    
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(docId);
      } else {
        newSet.delete(docId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    
    if (isChecked) {
      // Select all documents
      const allDocIds = documents
        .map(doc => doc._id)
        .filter(Boolean) as string[];
      
      setSelectedDocuments(new Set(allDocIds));
    } else {
      // Deselect all
      setSelectedDocuments(new Set());
    }
  };

  const handlePreview = (doc: ContactDocument) => {
    setSavedDocument(doc);
    setIsModalOpen(true);
  };
 
  const closeModal = () => {
    setIsModalOpen(false);
    setSavedDocument(null);
  };

  // Check if all documents are selected for "select all" checkbox state
  const areAllDocsSelected = 
    documents.length > 0 && 
    documents.every(doc => doc._id && selectedDocuments.has(doc._id));

  return (
    <div className="p-4">
      {error ? (
        <div className="text-red-600 font-medium">{error}</div>
      ) : (
        <Card className="dark:bg-gray-900">
          <CardContent>
            <div>
              <h2 className="text-lg font-semibold mb-4">Select documents for induction</h2>
              {documents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-500">
                    <thead className="bg-gray-50 text-sm dark:bg-gray-800 transition-colors">
                      <tr className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400">
                        {!shouldHideCheckboxes && (
                          <th className="border px-4 py-2">
                            <input
                              type="checkbox"
                              checked={areAllDocsSelected}
                              onChange={handleSelectAll}
                            />
                          </th>
                        )}
                        <th className="border px-4 py-2">Document Type</th>
                        <th className="border px-4 py-2">File Name</th>
                        <th className="border px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr 
                          key={doc._id}  
                          className="border-t text-sm font-sm border-gray-200 dark:border-gray-600 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          {!shouldHideCheckboxes && (
                            <td className="border px-4 py-2">
                              <input
                                type="checkbox"
                                id={doc._id} 
                                checked={doc._id ? selectedDocuments.has(doc._id) : false}
                                onChange={handleDocSelectionChange}
                                className="mt-1"
                              />
                            </td>
                          )}
                          <td className="border px-4 py-2">{doc.docType}</td>
                          <td className="border px-4 py-2">{doc.fileName}</td>
                          <td className="border px-4 py-2">                        
                            <a
                              onClick={() => handlePreview(doc)}
                              className="text-blue-600 hover:underline cursor-pointer"
                            >
                              Preview
                            </a>
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
          </CardContent>
        </Card>
      )}

      {isModalOpen && savedDocument && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{savedDocument.fileName}</h3>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-900 text-2xl">✖</button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 border p-4 overflow-auto flex justify-center items-center">
              {savedDocument.fileType.startsWith("image/") ? (
                <img src={savedDocument.presignedUrl} alt={savedDocument.fileName} className="max-w-full max-h-[70vh] mx-auto" />
              ) : savedDocument.fileType === "application/pdf" ? (
                <iframe
                  src={savedDocument.presignedUrl}
                  className="w-full h-full"
                  title={savedDocument.fileName}
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
}