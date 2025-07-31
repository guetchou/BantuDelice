import { supabase } from '@/lib/supabase';

export interface N8NWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: 'manual' | 'cron' | 'webhook' | 'database';
  nodes: N8NNode[];
  status: 'active' | 'inactive' | 'error';
  lastExecuted?: string;
  executionCount: number;
  environment: 'demo' | 'production'; // Nouveau champ pour limiter l'environnement
  scope: 'demo_data_only'; // Nouveau champ pour définir le scope
}

export interface N8NNode {
  id: string;
  type: 'supabase' | 'http' | 'email' | 'notification' | 'transform' | 'condition';
  operation: string;
  config: any;
  position: { x: number; y: number };
}

export interface N8NExecution {
  id: string;
  workflowId: string;
  status: 'success' | 'error' | 'running';
  startTime: string;
  endTime?: string;
  result?: any;
  error?: string;
  environment: 'demo' | 'production';
}

class N8NIntegrationService {
  private baseUrl: string;
  private apiKey: string;
  private isDemoMode: boolean;

  constructor() {
    this.baseUrl = import.meta.env.VITE_N8N_URL || 'http://localhost:5678';
    this.apiKey = import.meta.env.VITE_N8N_API_KEY || '';
    // Vérifier si on est en mode démonstration
    this.isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true' || 
                      import.meta.env.NODE_ENV === 'development';
  }

