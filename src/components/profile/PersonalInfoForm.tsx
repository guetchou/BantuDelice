
import { UserProfile } from "@/hooks/useUser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PersonalInfoFormProps {
  user: UserProfile | null;
  updating: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: {
    first_name: string;
    last_name: string;
    phone: string;
    avatar_url: string;
  };
}

const PersonalInfoForm = ({ 
  user, 
  updating, 
  onSubmit, 
  onInputChange, 
  formData 
}: PersonalInfoFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="first_name" className="text-sm font-medium">
            Prénom
          </label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={onInputChange}
            placeholder="Prénom"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="last_name" className="text-sm font-medium">
            Nom
          </label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={onInputChange}
            placeholder="Nom"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          value={user?.email}
          disabled
          className="bg-gray-100"
        />
        <p className="text-xs text-gray-500">L'email ne peut pas être modifié</p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Téléphone
        </label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={onInputChange}
          placeholder="+242 XX XXX XXX"
        />
      </div>
      
      <div className="pt-4">
        <Button type="submit" disabled={updating} className="w-full md:w-auto">
          {updating ? "Mise à jour..." : "Mettre à jour le profil"}
        </Button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
