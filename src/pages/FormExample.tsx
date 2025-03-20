
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ModernForm, { FormField } from '@/components/forms/ModernForm';
import { useState } from 'react';
import { Building, Mail, Phone, User } from 'lucide-react';
import { toast } from 'sonner';

export default function FormExample() {
  const [formData, setFormData] = useState<any>(null);

  const employeeFields: FormField[] = [
    {
      id: 'firstName',
      label: 'Prénom',
      type: 'text',
      placeholder: 'Jean',
      required: true,
      icon: User,
    },
    {
      id: 'lastName',
      label: 'Nom',
      type: 'text',
      placeholder: 'Dupont',
      required: true,
      icon: User,
    },
    {
      id: 'email',
      label: 'Email professionnel',
      type: 'email',
      placeholder: 'jean.dupont@entreprise.fr',
      required: true,
      icon: Mail,
      help: 'Veuillez utiliser une adresse email professionnelle pour les communications de l\'entreprise.'
    },
    {
      id: 'phone',
      label: 'Téléphone',
      type: 'tel',
      placeholder: '06 12 34 56 78',
      icon: Phone,
    },
    {
      id: 'department',
      label: 'Département',
      type: 'select',
      placeholder: 'Sélectionnez un département',
      required: true,
      icon: Building,
      options: [
        { value: 'it', label: 'Informatique' },
        { value: 'hr', label: 'Ressources Humaines' },
        { value: 'sales', label: 'Ventes' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'finance', label: 'Finance' },
      ],
    },
    {
      id: 'position',
      label: 'Poste',
      type: 'text',
      placeholder: 'Développeur Frontend',
      required: true,
    },
    {
      id: 'startDate',
      label: 'Date de début',
      type: 'date',
      required: true,
    },
    {
      id: 'contractType',
      label: 'Type de contrat',
      type: 'radio',
      required: true,
      options: [
        { value: 'cdi', label: 'CDI' },
        { value: 'cdd', label: 'CDD' },
        { value: 'intern', label: 'Stage' },
        { value: 'freelance', label: 'Freelance' },
      ],
    },
    {
      id: 'notes',
      label: 'Notes additionnelles',
      type: 'textarea',
      placeholder: 'Informations complémentaires sur l\'employé...',
    },
    {
      id: 'consent',
      label: 'Je confirme que ces informations sont correctes et que j\'ai l\'autorisation de les saisir dans le système.',
      type: 'checkbox',
      required: true,
    },
  ];

  const handleSubmit = async (data: any) => {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setFormData(data);
    return data;
  };

  const handleCancel = () => {
    toast.info("Formulaire annulé");
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Gestion des Employés</h1>
          <p className="text-muted-foreground mt-2">
            Ajoutez de nouveaux employés dans le système et gérez leurs informations personnelles et professionnelles.
          </p>
        </div>
        
        <div className="mb-10">
          <ModernForm
            title="Ajouter un nouvel employé"
            description="Remplissez les informations pour créer un compte employé dans le système."
            fields={employeeFields}
            submitLabel="Créer l'employé"
            cancelLabel="Annuler"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
        
        {formData && (
          <div className="card-gradient p-6 animate-fade-in">
            <h3 className="text-xl font-semibold mb-3">Données soumises :</h3>
            <pre className="bg-secondary/50 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
