
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FileUpload from '@/components/ui/file-upload';

const documentTypes = [
  { id: 'id_card', name: 'Carte d\'identité' },
  { id: 'driver_license', name: 'Permis de conduire' },
  { id: 'background_check', name: 'Vérification d\'antécédents' },
  { id: 'passport', name: 'Passeport' },
  { id: 'proof_of_address', name: 'Justificatif de domicile' },
];

const formSchema = z.object({
  document_type: z.string().min(1, 'Veuillez sélectionner un type de document'),
  document_number: z.string().min(1, 'Veuillez entrer le numéro du document'),
  document_file: z.any().refine(file => file, 'Veuillez télécharger un fichier'),
});

type FormData = z.infer<typeof formSchema>;

const DriverVerification = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedDocuments, setSubmittedDocuments] = useState<any[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document_type: '',
      document_number: '',
      document_file: null,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmittedDocuments(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          document_type: data.document_type,
          document_number: data.document_number,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        },
      ]);
      
      form.reset();
    } catch (error) {
      console.error('Error submitting document:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Vérification du chauffeur</h2>
      
      <Tabs defaultValue="submit">
        <TabsList className="mb-6">
          <TabsTrigger value="submit">Soumettre des documents</TabsTrigger>
          <TabsTrigger value="status">Statut des vérifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="submit">
          <Card>
            <CardHeader>
              <CardTitle>Soumettre un nouveau document</CardTitle>
              <CardDescription>
                Veuillez soumettre les documents requis pour la vérification de votre compte chauffeur.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="document_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de document</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un type de document" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {documentTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="document_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro du document</FormLabel>
                        <FormControl>
                          <Input placeholder="Entrez le numéro du document" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="document_file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document</FormLabel>
                        <FormControl>
                          <FileUpload
                            onChange={field.onChange}
                            value={field.value}
                            accept=".jpg,.jpeg,.png,.pdf"
                            maxSize={5}
                            placeholder="Aucun fichier sélectionné"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Soumission en cours...' : 'Soumettre le document'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Statut des vérifications</CardTitle>
              <CardDescription>
                Consultez l'état de vos documents soumis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submittedDocuments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun document soumis pour le moment.
                </div>
              ) : (
                <div className="space-y-4">
                  {submittedDocuments.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">
                          {documentTypes.find(t => t.id === doc.document_type)?.name}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          doc.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : doc.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {doc.status === 'pending' ? 'En attente' : 
                           doc.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        N° {doc.document_number}
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        Soumis le {new Date(doc.submitted_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="w-full">
                Rafraîchir le statut
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DriverVerification;
