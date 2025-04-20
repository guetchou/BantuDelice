
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/hooks/useUser";
import { formatDate } from "@/utils/dateUtils";

// Extended UserProfile interface to include additional fields
interface ExtendedUserProfile extends UserProfile {
  last_login?: string;
  status?: string;
}

interface SecurityTabProps {
  user: ExtendedUserProfile | null;
}

const SecurityTab = ({ user }: SecurityTabProps) => {
  // Helper function to safely format dates or return a default value
  const safeFormatDate = (dateString?: string) => {
    if (!dateString) return 'Inconnue';
    return formatDate(dateString);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sécurité du compte</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Changer de mot de passe</h3>
            <p className="text-sm text-gray-500">
              Pour des raisons de sécurité, veuillez contacter l'administrateur pour changer votre mot de passe.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Connexions récentes</h3>
            <p className="text-sm text-gray-500">
              Dernière connexion: {user?.last_login ? safeFormatDate(user.last_login) : 'Inconnue'}
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Statut du compte</h3>
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${user?.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{user?.status === 'active' ? 'Actif' : 'Inactif'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityTab;
