import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { demoDataService, DemoData } from '@/services/demoDataService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Database,
  Plus,
  Edit,
  Trash2,
  Users,
  Utensils,
  ShoppingBag,
  Car,
  Star,
  DollarSign,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Archive,
  Settings,
  Play,
  Pause
} from 'lucide-react';

const DemoDataManager = () => {
  const { user, isAdmin } = useUser();
  const { toast } = useToast();
  const [demoData, setDemoData] = useState<DemoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DemoData | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [syncing, setSyncing] = useState(false);

  // Redirection si l'utilisateur n'est pas admin
  if (!user || !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = async () => {
    setLoading(true);
    try {
      // Initialiser la table si nécessaire
      await demoDataService.initializeTable();
      
      // Charger les données depuis le service
      const data = await demoDataService.loadAllDemoData();
      setDemoData(data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de démonstration",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDemoData = async () => {
    try {
      const newItem = await demoDataService.createDemoData({
        type: formData.type,
        name: formData.name,
        description: formData.description,
        status: 'active',
        data: formData.data || {}
      });

      if (newItem) {
        setDemoData(prev => [newItem, ...prev]);
        setIsCreateDialogOpen(false);
        setFormData({});

        toast({
          title: "Succès",
          description: "Données de démonstration créées avec succès"
        });
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer les données de démonstration",
        variant: "destructive"
      });
    }
  };

  const handleEditDemoData = async () => {
    if (!editingItem) return;

    try {
      const updatedItem = await demoDataService.updateDemoData(editingItem.id, {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        data: formData.data || editingItem.data
      });

      if (updatedItem) {
        setDemoData(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        setIsEditDialogOpen(false);
        setEditingItem(null);
        setFormData({});

        toast({
          title: "Succès",
          description: "Données de démonstration mises à jour"
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les données",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDemoData = async (id: string) => {
    try {
      const success = await demoDataService.deleteDemoData(id);
      
      if (success) {
        setDemoData(prev => prev.filter(item => item.id !== id));
        toast({
          title: "Succès",
          description: "Données de démonstration supprimées"
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les données",
        variant: "destructive"
      });
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    try {
      const selectedIds = demoData.map(item => item.id);
      let success = false;

      switch (action) {
        case 'activate':
          success = await demoDataService.bulkUpdateStatus(selectedIds, 'active');
          if (success) {
            setDemoData(prev => prev.map(item => ({ ...item, status: 'active' })));
          }
          break;
        case 'deactivate':
          success = await demoDataService.bulkUpdateStatus(selectedIds, 'inactive');
          if (success) {
            setDemoData(prev => prev.map(item => ({ ...item, status: 'inactive' })));
          }
          break;
        case 'delete':
          success = await demoDataService.bulkDelete(selectedIds);
          if (success) {
            setDemoData([]);
          }
          break;
      }

      if (success) {
        toast({
          title: "Succès",
          description: `Action en masse "${action}" effectuée`
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'action en masse:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer l'action en masse",
        variant: "destructive"
      });
    }
  };

  const handleSyncWithRealTables = async () => {
    setSyncing(true);
    try {
      const success = await demoDataService.syncWithRealTables();
      
      if (success) {
        toast({
          title: "Succès",
          description: "Données synchronisées avec les vraies tables"
        });
      } else {
        toast({
          title: "Erreur",
          description: "Erreur lors de la synchronisation",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de synchroniser les données",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleInsertPreconfiguredData = async () => {
    try {
      const success = await demoDataService.insertPreconfiguredData();
      
      if (success) {
        await loadDemoData(); // Recharger les données
        toast({
          title: "Succès",
          description: "Données pré-configurées insérées"
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'insertion:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'insérer les données pré-configurées",
        variant: "destructive"
      });
    }
  };

  const filteredData = demoData.filter(item => 
    selectedType === 'all' || item.type === selectedType
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'restaurant': return <Utensils className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      case 'order': return <ShoppingBag className="h-4 w-4" />;
      case 'driver': return <Car className="h-4 w-4" />;
      case 'review': return <Star className="h-4 w-4" />;
      case 'promotion': return <DollarSign className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800"
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestionnaire de Données de Démonstration</h1>
          <p className="text-muted-foreground">
            Gérez les données de démonstration inspirées d'Odoo avec connexion backend réelle
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleInsertPreconfiguredData} variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Insérer Données Pré-configurées
          </Button>
          <Button onClick={handleSyncWithRealTables} disabled={syncing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Synchronisation...' : 'Synchroniser'}
          </Button>
          <Button onClick={() => handleBulkAction('activate')} variant="outline">
            <CheckCircle className="h-4 w-4 mr-2" />
            Activer Tout
          </Button>
          <Button onClick={() => handleBulkAction('deactivate')} variant="outline">
            <XCircle className="h-4 w-4 mr-2" />
            Désactiver Tout
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer Tout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action supprimera définitivement toutes les données de démonstration.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleBulkAction('delete')}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Données de Démonstration</CardTitle>
              <CardDescription>
                {filteredData.length} éléments trouvés - Connecté au backend Supabase
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="restaurant">Restaurants</SelectItem>
                  <SelectItem value="user">Utilisateurs</SelectItem>
                  <SelectItem value="order">Commandes</SelectItem>
                  <SelectItem value="driver">Livreurs</SelectItem>
                  <SelectItem value="review">Avis</SelectItem>
                  <SelectItem value="promotion">Promotions</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Créer des Données de Démonstration</DialogTitle>
                    <DialogDescription>
                      Ajoutez de nouvelles données de démonstration au système
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="user">Utilisateur</SelectItem>
                          <SelectItem value="order">Commande</SelectItem>
                          <SelectItem value="driver">Livreur</SelectItem>
                          <SelectItem value="review">Avis</SelectItem>
                          <SelectItem value="promotion">Promotion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Nom</label>
                      <Input
                        value={formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Nom de l'élément"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Description de l'élément"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleCreateDemoData}>
                      Créer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <span className="capitalize">{item.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingItem(item);
                          setFormData(item);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer l'élément</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer "{item.name}" ?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteDemoData(item.id)}>
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier les Données de Démonstration</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'élément sélectionné
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nom</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nom de l'élément"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description de l'élément"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Statut</label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditDemoData}>
              Mettre à jour
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DemoDataManager; 