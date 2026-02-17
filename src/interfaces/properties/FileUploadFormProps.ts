export interface FileUploadFormProps {
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
    isHomologation: boolean;
    setIsHomologation: React.Dispatch<React.SetStateAction<boolean>>;
    handleUpload: () => void;
    fileName: string;
    setFileName: React.Dispatch<React.SetStateAction<string>>;
}