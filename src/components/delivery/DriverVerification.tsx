
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DeliveryDriver, DeliveryVerification } from '@/types/delivery';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FileUpload } from '@/components/ui/file-upload';
import { CheckCircle2, AlertCircle, Upload, Shield, FileCheck2 } from 'lucide-react';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

interface DriverVerificationProps {
  driverId: string;
  isAdmin?: boolean;
}

export default function DriverVerification({ driverId, isAdmin = false }: DriverVerificationProps) {
  const [driver, setDriver] = useState<DeliveryDriver | null>(null);
  const [documents, setDocuments] = useState<DeliveryVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [docNumber, setDocNumber] = useState('');
  const [docExpiryDate, setDocExpiryDate] = useState('');

  useEffect(() => {
    fetchDriverData();
  }, [driverId]);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      
      // Fetch driver info
      const { data: driverData, error: driverError } = await supabase
        .from('delivery_drivers')
        .select('*')
        .eq('id', driverId)
        .single();
      
      if (driverError) throw driverError;
      setDriver(driverData as DeliveryDriver);
      
      // Fetch verification documents
      const { data: docsData, error: docsError } = await supabase
        .from('driver_verifications')
        .select('*')
        .eq('driver_id', driverId)
        .order('created_at', { ascending: false });
      
      if (docsError) throw docsError;
      setDocuments(docsData as DeliveryVerification[]);
      
    } catch (error) {
      console.error('Error fetching driver data:', error);
      toast.error('Erreur lors du chargement des données du livreur');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (docType: string, file: File) => {
    try {
      setUploadingDoc(docType);
      setUploadProgress(0);
      
      if (!driver) return;
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${driverId}_${docType}_${Date.now()}.${fileExt}`;
      const filePath = `driver_documents/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = await supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      const publicUrl = publicUrlData.publicUrl;
      
      // Create document record
      const { data: docData, error: docError } = await supabase
        .from('driver_verifications')
        .insert({
          driver_id: driverId,
          document_type: docType,
          document_number: docNumber,
          document_url: publicUrl,
          expiry_date: docExpiryDate || null,
          verification_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (docError) throw docError;
      
      // Update driver verification status if it was 'rejected' or not set
      if (!driver.verification_status || driver.verification_status === 'rejected') {
        const { error: driverError } = await supabase
          .from('delivery_drivers')
          .update({
            verification_status: 'pending',
            updated_at: new Date().toISOString()
          })
          .eq('id', driverId);
        
        if (driverError) throw driverError;
      }
      
      toast.success('Document téléchargé avec succès');
      fetchDriverData();
      
      // Reset form
      setDocNumber('');
      setDocExpiryDate('');
      
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Erreur lors du téléchargement du document');
    } finally {
      setUploadingDoc(null);
      setUploadProgress(0);
    }
  };

  const getVerificationStatusBadge = (status: string) => {
    switch(status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Vérifié</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDocumentTypeName = (type: string) => {
    switch(type) {
      case 'id_card':
        return 'Carte d\'identité';
      case 'driver_license':
        return 'Permis de conduire';
      case 'passport':
        return 'Passeport';
      case 'proof_of_address':
        return 'Justificatif de domicile';
      default:
        return type;
    }
  };

  const getVerificationStatus = () => {
    if (!driver) return 'unknown';
    
    if (driver.verification_status === 'verified') {
      return 'verified';
    }
    
    if (driver.verification_status === 'rejected') {
      return 'rejected';
    }
    
    const hasIdDocument = documents.some(doc => 
      (doc.document_type === 'id_card' || doc.document_type === 'passport') && 
      doc.verification_status !== 'rejected'
    );
    
    const hasLicense = documents.some(doc => 
      doc.document_type === 'driver_license' && 
      doc.verification_status !== 'rejected'
    );
    
    const hasAddress = documents.some(doc => 
      doc.document_type === 'proof_of_address' && 
      doc.verification_status !== 'rejected'
    );
    
    if (hasIdDocument && hasLicense && hasAddress) {
      return 'pending_complete';
    }
    
    return 'incomplete';
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Vérification</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Vérification du livreur</span>
          {driver && (
            <Badge variant={driver.verification_status === 'verified' ? 'default' : 'outline'} 
              className={
                driver.verification_status === 'verified' ? 'bg-green-500' : 
                driver.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }
            >
              {driver.verification_status === 'verified' ? 'Vérifié' : 
               driver.verification_status === 'pending' ? 'En attente' : 
               'Non vérifié'}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Téléchargez vos documents pour la vérification
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {getVerificationStatus() === 'verified' && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Compte vérifié</AlertTitle>
            <AlertDescription>
              Tous vos documents ont été vérifiés et approuvés. Vous pouvez maintenant accepter des livraisons.
            </AlertDescription>
          </Alert>
        )}

        {getVerificationStatus() === 'rejected' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Vérification rejetée</AlertTitle>
            <AlertDescription>
              Certains de vos documents n'ont pas été approuvés. Veuillez télécharger de nouveaux documents.
            </AlertDescription>
          </Alert>
        )}

        {getVerificationStatus() === 'pending_complete' && (
          <Alert className="bg-blue-50 border-blue-200">
            <Shield className="h-4 w-4 text-blue-500" />
            <AlertTitle>Vérification en cours</AlertTitle>
            <AlertDescription>
              Tous les documents nécessaires ont été téléchargés. Notre équipe est en train de les vérifier.
            </AlertDescription>
          </Alert>
        )}

        {getVerificationStatus() === 'incomplete' && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertTitle>Documents manquants</AlertTitle>
            <AlertDescription>
              Veuillez télécharger tous les documents requis pour commencer le processus de vérification.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Documents requis</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileCheck2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Carte d'identité ou Passeport</div>
                    <div className="text-xs text-muted-foreground">Document d'identité valide</div>
                  </div>
                </div>
                <div>
                  {documents.some(doc => 
                    (doc.document_type === 'id_card' || doc.document_type === 'passport') && 
                    doc.verification_status !== 'rejected'
                  ) ? (
                    getVerificationStatusBadge(
                      documents.find(doc => 
                        (doc.document_type === 'id_card' || doc.document_type === 'passport') && 
                        doc.verification_status !== 'rejected'
                      )?.verification_status || 'pending'
                    )
                  ) : (
                    <Badge variant="outline" className="bg-gray-100">Non fourni</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileCheck2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Permis de conduire</div>
                    <div className="text-xs text-muted-foreground">Permis en cours de validité</div>
                  </div>
                </div>
                <div>
                  {documents.some(doc => 
                    doc.document_type === 'driver_license' && 
                    doc.verification_status !== 'rejected'
                  ) ? (
                    getVerificationStatusBadge(
                      documents.find(doc => 
                        doc.document_type === 'driver_license' && 
                        doc.verification_status !== 'rejected'
                      )?.verification_status || 'pending'
                    )
                  ) : (
                    <Badge variant="outline" className="bg-gray-100">Non fourni</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileCheck2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Justificatif de domicile</div>
                    <div className="text-xs text-muted-foreground">Datant de moins de 3 mois</div>
                  </div>
                </div>
                <div>
                  {documents.some(doc => 
                    doc.document_type === 'proof_of_address' && 
                    doc.verification_status !== 'rejected'
                  ) ? (
                    getVerificationStatusBadge(
                      documents.find(doc => 
                        doc.document_type === 'proof_of_address' && 
                        doc.verification_status !== 'rejected'
                      )?.verification_status || 'pending'
                    )
                  ) : (
                    <Badge variant="outline" className="bg-gray-100">Non fourni</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Télécharger un document</h3>
            
            <Tabs defaultValue="id_card" className="space-y-4">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="id_card">Identité</TabsTrigger>
                <TabsTrigger value="driver_license">Permis</TabsTrigger>
                <TabsTrigger value="proof_of_address">Domicile</TabsTrigger>
              </TabsList>
              
              <TabsContent value="id_card" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id-type">Type de document</Label>
                  <select id="id-type" className="w-full p-2 border rounded">
                    <option value="id_card">Carte d'identité</option>
                    <option value="passport">Passeport</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="id-number">Numéro du document</Label>
                  <Input
                    id="id-number"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="Ex: 123456789"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="id-expiry">Date d'expiration</Label>
                  <Input
                    id="id-expiry"
                    type="date"
                    value={docExpiryDate}
                    onChange={(e) => setDocExpiryDate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Télécharger le document (recto-verso)</Label>
                  <div className="border-2 border-dashed rounded-md p-4 text-center">
                    {uploadingDoc === 'id_card' ? (
                      <div className="space-y-2">
                        <div className="text-sm">Téléchargement en cours...</div>
                        <Progress value={uploadProgress} />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          Cliquez ou déposez un fichier ici
                        </div>
                        <Input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          className="hidden"
                          id="id-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload('id_card', file);
                            }
                          }}
                        />
                        <label htmlFor="id-upload">
                          <Button variant="outline" className="mt-2" asChild>
                            <span>Parcourir</span>
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="driver_license" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="license-number">Numéro du permis</Label>
                  <Input
                    id="license-number"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="Ex: 123456789"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="license-expiry">Date d'expiration</Label>
                  <Input
                    id="license-expiry"
                    type="date"
                    value={docExpiryDate}
                    onChange={(e) => setDocExpiryDate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Télécharger le permis (recto-verso)</Label>
                  <div className="border-2 border-dashed rounded-md p-4 text-center">
                    {uploadingDoc === 'driver_license' ? (
                      <div className="space-y-2">
                        <div className="text-sm">Téléchargement en cours...</div>
                        <Progress value={uploadProgress} />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          Cliquez ou déposez un fichier ici
                        </div>
                        <Input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          className="hidden"
                          id="license-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload('driver_license', file);
                            }
                          }}
                        />
                        <label htmlFor="license-upload">
                          <Button variant="outline" className="mt-2" asChild>
                            <span>Parcourir</span>
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="proof_of_address" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address-type">Type de justificatif</Label>
                  <select id="address-type" className="w-full p-2 border rounded">
                    <option value="utility_bill">Facture d'électricité/eau</option>
                    <option value="bank_statement">Relevé bancaire</option>
                    <option value="rent_receipt">Quittance de loyer</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address-reference">Référence du document</Label>
                  <Input
                    id="address-reference"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="Ex: Numéro de facture"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address-date">Date du document</Label>
                  <Input
                    id="address-date"
                    type="date"
                    value={docExpiryDate}
                    onChange={(e) => setDocExpiryDate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Télécharger le justificatif</Label>
                  <div className="border-2 border-dashed rounded-md p-4 text-center">
                    {uploadingDoc === 'proof_of_address' ? (
                      <div className="space-y-2">
                        <div className="text-sm">Téléchargement en cours...</div>
                        <Progress value={uploadProgress} />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          Cliquez ou déposez un fichier ici
                        </div>
                        <Input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          className="hidden"
                          id="address-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload('proof_of_address', file);
                            }
                          }}
                        />
                        <label htmlFor="address-upload">
                          <Button variant="outline" className="mt-2" asChild>
                            <span>Parcourir</span>
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Historique des documents</h3>
          
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun document téléchargé
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <FileCheck2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{getDocumentTypeName(doc.document_type)}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(doc.created_at), 'dd MMM yyyy, HH:mm')}
                      </div>
                      {doc.document_number && (
                        <div className="text-xs">
                          N°: {doc.document_number}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getVerificationStatusBadge(doc.verification_status)}
                    {doc.rejection_reason && (
                      <div className="text-xs text-red-500">
                        {doc.rejection_reason}
                      </div>
                    )}
                    <a 
                      href={doc.document_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline ml-2"
                    >
                      Voir
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" onClick={fetchDriverData}>
          Actualiser
        </Button>
      </CardFooter>
    </Card>
  );
}
