
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PreferencesTab = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Vous pouvez gérer vos préférences d'application et de notifications dans la section Paramètres.
        </p>
        
        <Button variant="outline" onClick={() => navigate('/settings')}>
          Aller aux paramètres
        </Button>
      </CardContent>
    </Card>
  );
};

export default PreferencesTab;
