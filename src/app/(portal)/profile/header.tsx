// components/profile/header.tsx
import { User, Briefcase, Building, Mail, Phone, Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileHeaderProps } from "@/lib/types/profile";
import { ProfileImage } from "@/components/profile-image"; 

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  formState, 
  fileInputRef, 
  handleFileUpload, 
  removeProfilePicture, 
  triggerFileInput 
}) => (
  <Card className="mb-6 w-full">
    <CardContent className="p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-secondary group">
          {formState.profileImage ? (
            <img src={formState.profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
              <User size={64} />
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full p-2 bg-white text-gray-800 hover:bg-gray-200"
              onClick={triggerFileInput}
            >
              <Camera size={24} />
            </Button>
            {formState.profileImage && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full p-2 bg-white text-gray-800 hover:bg-gray-200 ml-2"
                onClick={removeProfilePicture}
              >
                <Trash2 size={24} />
              </Button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, "profile")}
          />
        </div> 
        {/* <div>
          <ProfileImage profileImage={formState.profileImage || null} triggerFileInput={triggerFileInput} 
          removeProfilePicture={removeProfilePicture} handleFileUpload={handleFileUpload} fileInputRef={fileInputRef as any}></ProfileImage>
        </div> */}
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-2xl font-medium">{`${formState.firstName} ${formState.lastName}`}</h1>
          <div className="flex flex-col space-y-1 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Briefcase size={16} />
              <span>{formState.jobTitle || "No job title"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building size={16} />
              <span>{formState.company || "No company"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={16} />
              <span>{formState.email}</span>
            </div>
            {formState.phone && (
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>{formState.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);