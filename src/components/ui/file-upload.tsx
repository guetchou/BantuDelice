
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onChange: (file: File) => void;
  value?: string;
  label?: string;
  className?: string;
  accept?: string;
  maxSize?: number;
  error?: string;
  disabled?: boolean;
  previewUrl?: string;
  onClear?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onChange,
  value,
  label = "Upload file",
  className,
  accept = "image/*",
  maxSize = 5242880, // 5MB
  error,
  disabled = false,
  previewUrl,
  onClear
}) => {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(error || null);
  
  const isImageType = accept.includes('image/');
  
  const handleFileChange = (file: File) => {
    if (file.size > maxSize) {
      setFileError(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
      return;
    }
    
    setFileError(null);
    setFileName(file.name);
    
    if (isImageType) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    
    onChange(file);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };
  
  const handleClear = () => {
    setPreview(null);
    setFileName(null);
    if (onClear) {
      onClear();
    }
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border",
          (preview || fileName) ? "bg-background" : "bg-muted/30",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={!disabled ? handleDragEnter : undefined}
        onDragLeave={!disabled ? handleDragLeave : undefined}
        onDragOver={!disabled ? handleDragOver : undefined}
        onDrop={!disabled ? handleDrop : undefined}
      >
        <Input
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          id="file-upload"
          disabled={disabled}
        />
        
        {!preview && !fileName ? (
          <label
            htmlFor="file-upload"
            className={cn(
              "flex flex-col items-center justify-center h-32 cursor-pointer",
              disabled && "cursor-not-allowed"
            )}
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              Drag & drop your file here or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {accept.replace(/,/g, ' or ')}
            </p>
            {maxSize && (
              <p className="text-xs text-muted-foreground mt-1">
                Max size: {maxSize / 1024 / 1024}MB
              </p>
            )}
          </label>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {preview ? (
                  <div className="flex-shrink-0 h-16 w-16 rounded overflow-hidden bg-background">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {fileName || "File uploaded"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {value || preview ? (
                      <span className="flex items-center text-green-600">
                        <Check className="h-3 w-3 mr-1" /> Uploaded successfully
                      </span>
                    ) : (
                      "Processing..."
                    )}
                  </p>
                </div>
              </div>
              
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              )}
            </div>
            
            {!disabled && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs"
                asChild
              >
                <label htmlFor="file-upload">Change file</label>
              </Button>
            )}
          </div>
        )}
      </div>
      
      {(fileError || error) && (
        <p className="text-sm text-destructive mt-1">{fileError || error}</p>
      )}
    </div>
  );
};
