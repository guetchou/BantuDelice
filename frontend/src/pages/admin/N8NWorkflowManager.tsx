import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { n8nIntegrationService, N8NWorkflow, N8NExecution } from '@/services/n8nIntegration';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Workflow,
  Play,
  Pause,
  RefreshCw,
  Settings,
  BarChart3,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  Activity,
  any,
  Mail,
  Bell,
  Shield,
  Cpu,
  Network,
  Server,
  BadgeCheck,
  Lock
} from 'lucide-react';

const N8NWorkflowManager = () => {
  const { user, isAdmin } = useUser();
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<N8NWorkflow[]>([]);
  const [executions, setExecutions] = useState<N8NExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeTab, setActiveTab] = useState('workflows');

  // Redirection si l'utilisateur n'est pas admin
  if (!user || !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    initializeN8N();
  }, []);

  const initializeN8N = async () => {
    setLoading(true);
    try {
      // Vérifier si on est en mode démonstration
      const demoMode = n8nIntegrationService.isDemoEnvironment();
      setIsDemoMode(demoMode);

      if (!demoMode) {
        toast({
          title: "Mode Démonstration Requis",
          description: "N8N n'est disponible qu'en mode démonstration pour la gestion des données de démo.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const connected = await n8nIntegrationService.initialize();
      setIsConnected(connected);
      
      if (connected) {
        await loadWorkflows();
        await loadExecutions();
      } else {
        toast({
          title: "Connexion N8N",
          description: "N8N n'est pas accessible. Vérifiez la configuration.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation N8N:', error);
      toast({
        title: "Erreur",
        description: "Impossible de se connecter à N8N",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadWorkflows = async () => {
    try {
      // Simuler le chargement des workflows de démonstration uniquement
      const demoWorkflows: N8NWorkflow[] = [
        {
          id: 'demo-data-sync',
          name: 'Synchronisation Données de Démonstration',
          description: 'Synchronise automatiquement les données de démonstration avec les vraies tables',
          trigger: 'cron',
          status: 'active',
          executionCount: 156,
          lastExecuted: new Date().toISOString(),
          environment: 'demo',
          scope: 'demo_data_only',
          nodes: []
        },
        {
          id: 'demo-data-reports',
          name: 'Génération Rapports Hebdomadaires',
          description: 'Génère des rapports automatiques sur les données de démonstration',
          trigger: 'cron',
          status: 'active',
          executionCount: 23,
          lastExecuted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          environment: 'demo',
          scope: 'demo_data_only',
          nodes: []
        },
        {
          id: 'demo-data-validation',
          name: 'Validation Données de Démonstration',
          description: 'Valide et nettoie les données de démonstration',
          trigger: 'webhook',
          status: 'inactive',
          executionCount: 89,
          lastExecuted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          environment: 'demo',
          scope: 'demo_data_only',
          nodes: []
        }
      ];

      setWorkflows(demoWorkflows);
    } catch (error) {
      console.error('Erreur lors du chargement des workflows:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les workflows",
        variant: "destructive"
      });
    }
  };

  const loadExecutions = async () => {
    try {
      // Simuler le chargement des exécutions de démonstration uniquement
      const mockExecutions: N8NExecution[] = [
        {
          id: 'exec-1',
          workflowId: 'demo-data-sync',
          status: 'success',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          result: { syncedItems: 15, errors: 0 },
          environment: 'demo'
        },
        {
          id: 'exec-2',
          workflowId: 'demo-data-reports',
          status: 'success',
          startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString(),
          result: { reportGenerated: true, recipients: 3 },
          environment: 'demo'
        },
        {
          id: 'exec-3',
          workflowId: 'demo-data-validation',
          status: 'error',
          startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 1000).toISOString(),
          error: 'Erreur de validation des données',
          environment: 'demo'
        }
      ];

      setExecutions(mockExecutions);
    } catch (error) {
      console.error('Erreur lors du chargement des exécutions:', error);
    }
  };

  const handleCreateWorkflow = async (type: 'sync' | 'report' | 'validation') => {
    if (!isDemoMode) {
      toast({
        title: "Mode Démonstration Requis",
        description: "Création de workflows disponible uniquement en mode démonstration",
        variant: "destructive"
      });
      return;
    }

    try {
      let workflow: N8NWorkflow;

      switch (type) {
        case 'sync':
          workflow = await n8nIntegrationService.createSyncWorkflow();
          break;
        case 'report':
          workflow = await n8nIntegrationService.createReportWorkflow();
          break;
        case 'validation':
          workflow = await n8nIntegrationService.createValidationWorkflow();
          break;
        default:
          throw new Error('Type de workflow non supporté');
      }

      const success = await n8nIntegrationService.deployWorkflow(workflow);
      
      if (success) {
        setWorkflows(prev => [...prev, workflow]);
        toast({
          title: "Succès",
          description: `Workflow de démonstration "${workflow.name}" créé et déployé`
        });
      }
    } catch (error) {
      console.error('Erreur lors de la création du workflow:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le workflow de démonstration",
        variant: "destructive"
      });
    }
  };

  const handleExecuteWorkflow = async (workflowId: string) => {
    if (!isDemoMode) {
      toast({
        title: "Mode Démonstration Requis",
        description: "Exécution de workflows disponible uniquement en mode démonstration",
        variant: "destructive"
      });
      return;
    }

    try {
      const execution = await n8nIntegrationService.executeWorkflow(workflowId);
      setExecutions(prev => [execution, ...prev]);
      
      toast({
        title: "Succès",
        description: `Workflow de démonstration exécuté avec succès`
      });
    } catch (error) {
      console.error('Erreur lors de l\'exécution du workflow:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'exécuter le workflow de démonstration",
        variant: "destructive"
      });
    }
  };

  const handleToggleWorkflow = async (workflowId: string, active: boolean) => {
    if (!isDemoMode) {
      toast({
        title: "Mode Démonstration Requis",
        description: "Gestion de workflows disponible uniquement en mode démonstration",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = await n8nIntegrationService.toggleWorkflow(workflowId, active);
      
      if (success) {
        setWorkflows(prev => prev.map(w => 
          w.id === workflowId ? { ...w, status: active ? 'active' : 'inactive' } : w
        ));
        
        toast({
          title: "Succès",
          description: `Workflow de démonstration ${active ? 'activé' : 'désactivé'}`
        });
      }
    } catch (error) {
      console.error('Erreur lors du basculement du workflow:', error);
      toast({
        title: "Erreur",
        description: "Impossible de basculer le workflow de démonstration",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      error: "bg-red-100 text-red-800"
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getExecutionStatusBadge = (status: string) => {
    const variants = {
      success: "bg-green-100 text-green-800",
      error: "bg-red-100 text-red-800",
      running: "bg-blue-100 text-blue-800"
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'cron': return <Clock className="h-4 w-4" />;
      case 'webhook': return <Network className="h-4 w-4" />;
      case 'manual': return <Play className="h-4 w-4" />;
      case 'database': return <any className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full" />
      </div>
    );
  }

  if (!isDemoMode) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-6 w-6 text-orange-500" />
              Accès Restreint - Mode Démonstration Requis
            </CardTitle>
            <CardDescription>
              N8N n'est disponible qu'en mode démonstration pour la gestion des données de démonstration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600">
              <BadgeCheck className="h-5 w-5" />
              <span className="font-medium">Mode Démonstration</span>
            </div>
            <p className="text-sm text-gray-600">
              Pour accéder au gestionnaire N8N, vous devez être en mode démonstration.
              Cette restriction garantit que N8N n'est utilisé que pour gérer les données de démonstration
              et non pour les données de production.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Configuration Requise</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Variable d'environnement: <code>VITE_DEMO_MODE=true</code></li>
                <li>• Ou mode développement: <code>NODE_ENV=development</code></li>
                <li>• N8N configuré pour les données de démonstration uniquement</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestionnaire N8N - Mode Démonstration</h1>
          <p className="text-muted-foreground">
            Automatisez les processus de données de démonstration avec N8N
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-600">Mode Démonstration</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">
              {isConnected ? 'N8N Connecté' : 'N8N Déconnecté'}
            </span>
          </div>
          <Button onClick={initializeN8N} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reconnecter
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows">Workflows Démo</TabsTrigger>
          <TabsTrigger value="executions">Exécutions Démo</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Démo</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Workflows N8N - Données de Démonstration</CardTitle>
                  <CardDescription>
                    Gérez les workflows d'automatisation pour les données de démonstration uniquement
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Créer Workflow Démo
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Créer un Nouveau Workflow de Démonstration</DialogTitle>
                        <DialogDescription>
                          Choisissez le type de workflow de démonstration à créer
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 gap-4">
                        <Button 
                          onClick={() => handleCreateWorkflow('sync')}
                          className="justify-start"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Synchronisation Données Démo
                        </Button>
                        <Button 
                          onClick={() => handleCreateWorkflow('report')}
                          className="justify-start"
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Rapports Données Démo
                        </Button>
                        <Button 
                          onClick={() => handleCreateWorkflow('validation')}
                          className="justify-start"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Validation Données Démo
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
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Déclencheur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Exécutions</TableHead>
                    <TableHead>Dernière Exécution</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflows.map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <BadgeCheck className="h-4 w-4 text-orange-500" />
                          {workflow.name}
                        </div>
                      </TableCell>
                      <TableCell>{workflow.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTriggerIcon(workflow.trigger)}
                          <span className="capitalize">{workflow.trigger}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                      <TableCell>{workflow.executionCount}</TableCell>
                      <TableCell>
                        {workflow.lastExecuted 
                          ? new Date(workflow.lastExecuted).toLocaleDateString()
                          : 'Jamais'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExecuteWorkflow(workflow.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleWorkflow(workflow.id, workflow.status === 'inactive')}
                          >
                            {workflow.status === 'active' ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="executions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Exécutions - Mode Démonstration</CardTitle>
              <CardDescription>
                Suivez l'historique des exécutions de workflows de démonstration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Début</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Résultat</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {executions.map((execution) => (
                    <TableRow key={execution.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <BadgeCheck className="h-4 w-4 text-orange-500" />
                          {workflows.find(w => w.id === execution.workflowId)?.name || execution.workflowId}
                        </div>
                      </TableCell>
                      <TableCell>{getExecutionStatusBadge(execution.status)}</TableCell>
                      <TableCell>
                        {new Date(execution.startTime).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {execution.endTime 
                          ? `${Math.round((new Date(execution.endTime).getTime() - new Date(execution.startTime).getTime()) / 1000)}s`
                          : 'En cours'
                        }
                      </TableCell>
                      <TableCell>
                        {execution.status === 'success' ? (
                          <span className="text-green-600">Succès</span>
                        ) : execution.status === 'error' ? (
                          <span className="text-red-600">{execution.error}</span>
                        ) : (
                          <span className="text-blue-600">En cours</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-orange-500" />
                  Workflows Démo Actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {workflows.filter(w => w.status === 'active').length}
                </div>
                <p className="text-muted-foreground">
                  sur {workflows.length} workflows de démonstration
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Exécutions Démo Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {workflows.reduce((sum, w) => sum + w.executionCount, 0)}
                </div>
                <p className="text-muted-foreground">
                  exécutions de démonstration réussies
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Taux de Réussite Démo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  98.5%
                </div>
                <p className="text-muted-foreground">
                  des exécutions de démonstration réussies
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance des Workflows de Démonstration</CardTitle>
              <CardDescription>
                Temps d'exécution moyen par workflow de démonstration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-orange-500" />
                      <span>{workflow.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {workflow.executionCount} exécutions
                      </span>
                      <span className="text-sm font-medium">
                        ~2.3s moyenne
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default N8NWorkflowManager; 