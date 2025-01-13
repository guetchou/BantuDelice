import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
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

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Vous devez sélectionner une image à télécharger.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      // Use a timestamp instead of random number for better uniqueness
      const timestamp = new Date().getTime();
      // If we're in pre-registration (temp userId), store in a temporary folder
      const filePath = userId === 'temp' 
        ? `temp/${timestamp}.${fileExt}`
        : `${userId}/${timestamp}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Only update the profile if we have a real user ID
      if (userId !== 'temp') {
        await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', userId);
      }

      onUploadComplete(publicUrl);
      
      toast({
        title: "Succès",
        description: "Votre photo de profil a été mise à jour.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement de l'image.",
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