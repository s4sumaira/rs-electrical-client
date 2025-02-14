import { TabContentProps } from "@/lib/types/profile";
import { FileUploader, type FileWithDocType, type DocTypes } from "@/components/file-uploader"
import { Contact, ContactDocument } from "@/lib/types/contact";
import { useEffect ,useState} from "react";

interface DocumentsInfoProps extends TabContentProps {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, type: "profile" | "document") => Promise<void>;
  documentName: string | null;  
   setFormState: React.Dispatch<React.SetStateAction<Contact>>
}



export const DocumentsInfo: React.FC<DocumentsInfoProps> = ({ 
  formState, 
  handleFileUpload,
  documentName,
  setFormState

}) => {

 const [files, setFiles] = useState<FileWithDocType[]>([])

  const docTypes: DocTypes = {
    LABOURER_CARD: "Labourer Card",
    APPRENTICE_CARD: "Apprentice Card",
    INSTALLATION_ELECTRICIAN: "Installation Electrician",
    EXPERIENCED_WORKER: "Experienced Worker",
    SITE_MANAGER: "Site Manager",
    PROJECT_MANAGER: "Project Manager",
    OTHER: "Other",
  }

  useEffect (()=>{
    console.log('formstate',formState);

  },[formState])

  useEffect(() => {
    if (files.length) {

      setFormState((prevState) => ({
        ...prevState,
        files: [], 
      }));

      setFormState((prevState) => ({
            ...prevState,
            files: [...(prevState.files || []), ...files], 
          }));
    }


  }, [files]);
  
  
  const handleOnFileChange = (files: FileWithDocType []) => {

   setFiles(files); 
  //  if(files.length > 0){
  //   setFormState((prevState) => ({
  //     ...prevState,
  //     files: [...(prevState.files || []), ...files], 
  //   }));

  //  }
 

   console.log('uploaded files',files);
   
   
  }
  return (
 
    <FileUploader onFileChange={handleOnFileChange} docTypes={docTypes} initFiles={files}/>
 
  
  );
};