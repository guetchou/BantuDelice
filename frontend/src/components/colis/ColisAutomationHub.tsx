import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  Pause, 
  Settings,
  Calendar,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Globe,
  Shield,
  any,
  Cpu,
  Activity,
  TrendingUp,
  Users,
  Package,
  Truck,
  MapPin,
  DollarSign,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  RefreshCw
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  type: 'notification' | 'routing' | 'pricing' | 'scheduling' | 'quality' | 'reporting';
  status: 'active' | 'paused' | 'draft';
  triggers: string[];
  actions: string[];
  conditions: string[];
  lastExecuted?: string;
  executionCount: number;
  successRate: number;
  enabled: boolean;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  steps: number;
  status: 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  startTime: string;
  estimatedCompletion: string;
  currentStep: string;
}

const ColisAutomationHub: React.FC = () => {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: 'auto-notification',
      name: 'Notifications Automatiques',
      description: 'Envoi automatique de notifications selon le statut du colis',
      type: 'notification',
      status: 'active',
      triggers: ['Status Change', 'Location Update'],
      actions: ['Send SMS', 'Send Email', 'Push Notification'],
      conditions: ['Delivery Time > 24h', 'Customer Priority = High'],
      lastExecuted: '2024-01-15T10:30:00Z',
      executionCount: 1247,
      successRate: 98.5,
      enabled: true
    },
    {
      id: 'smart-routing',
      name: 'Routage Intelligent',
      description: 'Optimisation automatique des routes selon le trafic et la météo',
      type: 'routing',
      status: 'active',
      triggers: ['Traffic Update', 'Weather Alert'],
      actions: ['Recalculate Route', 'Notify Driver'],
      conditions: ['Delay > 30min', 'Alternative Route Available'],
      lastExecuted: '2024-01-15T09:15:00Z',
      executionCount: 892,
      successRate: 94.2,
      enabled: true
    },
    {
      id: 'dynamic-pricing',
      name: 'Tarification Dynamique',
      description: 'Ajustement automatique des prix selon la demande et la capacité',
      type: 'pricing',
      status: 'active',
      triggers: ['High Demand', 'Low Capacity'],
      actions: ['Update Pricing', 'Notify Customers'],
      conditions: ['Demand > 120%', 'Capacity < 80%'],
      lastExecuted: '2024-01-15T08:45:00Z',
      executionCount: 156,
      successRate: 96.8,
      enabled: true
    },
    {
      id: 'quality-control',
      name: 'Contrôle Qualité Automatique',
      description: 'Vérification automatique de la qualité des colis',
      type: 'quality',
      status: 'paused',
      triggers: ['Package Received', 'Before Delivery'],
      actions: ['Quality Check', 'Generate Report'],
      conditions: ['Package Value > 50000', 'Fragile Items'],
      lastExecuted: '2024-01-14T16:20:00Z',
      executionCount: 445,
      successRate: 99.1,
      enabled: false
    },
    {
      id: 'auto-scheduling',
      name: 'Planification Automatique',
      description: 'Planification intelligente des livraisons',
      type: 'scheduling',
      status: 'active',
      triggers: ['New Order', 'Driver Available'],
      actions: ['Assign Driver', 'Update Schedule'],
      conditions: ['Driver Capacity > 0', 'Route Optimization'],
      lastExecuted: '2024-01-15T11:00:00Z',
      executionCount: 2341,
      successRate: 97.3,
      enabled: true
    },
    {
      id: 'auto-reporting',
      name: 'Rapports Automatiques',
      description: 'Génération automatique de rapports quotidiens',
      type: 'reporting',
      status: 'active',
      triggers: ['Daily Schedule', 'End of Day'],
      actions: ['Generate Report', 'Send to Management'],
      conditions: ['Data Available', 'Business Hours'],
      lastExecuted: '2024-01-15T00:00:00Z',
      executionCount: 15,
      successRate: 100,
      enabled: true
    }
  ]);

  const [activeWorkflows, setActiveWorkflows] = useState<AutomationWorkflow[]>([
    {
      id: 'workflow-1',
      name: 'Traitement des Commandes Express',
      description: 'Workflow pour le traitement automatique des commandes express',
      steps: 8,
      status: 'running',
      progress: 65,
      startTime: '2024-01-15T10:00:00Z',
      estimatedCompletion: '2024-01-15T10:45:00Z',
      currentStep: 'Validation des documents'
    },
    {
      id: 'workflow-2',
      name: 'Optimisation des Routes',
      description: 'Recalcul automatique des routes optimales',
      steps: 5,
      status: 'completed',
      progress: 100,
      startTime: '2024-01-15T09:30:00Z',
      estimatedCompletion: '2024-01-15T09:45:00Z',
      currentStep: 'Terminé'
    }
  ]);

  const [selectedRule, setSelectedRule] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const automationTypes = [
    { id: 'all', name: 'Toutes', icon: <Bot className="h-4 w-4" /> },
    { id: 'notification', name: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'routing', name: 'Routage', icon: <MapPin className="h-4 w-4" /> },
    { id: 'pricing', name: 'Tarification', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'scheduling', name: 'Planification', icon: <Calendar className="h-4 w-4" /> },
    { id: 'quality', name: 'Qualité', icon: <Shield className="h-4 w-4" /> },
    { id: 'reporting', name: 'Rapports', icon: <BarChart3 className="h-4 w-4" /> }
  ];

  const filteredRules = automationRules.filter(rule => {
    const matchesType = selectedRule === 'all' || rule.type === selectedRule;
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const toggleRule = (ruleId: string) => {
    setAutomationRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, enabled: !rule.enabled, status: !rule.enabled ? 'active' : 'paused' }
        : rule
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Actif</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800"><Pause className="h-3 w-3 mr-1" />Pause</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800"><Edit className="h-3 w-3 mr-1" />Brouillon</Badge>;
      default:
        return null;
    }
  };

  const getWorkflowStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800"><Activity className="h-3 w-3 mr-1" />En cours</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Terminé</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Échec</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800"><Pause className="h-3 w-3 mr-1" />Pause</Badge>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    const automationType = automationTypes.find(t => t.id === type);
    return automationType?.icon || <Bot className="h-4 w-4" />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Hub d'Automatisation</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Automatisez vos processus de livraison avec des règles intelligentes 
          et des workflows personnalisés pour optimiser l'efficacité.
        </p>
      </div>

      {/* Statistiques d'automatisation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Règles Actives</p>
                <p className="text-2xl font-bold text-blue-900">
                  {automationRules.filter(r => r.enabled).length}/{automationRules.length}
                </p>
              </div>
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Exécutions Aujourd'hui</p>
                <p className="text-2xl font-bold text-green-900">5,234</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Taux de Réussite</p>
                <p className="text-2xl font-bold text-purple-900">97.8%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Temps Économisé</p>
                <p className="text-2xl font-bold text-orange-900">-42%</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rules">Règles d'Automatisation</TabsTrigger>
          <TabsTrigger value="workflows">Workflows Actifs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          {/* Filtres et recherche */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex gap-4">
              <Input
                placeholder="Rechercher une règle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={selectedRule} onValueChange={setSelectedRule}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {automationTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        {type.icon}
                        {type.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle Règle
            </Button>
          </div>

          {/* Liste des règles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRules.map((rule) => (
              <Card key={rule.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getTypeIcon(rule.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{rule.name}</CardTitle>
                        {getStatusBadge(rule.status)}
                      </div>
                    </div>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">{rule.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Déclencheurs</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.triggers.map((trigger, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Actions</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.actions.map((action, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Conditions</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.conditions.map((condition, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm text-gray-500">Exécutions</p>
                      <p className="font-semibold">{rule.executionCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Taux de réussite</p>
                      <p className="font-semibold">{rule.successRate}%</p>
                    </div>
                  </div>

                  {rule.lastExecuted && (
                    <div className="text-xs text-gray-500">
                      Dernière exécution: {new Date(rule.lastExecuted).toLocaleString()}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Détails
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Tester
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <div className="space-y-4">
            {activeWorkflows.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <p className="text-sm text-gray-600">{workflow.description}</p>
                    </div>
                    {getWorkflowStatusBadge(workflow.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Progression</p>
                      <div className="flex items-center gap-2">
                        <Progress value={workflow.progress} className="flex-1" />
                        <span className="text-sm font-medium">{workflow.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Étape actuelle</p>
                      <p className="font-medium">{workflow.currentStep}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Étapes</p>
                      <p className="font-medium">{workflow.steps} étapes</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Début</p>
                      <p className="font-medium">{new Date(workflow.startTime).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fin estimée</p>
                      <p className="font-medium">{new Date(workflow.estimatedCompletion).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Suivre
                    </Button>
                    {workflow.status === 'running' && (
                      <Button size="sm" variant="outline">
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-1" />
                      Configurer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {activeWorkflows.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Bot className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun workflow actif</h3>
                <p className="text-gray-600 mb-4">
                  Créez votre premier workflow d'automatisation pour commencer.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un Workflow
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance des automations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance des Automations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automationRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(rule.type)}
                        <div>
                          <p className="font-medium">{rule.name}</p>
                          <p className="text-sm text-gray-500">{rule.executionCount} exécutions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{rule.successRate}%</p>
                        <p className="text-sm text-gray-500">Réussite</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Économies réalisées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Économies Réalisées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">-35%</div>
                      <p className="text-sm text-green-700">Temps de traitement</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">-28%</div>
                      <p className="text-sm text-blue-700">Coûts opérationnels</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">+42%</div>
                      <p className="text-sm text-purple-700">Efficacité</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">+18%</div>
                      <p className="text-sm text-orange-700">Satisfaction client</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommandations d'optimisation */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Recommandations d'Optimisation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Automatiser les Notifications</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Créez des règles pour automatiser les notifications client 
                    et améliorer la satisfaction de 15%.
                  </p>
                  <Button size="sm" variant="outline">Implémenter</Button>
                </div>
                
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Optimisation des Routes</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Activez l'optimisation automatique des routes pour 
                    réduire les coûts de carburant de 20%.
                  </p>
                  <Button size="sm" variant="outline">Activer</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColisAutomationHub; 