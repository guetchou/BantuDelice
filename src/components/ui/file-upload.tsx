
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onChange: (file: File | null) => void;
  value?: File | null;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  buttonText?: string;
  placeholder?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onChange,
  value,
  accept = "image/*",
  maxSize = 5,
  className,
  buttonText = "Choisir un fichier",
  placeholder = "Aucun fichier choisi"
}) => {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(value ? value.name : null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (!file) {
      onChange(null);
      setFileName(null);
      setError(null);
      return;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Le fichier est trop volumineux. Taille maximale: ${maxSize}MB`);
      onChange(null);
      setFileName(null);
      return;
    }
    
    setFileName(file.name);
    setError(null);
    onChange(file);
  };

  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setFileName(null);
    setError(null);
    onChange(null);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors">
        <UploadCloud className="h-12 w-12 text-gray-400 mb-3" />
        
        <p className="text-sm text-gray-500">
          Glissez-déposez un fichier, ou{" "}
          <Button 
            type="button" 
            variant="link" 
            className="p-0 h-auto font-semibold" 
            onClick={handleClick}
          >
            parcourez votre appareil
          </Button>
        </p>
        
        <p className="text-xs text-gray-400 mt-1">
          {accept.replace("*", "").replace(".", "")} • Max {maxSize}MB
        </p>
        
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />
      </div>
      
      {fileName && (
        <div className="mt-3 flex items-center justify-between p-2 border rounded-md bg-gray-50">
          <span className="text-sm truncate">{fileName}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
