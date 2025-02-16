'use client'
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Contact } from "@/lib/types/contact";
import { useForm } from "@/hooks/useForm";
import { uploadFiles, deleteFile } from "@/app/actions/uploadActions";
import { updateContact, getLoggedInUserContact } from "@/app/actions/contactActions";
import { Loader } from "@/components/loader";
import { ProfileHeader } from "./header";
import { ProfileTabs } from "./tabs";
import { PersonalInfo, ContactInfo, EmploymentInfo, DocumentsInfo } from "./tab-contents";
import { initialValues } from "@/app/(portal)/profile/constants";
import type { ProfileFormProps } from "@/lib/types/profile";

const ProfileForm: React.FC<ProfileFormProps> = ({ onSave }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);

  const {
    formState,
    errors,
    isLoading,
    handleSubmit,
    getInputProps,
    getSelectProps,
    setFormState,
  } = useForm<Contact>({
    initialValues: contact ?? initialValues,
    submitAction: async (state, formData) => {
      return updateContact(state, formData);
    },
    onSuccess: (data, message) => {
      onSave?.(data);
    },
    onError: (error) => {
      console.error(error);
      setError(typeof error === 'string' ? error : 'An error occurred while saving');
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!contact) {
        try {
          setLoading(true);
          const result = await getLoggedInUserContact();
          if (result.success && result.data) {
            setContact(result.data);
            setError(null);
          } else {
            setError(result.message || 'Failed to fetch user data');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError('An unexpected error occurred');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [contact]);

  useEffect(() => {
    if (contact) {
      const formattedContact = {
        ...contact,
        birthDate: contact.birthDate 
          ? new Date(contact.birthDate).toLocaleDateString('en-GB').split('/').join('/')
          : "",
      };
      setFormState(formattedContact);
    }
  }, [contact, setFormState]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "document"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
  
    try {
     // const result = await uploadFiles(formData);
  
      // if (result.success) {
      //   if (type === "profile") {
      //     setFormState((prev) => ({ ...prev, profileImage: result.url }));
      //   } else {
      //     setFormState((prev) => ({
      //       ...prev,
      //       documents: [...(prev.documents || []), { name: file.name, description: "", url: result.url }],
      //     }));
      //     setDocumentName(file.name);
      //   }
      // } else {
      //   setError(result.error || 'Failed to upload file');
      // }
    } catch (error) {
      setError('An error occurred while uploading the file');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeProfilePicture = async () => {
    if (formState.profileImage) {
      try {
        await deleteFile(formState.profileImage);
        setFormState((prev) => ({ ...prev, profileImage: "" }));
      } catch (error) {
        setError('Failed to remove profile picture');
      }
    }
  };

  const renderTabContent = () => {
    const commonProps = {
      formState,
      errors,
      getInputProps,
      getSelectProps,
      setFormState,
    };

    switch (activeTab) {
      case "personal":
        return <PersonalInfo {...commonProps} />;
      case "contact":
        return <ContactInfo {...commonProps} />;
      case "employment":
        return <EmploymentInfo {...commonProps} />;
      case "documents":
        return (
          <DocumentsInfo
            {...commonProps}
            handleFileUpload={handleFileUpload}
            documentName={documentName}           
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="w-full space-y-6 p-4">
      <div className="max-w-[1400px] mx-auto w-full">
        <input type="hidden" {...getInputProps("_id")} />
        
        <ProfileHeader
          formState={formState}
          fileInputRef={fileInputRef}
          handleFileUpload={handleFileUpload}
          removeProfilePicture={removeProfilePicture}
          triggerFileInput={triggerFileInput}
        />
        
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="w-full">
          {renderTabContent()}
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button 
            type="submit" 
            className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;