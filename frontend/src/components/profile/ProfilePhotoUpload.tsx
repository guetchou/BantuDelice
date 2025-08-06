import { useState } from 'react';
import { Button } from "@/components/ui/button";
import apiService from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfilePhotoUploadProps {
  userId: string;
  currentAvatarUrl?: string | null;
  onUploadComplete: (url: string) => void;
}

const ProfilePhotoUpload = ({ userId, currentAvatarUrl, onUploadComplete }: ProfilePhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      console.log('Starting avatar upload process...');

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Vous devez sélectionner une image à télécharger.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const timestamp = new Date().getTime();
      const filePath = userId === 'temp' 
        ? `temp/${timestamp}.${fileExt}`
        : `${userId}/${timestamp}.${fileExt}`;

      console.log('Uploading file to path:', filePath);

      const { error: uploadError, data } = await apiService.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful, getting public URL...');

      const { data: { publicUrl } } = apiService.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', publicUrl);

      // Only update the profile if we have a real user ID
      if (userId !== 'temp') {
        console.log('Updating user profile with new avatar URL...');
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', userId);

        if (updateError) {
          console.error('Profile update error:', updateError);
          throw updateError;
        }
      }

      onUploadComplete(publicUrl);
      
      toast({
        title: "Succès",
        description: "Votre photo de profil a été mise à jour.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = "Erreur lors du téléchargement de l'image.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // @ts-expect-error
        errorMessage = error.message || error.error_description || errorMessage;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={currentAvatarUrl || undefined} alt="Photo de profil" />
        <AvatarFallback>
          {userId === 'temp' ? 'UP' : userId.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex items-center gap-4">
        <input
          type="file"
          id="avatar"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        <Button
          onClick={() => document.getElementById('avatar')?.click()}
          disabled={uploading}
        >
          {uploading ? 'Téléchargement...' : 'Changer la photo'}
        </Button>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;