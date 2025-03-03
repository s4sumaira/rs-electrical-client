'use client'
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModalFooter } from "@/components/modal";
import { Contact } from "@/lib/types/contact";
import { useForm } from "@/hooks/useForm";
import { uploadProfileImg, deleteFile } from "@/app/actions/uploadActions";
import { updateContact, getLoggedInUserContact } from "@/app/actions/contactActions";
import { Loader } from "@/components/loader";
import { ProfileHeader } from "./header";
import { ProfileTabs } from "./tabs";
import { PersonalInfo, ContactInfo, EmploymentInfo, DocumentsInfo } from "./tab-contents";
import { initialValues } from "@/app/(portal)/profile/constants";
import type { ProfileFormProps } from "@/lib/types/profile";
import type { ActionState } from "@/lib/types/form";

const ProfileForm: React.FC<ProfileFormProps> = ({ onSave }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);

  const [saving, setSaving] = useState(false);
  const [displayProfileUrl, setDisplayProfileUrl] = useState<string>("");


  const customSubmitAction = async (state: ActionState<Contact>, formData: FormData): Promise<ActionState<Contact>> => {
    setSaving(true);
    try {

      formData.delete("documents");
      formData.delete("files");

      const result = await updateContact(state, formData);

      return result;
    } finally {
      setSaving(false);
    }
  };

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
    submitAction: customSubmitAction,
    onSuccess: async (data, message) => {
      onSave?.(data);

      await fetchUserData();
    },
    onError: (error) => {
      console.error(error);
      setError(typeof error === 'string' ? error : 'An error occurred while saving');
    },
  });


  const handleTabChange = (tabName: string) => {

    setActiveTab(tabName);
  };


  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();     
    const formData = new FormData();   
    handleSubmit(formData);
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const result = await getLoggedInUserContact();
      if (result.success && result.data) {
        if (result.data.profileImage) {
          setDisplayProfileUrl(result.data.profileImage);
        }
        setContact(result.data);

        console.log('Contact after saving', contact);

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
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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

    if (type === "profile") {
      try {
        const formData = new FormData();
        formData.append("file", file);

        console.log('Form Data', formData);

        const response = await uploadProfileImg(formData);

        if (!response?.success) {
          console.error("Upload failed:", response?.message);
          return;
        }

        if (response?.data) {
         
          setFormState((prev) => ({
            ...prev,
            profileImage: response?.data as any,
          }));

         
        } else {
          console.warn("No profileImage returned from uploadProfileImg.");
        }
      } catch (err) {
        console.error("Profile image upload failed:", err);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeProfilePicture = async () => {
    if (formState.profileImage) {
      try {
        await deleteFile();
        setFormState((prev) => ({ ...prev, profileImage: "" }));
        // Also update the original profile image reference
        // setOriginalProfileImage("");
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

  const showSaveButton = activeTab !== "documents";

  const displayFormState = {
    ...formState,
    // Use the presigned URL for display if available, otherwise fall back to the key
    profileImage: displayProfileUrl || formState.profileImage
  };

  return (
    <>
      {/* Use onSubmit={e => e.preventDefault()} to prevent form submission */}
      <form
        id="profile-form"
        className="w-full space-y-6 p-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="max-w-[1400px] mx-auto w-full">
          <input type="hidden" {...getInputProps("_id")} />

          <ProfileHeader
            formState={displayFormState}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            removeProfilePicture={removeProfilePicture}
            triggerFileInput={triggerFileInput}
          />

          {/* Pass the custom handler to ProfileTabs */}
          <ProfileTabs
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />

          <div className="w-full">
            {renderTabContent()}

          </div>
          {showSaveButton && (
            <ModalFooter>
              <Button
                type="button"
                id="btnSaveProfile"
                onClick={handleSave}
                disabled={isLoading || saving}
                className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
              >
                {isLoading || saving ? (
                  <div className="flex items-center space-x-2">
                    <span className="animate-spin">⏳</span>
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save"
                )}
              </Button>
            </ModalFooter>
          )}
        </div>

      </form>

    </>
  );
};

export default ProfileForm;