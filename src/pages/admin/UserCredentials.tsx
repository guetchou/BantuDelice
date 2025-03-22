
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockData } from '@/utils/mockData';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Navigate } from 'react-router-dom';

export default function UserCredentials() {
  const { isAuthenticated, isSuperAdmin } = useAdminAuth();

  // Seul un superadmin peut voir cette page
  if (!isAuthenticated || !isSuperAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Identifiants de test du système</CardTitle>
          <CardDescription>
            Utilisez ces identifiants pour tester les différents rôles du système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm mb-4 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 p-3 rounded-md">
            <p className="font-medium">Information importante sur la sécurité</p>
            <p>
              Ces identifiants sont uniquement à des fins de test et de développement. 
              Dans un environnement de production, n'affichez jamais les mots de passe en clair.
            </p>
          </div>

          <Table>
            <TableCaption>Liste des utilisateurs de test</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Mot de passe</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.password}</TableCell>
                  <TableCell>{user.first_name} {user.last_name}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description des rôles</CardTitle>
          <CardDescription>
            Explications des différents rôles et leurs permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <RoleBadge role="user" />
                <span className="ml-2">Utilisateur</span>
              </h3>
              <p className="text-sm">
                Les utilisateurs standard peuvent commander des repas, consulter les restaurants, 
                suivre leurs commandes et gérer leur profil.
              </p>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <RoleBadge role="restaurant_owner" />
                <span className="ml-2">Propriétaire de restaurant</span>
              </h3>
              <p className="text-sm">
                Peut gérer son restaurant, les menus, les commandes et consulter les statistiques 
                liées à son établissement.
              </p>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <RoleBadge role="driver" />
                <span className="ml-2">Livreur</span>
              </h3>
              <p className="text-sm">
                Peut visualiser et accepter des livraisons, mettre à jour le statut des commandes 
                et communiquer avec les clients.
              </p>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <RoleBadge role="admin" />
                <span className="ml-2">Administrateur</span>
              </h3>
              <p className="text-sm">
                Peut gérer les utilisateurs, les restaurants, consulter les statistiques 
                globales et modérer le contenu.
              </p>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <RoleBadge role="superadmin" />
                <span className="ml-2">Super administrateur</span>
              </h3>
              <p className="text-sm">
                Accès complet au système, peut configurer les fonctionnalités, 
                accéder aux logs et effectuer des opérations sensibles.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Composant pour afficher le badge du rôle
const RoleBadge = ({ role }: { role: string }) => {
  switch (role) {
    case 'superadmin':
      return <Badge className="bg-purple-600 hover:bg-purple-700">Super Admin</Badge>;
    case 'admin':
      return <Badge className="bg-red-600 hover:bg-red-700">Admin</Badge>;
    case 'restaurant_owner':
      return <Badge className="bg-blue-600 hover:bg-blue-700">Restaurant</Badge>;
    case 'driver':
      return <Badge className="bg-green-600 hover:bg-green-700">Livreur</Badge>;
    case 'user':
      return <Badge className="bg-slate-600 hover:bg-slate-700">Utilisateur</Badge>;
    default:
      return <Badge>{role}</Badge>;
  }
};

// Composant pour afficher le badge du statut
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-emerald-600 hover:bg-emerald-700">Actif</Badge>;
    case 'inactive':
      return <Badge className="bg-gray-600 hover:bg-gray-700">Inactif</Badge>;
    case 'pending':
      return <Badge className="bg-amber-600 hover:bg-amber-700">En attente</Badge>;
    case 'suspended':
      return <Badge className="bg-red-600 hover:bg-red-700">Suspendu</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};
