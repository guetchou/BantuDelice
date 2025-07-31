import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, User } from 'lucide-react';

interface AvatarUploadProps {
  onImageChange: (file: File | null) => void;
  currentImage?: string | null;
  className?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  onImageChange, 
  currentImage, 
  className = "" 
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validation du type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }

      // Validation de la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image doit faire moins de 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onImageChange(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className="relative w-24 h-24 mx-auto cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
          {preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <User className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Overlay au survol */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}

        {/* Bouton de suppression */}
        {preview && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveImage();
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Boutons d'action */}
      <div className="flex justify-center gap-2 mt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          className="text-xs"
        >
          <Upload className="h-3 w-3 mr-1" />
          Changer
        </Button>
        {preview && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveImage}
            className="text-xs text-red-600 hover:text-red-700"
          >
            <X className="h-3 w-3 mr-1" />
            Supprimer
          </Button>
        )}
      </div>

      {/* Instructions */}
      <p className="text-xs text-gray-500 text-center mt-2">
        Format: JPG, PNG • Max: 5MB
      </p>
    </div>
  );
};

export default AvatarUpload; 