
import { UserProfile } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Shield } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import ProfilePhotoUpload from "./ProfilePhotoUpload";

interface ProfileSummaryProps {
  user: UserProfile | null;
  onAvatarUpdate: (url: string) => void;
}

const ProfileSummary = ({ user, onAvatarUpdate }: ProfileSummaryProps) => {
  if (!user) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <ProfilePhotoUpload 
            userId={user.id || ""}
            currentAvatarUrl={user.avatar_url}
            onUploadComplete={onAvatarUpdate}
          />
          
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-500">{user.email}</p>
            
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {user.role === 'admin' ? 'Administrateur' : 
                 user.role === 'restaurant_owner' ? 'Propriétaire de restaurant' : 
                 user.role === 'driver' ? 'Chauffeur' : 'Utilisateur'}
              </span>
            </div>
          </div>
          
          <Separator />
          
          <div className="w-full space-y-2">
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              <span>{user.email}</span>
            </div>
            
            {user.phone && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span>{user.phone}</span>
              </div>
            )}
            
            <div className="flex items-center text-sm">
              <Shield className="h-4 w-4 mr-2 text-gray-500" />
              <span>Compte créé le {formatDate(user.created_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSummary;
