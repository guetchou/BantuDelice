
import React, { useState, useRef } from 'react';
import { Button } from './button';
import { Upload, File, X } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  onChange: (files: File[]) => void;
  value?: File[];
  className?: string;
  dropzoneText?: string;
  buttonText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = 'image/*',
  multiple = false,
  maxFiles = 5,
  maxSize = 5, // 5MB default
  onChange,
  value = [],
  className = '',
  dropzoneText = 'Glissez-déposez vos fichiers ici ou',
  buttonText = 'Parcourir'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>(value);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFiles = (fileList: File[]): { valid: File[], errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];
    
    // Check if too many files
    if (fileList.length + files.length > maxFiles) {
      errors.push(`Vous ne pouvez pas télécharger plus de ${maxFiles} fichiers.`);
      return { valid, errors };
    }
    
    for (const file of fileList) {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name} est trop volumineux. Taille maximum: ${maxSize}MB.`);
        continue;
      }
      
      // Check file type
      if (accept !== '*' && !file.type.match(accept.replace(/\*/g, '.*'))) {
        errors.push(`${file.name} n'est pas un type de fichier accepté.`);
        continue;
      }
      
      valid.push(file);
    }
    
    return { valid, errors };
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
    
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  const processFiles = (newFiles: File[]) => {
    const { valid, errors } = validateFiles(newFiles);
    
    if (errors.length) {
      setErrors(errors);
    }
    
    if (valid.length) {
      const updatedFiles = [...files, ...valid];
      setFiles(updatedFiles);
      onChange(updatedFiles);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    onChange(updatedFiles);
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
        }`}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {dropzoneText}{' '}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            {buttonText}
          </Button>
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {accept.replace('*', '')} (Max: {maxSize}MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
        />
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md">
          <div className="flex justify-between">
            <h4 className="font-semibold text-sm">Erreurs</h4>
            <button type="button" onClick={clearErrors} className="text-red-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="mt-1 text-xs list-disc list-inside">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Fichiers sélectionnés</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                <div className="flex items-center">
                  <File className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="truncate max-w-[200px]">{file.name}</span>
                  <span className="ml-2 text-gray-500 text-xs">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
