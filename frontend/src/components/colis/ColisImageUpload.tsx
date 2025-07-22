import React, { useState, useRef } from 'react';

interface ColisImageUploadProps {
  onImagesUpload: (imageUrls: string[]) => void;
  colisId?: string;
}

const ColisImageUpload: React.FC<ColisImageUploadProps> = ({ onImagesUpload, colisId }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    setUploading(true);
    setError(null);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => [...prev, previewUrl]);

      if (colisId) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const res = await fetch(`/api/colis/${colisId}/upload-image`, {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (res.ok && data.imageUrl) {
            uploadedUrls.push(data.imageUrl);
          } else {
            throw new Error(data.message || "Erreur d'upload");
          }
        } catch (err: any) {
          setError(err.message || "Erreur lors de l'upload");
        }
      } else {
        uploadedUrls.push(previewUrl);
      }
    }
    
    setUploading(false);
    onImagesUpload(uploadedUrls);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current?.classList.remove('ring-2', 'ring-orange-400');
    handleFiles(e.dataTransfer.files);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current?.classList.add('ring-2', 'ring-orange-400');
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current?.classList.remove('ring-2', 'ring-orange-400');
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        handleFiles(e.target.files);
    }
  };

  return (
    <div>
      <div
        ref={dropRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer mb-4 bg-gray-50 hover:bg-gray-100"
        style={{ minHeight: 120 }}
        onClick={() => (dropRef.current?.querySelector('input[type=file]') as HTMLInputElement)?.click()}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="text-gray-500">Glissez-déposez vos images ici ou cliquez pour sélectionner</p>
        {uploading && <p className="text-orange-600 mt-2">Upload en cours...</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
      <div className="flex flex-wrap gap-4 mt-2">
        {imagePreviews.map((url, index) => (
          <img key={index} src={url} alt="Aperçu colis" className="w-24 h-24 object-cover rounded shadow" />
        ))}
      </div>
    </div>
  );
}

export default ColisImageUpload; 