  // Vérifier si N8N est disponible pour la démonstration
  async isAvailableForDemo(): Promise<boolean> {
    if (!this.isDemoMode) {
      console.warn('N8N n\'est disponible qu\'en mode démonstration');
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/health`, {
        headers: {
          'X-N8N-API-KEY': this.apiKey
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('N8N non accessible:', error);
      return false;
    }
  }

  // Initialiser la connexion N8N (uniquement pour démo)
  async initialize() {
    if (!this.isDemoMode) {
      throw new Error('N8N n\'est disponible qu\'en mode démonstration');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/health`, {
        headers: {
          'X-N8N-API-KEY': this.apiKey
        }
      });
      
      if (!response.ok) {
        throw new Error('N8N non accessible');
      }
      
      return true;
    } catch (error) {
      console.error('Erreur de connexion N8N:', error);
      return false;
    }
  }

  // Créer un workflow de synchronisation automatique (démo uniquement)
  async createSyncWorkflow(): Promise<N8NWorkflow> {
    if (!this.isDemoMode) {
      throw new Error('Workflows N8N disponibles uniquement en mode démonstration');
    }

    const workflow: N8NWorkflow = {
      id: 'demo-data-sync',
      name: 'Synchronisation Données de Démonstration',
      description: 'Synchronise automatiquement les données de démonstration avec les vraies tables',
      trigger: 'cron',
      status: 'active',
      executionCount: 0,
      environment: 'demo',
      scope: 'demo_data_only',
      nodes: [
        {
          id: 'trigger',
          type: 'cron',
          operation: 'schedule',
          config: {
            cronExpression: '0 */6 * * *', // Toutes les 6 heures
            timezone: 'Africa/Brazzaville'
          },
          position: { x: 100, y: 100 }
        },
        {
          id: 'read-demo-data',
          type: 'supabase',
          operation: 'read',
          config: {
            table: 'demo_data',
            filters: { status: 'active' },
            limit: 100
          },
          position: { x: 300, y: 100 }
        },
        {
          id: 'sync-restaurants',
          type: 'supabase',
          operation: 'upsert',
          config: {
            table: 'restaurants',
            conflictResolution: 'name',
            mapping: {
              'data.name': 'name',
              'data.description': 'description',
              'data.cuisine_type': 'cuisine_type',
              'data.address': 'address',
              'data.phone': 'phone',
              'data.email': 'email',
              'data.image_url': 'image_url',
              'data.latitude': 'latitude',
              'data.longitude': 'longitude',
              'data.delivery_radius': 'delivery_radius',
              'data.min_order_amount': 'min_order_amount',
              'data.avg_preparation_time': 'avg_preparation_time',
              'data.is_open': 'is_open',
              'data.opening_hours': 'opening_hours'
            }
          },
          position: { x: 500, y: 50 }
        },
        {
          id: 'sync-users',
          type: 'supabase',
          operation: 'upsert',
          config: {
            table: 'users',
            conflictResolution: 'email',
            mapping: {
              'data.email': 'email',
              'data.first_name': 'first_name',
              'data.last_name': 'last_name',
              'data.phone': 'phone',
              'data.role': 'role'
            }
          },
          position: { x: 500, y: 150 }
        },
        {
          id: 'sync-drivers',
          type: 'supabase',
          operation: 'upsert',
          config: {
            table: 'delivery_drivers',
            conflictResolution: 'email',
            mapping: {
              'data.name': 'name',
              'data.phone': 'phone',
              'data.email': 'email',
              'data.vehicle_type': 'vehicle_type',
              'data.status': 'status',
              'data.current_latitude': 'current_latitude',
              'data.current_longitude': 'current_longitude',
              'data.average_rating': 'average_rating',
              'data.total_deliveries': 'total_deliveries'
            }
          },
          position: { x: 500, y: 250 }
        },
        {
          id: 'notification',
          type: 'notification',
          operation: 'send',
          config: {
            channel: 'email',
            recipients: ['admin@bantudelice.com'],
            subject: 'Synchronisation Données de Démonstration',
            template: 'sync-completed'
          },
          position: { x: 700, y: 150 }
        }
      ]
    };

    return workflow;
  }

  // Créer un workflow de génération de rapports (démo uniquement)
  async createReportWorkflow(): Promise<N8NWorkflow> {
    if (!this.isDemoMode) {
      throw new Error('Workflows N8N disponibles uniquement en mode démonstration');
    }

    const workflow: N8NWorkflow = {
      id: 'demo-data-reports',
      name: 'Génération Rapports Données de Démonstration',
      description: 'Génère des rapports automatiques sur les données de démonstration',
      trigger: 'cron',
      status: 'active',
      executionCount: 0,
      environment: 'demo',
      scope: 'demo_data_only',
      nodes: [
        {
          id: 'trigger',
          type: 'cron',
          operation: 'schedule',
          config: {
            cronExpression: '0 9 * * 1', // Tous les lundis à 9h
            timezone: 'Africa/Brazzaville'
          },
          position: { x: 100, y: 100 }
        },
        {
          id: 'collect-data',
          type: 'supabase',
          operation: 'aggregate',
          config: {
            queries: [
              {
                name: 'restaurants_count',
                query: 'SELECT COUNT(*) FROM demo_data WHERE type = \'restaurant\' AND status = \'active\''
              },
              {
                name: 'users_count',
                query: 'SELECT COUNT(*) FROM demo_data WHERE type = \'user\' AND status = \'active\''
              },
              {
                name: 'drivers_count',
                query: 'SELECT COUNT(*) FROM demo_data WHERE type = \'driver\' AND status = \'active\''
              },
              {
                name: 'promotions_count',
                query: 'SELECT COUNT(*) FROM demo_data WHERE type = \'promotion\' AND status = \'active\''
              }
            ]
          },
          position: { x: 300, y: 100 }
        },
        {
          id: 'generate-report',
          type: 'transform',
          operation: 'create_report',
          config: {
            template: 'weekly-demo-report',
            format: 'html',
            includeCharts: true
          },
          position: { x: 500, y: 100 }
        },
        {
          id: 'send-email',
          type: 'email',
          operation: 'send',
          config: {
            to: ['admin@bantudelice.com', 'manager@bantudelice.com'],
            subject: 'Rapport Hebdomadaire - Données de Démonstration',
            html: true
          },
          position: { x: 700, y: 100 }
        },
        {
          id: 'slack-notification',
          type: 'notification',
          operation: 'slack',
          config: {
            channel: '#admin-reports',
            message: 'Rapport hebdomadaire des données de démonstration envoyé'
          },
          position: { x: 700, y: 200 }
        }
      ]
    };

    return workflow;
  }

  // Créer un workflow de validation des données (démo uniquement)
  async createValidationWorkflow(): Promise<N8NWorkflow> {
    if (!this.isDemoMode) {
      throw new Error('Workflows N8N disponibles uniquement en mode démonstration');
    }

    const workflow: N8NWorkflow = {
      id: 'demo-data-validation',
      name: 'Validation Données de Démonstration',
      description: 'Valide et nettoie les données de démonstration',
      trigger: 'webhook',
      status: 'active',
      executionCount: 0,
      environment: 'demo',
      scope: 'demo_data_only',
      nodes: [
        {
          id: 'webhook',
          type: 'webhook',
          operation: 'receive',
          config: {
            path: '/demo-data-validation',
            method: 'POST'
          },
          position: { x: 100, y: 100 }
        },
        {
          id: 'validate-data',
          type: 'transform',
          operation: 'validate',
          config: {
            rules: [
              { field: 'name', required: true, minLength: 2 },
              { field: 'type', allowedValues: ['restaurant', 'user', 'order', 'driver', 'review', 'promotion'] },
              { field: 'status', allowedValues: ['active', 'inactive', 'pending'] },
              { field: 'data', required: true, type: 'object' }
            ]
          },
          position: { x: 300, y: 100 }
        },
        {
          id: 'clean-data',
          type: 'transform',
          operation: 'clean',
          config: {
            operations: [
              { field: 'name', operation: 'trim' },
              { field: 'description', operation: 'trim' },
              { field: 'data.email', operation: 'lowercase' },
              { field: 'data.phone', operation: 'format_phone' }
            ]
          },
          position: { x: 500, y: 100 }
        },
        {
          id: 'update-status',
          type: 'supabase',
          operation: 'update',
          config: {
            table: 'demo_data',
            where: { id: '{{$json.id}}' },
            data: {
              status: 'active',
              updated_at: '{{$now}}'
            }
          },
          position: { x: 700, y: 100 }
        },
        {
          id: 'notification',
          type: 'notification',
          operation: 'send',
          config: {
            channel: 'email',
            recipients: ['admin@bantudelice.com'],
            subject: 'Données de Démonstration Validées',
            message: 'Les données de démonstration ont été validées et mises à jour'
          },
          position: { x: 900, y: 100 }
        }
      ]
    };

    return workflow;
  }

  // Déployer un workflow sur N8N (démo uniquement)
  async deployWorkflow(workflow: N8NWorkflow): Promise<boolean> {
    if (!this.isDemoMode) {
      throw new Error('Déploiement de workflows N8N disponible uniquement en mode démonstration');
    }

    // Vérifier que le workflow est bien pour la démo
    if (workflow.environment !== 'demo' || workflow.scope !== 'demo_data_only') {
      throw new Error('Seuls les workflows de démonstration sont autorisés');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey
        },
        body: JSON.stringify(workflow)
      });

      if (!response.ok) {
        throw new Error(`Erreur de déploiement: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Erreur lors du déploiement du workflow:', error);
      return false;
    }
  }

  // Exécuter un workflow manuellement (démo uniquement)
  async executeWorkflow(workflowId: string, data?: any): Promise<N8NExecution> {
    if (!this.isDemoMode) {
      throw new Error('Exécution de workflows N8N disponible uniquement en mode démonstration');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey
        },
        body: JSON.stringify({ data })
      });

      if (!response.ok) {
        throw new Error(`Erreur d'exécution: ${response.statusText}`);
      }

      const execution: N8NExecution = await response.json();
      return { ...execution, environment: 'demo' };
    } catch (error) {
      console.error('Erreur lors de l\'exécution du workflow:', error);
      throw error;
    }
  }

  // Obtenir le statut d'un workflow (démo uniquement)
  async getWorkflowStatus(workflowId: string): Promise<N8NWorkflow> {
    if (!this.isDemoMode) {
      throw new Error('Accès aux workflows N8N disponible uniquement en mode démonstration');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}`, {
        headers: {
          'X-N8N-API-KEY': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur de récupération: ${response.statusText}`);
      }

      const workflow: N8NWorkflow = await response.json();
      
      // Vérifier que le workflow est bien pour la démo
      if (workflow.environment !== 'demo' || workflow.scope !== 'demo_data_only') {
        throw new Error('Accès non autorisé à ce workflow');
      }

      return workflow;
    } catch (error) {
      console.error('Erreur lors de la récupération du workflow:', error);
      throw error;
    }
  }

  // Obtenir l'historique des exécutions (démo uniquement)
  async getExecutionHistory(workflowId: string): Promise<N8NExecution[]> {
    if (!this.isDemoMode) {
      throw new Error('Accès à l\'historique N8N disponible uniquement en mode démonstration');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}/executions`, {
        headers: {
          'X-N8N-API-KEY': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur de récupération: ${response.statusText}`);
      }

      const executions: N8NExecution[] = await response.json();
      return executions.filter(exec => exec.environment === 'demo');
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  }

  // Activer/Désactiver un workflow (démo uniquement)
  async toggleWorkflow(workflowId: string, active: boolean): Promise<boolean> {
    if (!this.isDemoMode) {
      throw new Error('Gestion des workflows N8N disponible uniquement en mode démonstration');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey
        },
        body: JSON.stringify({ active })
      });

      if (!response.ok) {
        throw new Error(`Erreur de basculement: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Erreur lors du basculement du workflow:', error);
      return false;
    }
  }

  // Créer un webhook pour déclencher des workflows (démo uniquement)
  async createWebhook(workflowId: string, path: string): Promise<string> {
    if (!this.isDemoMode) {
      throw new Error('Création de webhooks N8N disponible uniquement en mode démonstration');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/webhooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey
        },
        body: JSON.stringify({
          workflowId,
          path,
          method: 'POST',
          environment: 'demo'
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur de création du webhook: ${response.statusText}`);
      }

      const webhook = await response.json();
      return webhook.url;
    } catch (error) {
      console.error('Erreur lors de la création du webhook:', error);
      throw error;
    }
  }

  // Méthode pour vérifier si on est en mode démonstration
  isDemoEnvironment(): boolean {
    return this.isDemoMode;
  }

  // Méthode pour obtenir les statistiques de démonstration uniquement
  async getDemoStatistics(): Promise<any> {
    if (!this.isDemoMode) {
      return {
        available: false,
        message: 'N8N disponible uniquement en mode démonstration'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/stats`, {
        headers: {
          'X-N8N-API-KEY': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error('Impossible de récupérer les statistiques');
      }

      const stats = await response.json();
      return {
        available: true,
        demoWorkflows: stats.workflows?.filter((w: any) => w.environment === 'demo') || [],
        demoExecutions: stats.executions?.filter((e: any) => e.environment === 'demo') || [],
        totalDemoExecutions: stats.executions?.filter((e: any) => e.environment === 'demo').length || 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        available: false,
        error: error.message
      };
    }
  }
}

export const n8nIntegrationService = new N8NIntegrationService(); 