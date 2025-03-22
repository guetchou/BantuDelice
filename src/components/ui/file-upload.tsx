
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileChange: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  label?: string;
  buttonText?: string;
  value?: File | null;
  error?: string;
}

const FileUpload = ({
  onFileChange,
  accept = "image/*",
  maxSizeMB = 5,
  className,
  label = "Télécharger un fichier",
  buttonText = "Parcourir",
  value,
  error
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [localFile, setLocalFile] = useState<File | null>(value || null);
  const [localError, setLocalError] = useState<string | null>(error || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeBytes) {
      setLocalError(`Le fichier dépasse la taille maximale de ${maxSizeMB}MB`);
      return false;
    }

    // Check file type if accept is specified
    if (accept !== "*") {
      const fileType = file.type;
      const acceptableTypes = accept.split(",").map(type => type.trim());
      
      // For image/* type validation
      if (accept === "image/*" && !fileType.startsWith("image/")) {
        setLocalError("Seules les images sont acceptées");
        return false;
      }
      
      // For specific types validation
      if (accept !== "image/*" && !acceptableTypes.some(type => fileType === type)) {
        setLocalError(`Les types de fichiers acceptés sont: ${accept}`);
        return false;
      }
    }

    setLocalError(null);
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setLocalFile(file);
      onFileChange(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const removeFile = () => {
    setLocalFile(null);
    setLocalError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onFileChange(null as any);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 transition-colors flex flex-col items-center justify-center",
          dragActive ? "border-primary bg-primary/5" : "border-gray-300",
          localError ? "border-red-500 bg-red-50" : "",
          localFile ? "border-green-500 bg-green-50" : "",
          "cursor-pointer hover:border-primary hover:bg-primary/5"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
        />
        
        {localFile ? (
          <div className="flex flex-col items-center space-y-2 py-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">{localFile.name}</span>
            </div>
            <p className="text-xs text-gray-500">
              {(localFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <Button
              size="sm"
              variant="destructive"
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2 py-4">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Upload className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex flex-col items-center space-y-1 text-center">
              <p className="text-sm font-medium text-gray-900">
                Glissez-déposez ou cliquez pour télécharger
              </p>
              <p className="text-xs text-gray-500">
                Taille maximale: {maxSizeMB} MB • {accept === "image/*" ? "Images" : accept}
              </p>
            </div>
            <Button size="sm" className="mt-2">
              {buttonText}
            </Button>
          </div>
        )}
      </div>
      
      {localError && (
        <p className="text-sm text-red-500">{localError}</p>
      )}
    </div>
  );
};

export default FileUpload;
