import { useRef, useState, WheelEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User, Camera, Trash2 } from "lucide-react";

interface ProfileImageProps {
  profileImage: string | null;
  fileInputRef: HTMLInputElement;
  triggerFileInput: () => void;
  removeProfilePicture: () => void;
  handleFileUpload: (e: ChangeEvent<HTMLInputElement>, type: "profile" | "document") => void;
}

 export const ProfileImage: React.FC<ProfileImageProps> = ({
  profileImage,
  triggerFileInput,
  removeProfilePicture,
  handleFileUpload,
  //fileInputRef
}) => {
 const fileInputRef = useRef<HTMLInputElement>(null);
  const [scale, setScale] = useState(1);

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    setScale((prev) => Math.min(Math.max(prev - e.deltaY * 0.001, 0.5), 2)); // Zoom between 0.5x and 2x
  };

  return (
    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-secondary group">
      {profileImage ? (
        <motion.img
          src={profileImage}
          alt="Profile"
          className="w-full h-full object-cover cursor-move"
          drag
          dragMomentum={false}
          onWheel={handleWheel}
          style={{ scale }}
          dragConstraints={{
            left: -50,
            right: 50,
            top: -50,
            bottom: 50,
          }}
        />
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
        {profileImage && (
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
  );
};


