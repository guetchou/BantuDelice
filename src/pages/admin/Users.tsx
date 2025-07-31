
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger 
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { userService } from '@/services/userService';
import { User, UserCreateRequest, UserRole, UserStatus, UserUpdateRequest } from '@/types/user';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { 
  UserPlus, MoreVertical, Pencil, Trash2, Search, UserCheck, UserX, Shield, RefreshCw
} from 'lucide-react';

export default function UsersPage() {
  const { user: currentUser, isSuperAdmin } = useAdminAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // État pour le dialogue de création/édition d'utilisateur
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Formulaire
  const [formData, setFormData] = useState<UserCreateRequest>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'user',
    phone: ''
  });

  // Chargement des utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error("Erreur lors du chargement des utilisateurs");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Gestion du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as UserRole
    });
  };

  // Ouverture du dialogue en mode création
  const openCreateDialog = () => {
    setIsEditMode(false);
    setSelectedUser(null);
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: 'user',
      phone: ''
    });
    setIsDialogOpen(true);
  };

  // Ouverture du dialogue en mode édition
  const openEditDialog = (user: User) => {
    setIsEditMode(true);
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: '', // Ne pas remplir le mot de passe en mode édition
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      role: user.role,
      phone: user.phone || ''
    });
    setIsDialogOpen(true);
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditMode && selectedUser) {
        // Mode édition
        const updateData: UserUpdateRequest = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone
        };
        
        // Seul un superadmin peut changer le rôle
        if (isSuperAdmin) {
          updateData.role = formData.role;
        }
        
        const updatedUser = await userService.updateUser(selectedUser.id, updateData);
        if (updatedUser) {
          setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
          toast.success("Utilisateur mis à jour avec succès");
          setIsDialogOpen(false);
        }
      } else {
        // Mode création
        if (!formData.password) {
          toast.error("Le mot de passe est requis");
          return;
        }
        
        const newUser = await userService.createUser(formData);
        setUsers([...users, newUser]);
        toast.success("Utilisateur créé avec succès");
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error("Erreur lors de l'enregistrement de l'utilisateur");
    }
  };

  // Supprimer un utilisateur
  const handleDelete = async (userId: string) => {
    if (userId === currentUser?.id) {
      toast.error("Vous ne pouvez pas supprimer votre propre compte");
      return;
    }
    
    try {
      const success = await userService.deleteUser(userId);
      if (success) {
        setUsers(users.filter(u => u.id !== userId));
        toast.success("Utilisateur supprimé avec succès");
      } else {
        toast.error("Erreur lors de la suppression de l'utilisateur");
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  // Changer le statut d'un utilisateur
  const handleStatusChange = async (userId: string, status: UserStatus) => {
    try {
      const updatedUser = await userService.updateUser(userId, { status });
      if (updatedUser) {
        setUsers(users.map(u => u.id === userId ? updatedUser : u));
        toast.success(`Utilisateur ${status === 'active' ? 'activé' : 'désactivé'} avec succès`);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  // Rendu du badge de rôle
  const renderRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'superadmin':
        return <Badge className="bg-purple-600 hover:bg-purple-700">Super Admin</Badge>;
      case 'admin':
        return <Badge className="bg-red-600 hover:bg-red-700">Admin</Badge>;
      case 'restaurant_owner':
        return <Badge className="bg-blue-600 hover:bg-blue-700">Restaurant</Badge>;
      case 'driver':
        return <Badge className="bg-green-600 hover:bg-green-700">Chauffeur</Badge>;
      default:
        return <Badge className="bg-gray-600 hover:bg-gray-700">Utilisateur</Badge>;
    }
  };

  // Rendu du badge de statut
  const renderStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600 hover:bg-green-700">Actif</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-600 hover:bg-gray-700">Inactif</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">En attente</Badge>;
      case 'suspended':
        return <Badge className="bg-red-600 hover:bg-red-700">Suspendu</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
        <Button onClick={openCreateDialog}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nouvel utilisateur
        </Button>
      </div>

      <div className="bg-card rounded-md shadow">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="user">Utilisateur</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="superadmin">Super Admin</SelectItem>
                <SelectItem value="restaurant_owner">Restaurant</SelectItem>
                <SelectItem value="driver">Chauffeur</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Aucun utilisateur trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.first_name} {user.last_name}
                        </TableCell>
                        <TableCell>{renderRoleBadge(user.role)}</TableCell>
                        <TableCell>{renderStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {user.last_login 
                            ? new Date(user.last_login).toLocaleDateString() 
                            : 'Jamais connecté'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              
                              {user.status === 'active' ? (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'inactive')}>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Désactiver
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activer
                                </DropdownMenuItem>
                              )}
                              
                              {isSuperAdmin && user.id !== currentUser?.id && (
                                <DropdownMenuItem onClick={() => handleDelete(user.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Dialogue création/édition utilisateur */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="first_name" className="text-sm font-medium">Prénom</label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last_name" className="text-sm font-medium">Nom</label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly={isEditMode} // Email non modifiable en mode édition
                  className={isEditMode ? "bg-gray-100" : ""}
                  required
                />
              </div>
              
              {!isEditMode && (
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!isEditMode}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Téléphone</label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              {/* Seulement les superadmins peuvent changer le rôle */}
              {isSuperAdmin && (
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">Rôle</label>
                  <Select
                    value={formData.role}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Utilisateur</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                      <SelectItem value="restaurant_owner">Restaurant</SelectItem>
                      <SelectItem value="driver">Chauffeur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {isEditMode ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
