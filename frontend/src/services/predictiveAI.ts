import apiService from './api';

// Types pour l'IA prédictive
export interface DemandPrediction {
  date: string;
  predictedOrders: number;
  confidence: number;
  factors: {
    weather: number;
    events: number;
    historical: number;
    seasonality: number;
  };
}

export interface FraudDetection {
  orderId: string;
  riskScore: number;
  riskFactors: string[];
  isHighRisk: boolean;
  recommendations: string[];
}

export interface RouteOptimization {
  routeId: string;
  optimizedPath: Array<{
    lat: number;
    lng: number;
    address: string;
    estimatedTime: number;
  }>;
  totalDistance: number;
  totalTime: number;
  fuelEfficiency: number;
}

export interface InventoryPrediction {
  itemId: string;
  itemName: string;
  currentStock: number;
  predictedDemand: number;
  recommendedOrder: number;
  reorderPoint: number;
  daysUntilStockout: number;
}

export interface CustomerSegmentation {
  customerId: string;
  segment: 'premium' | 'regular' | 'occasional' | 'new';
  lifetimeValue: number;
  churnRisk: number;
  nextPurchasePrediction: string;
  recommendedActions: string[];
}

export interface PriceOptimization {
  itemId: string;
  currentPrice: number;
  recommendedPrice: number;
  demandElasticity: number;
  competitorAnalysis: {
    averagePrice: number;
    pricePosition: 'high' | 'medium' | 'low';
  };
  revenueImpact: number;
}

/**
 * Service d'IA Prédictive Avancée pour BantuDelice
 */
class PredictiveAIService {
  private baseUrl = '/api/ai';

  /**
   * Prédire la demande pour une période donnée
   */
  async predictDemand(
    startDate: Date,
    endDate: Date,
    location?: { lat: number; lng: number }
  ): Promise<DemandPrediction[]> {
    try {
      const response = await apiService.post(`${this.baseUrl}/predict-demand`, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        location
      });
      return response.data;
    } catch (error) {
      console.error('Erreur prédiction demande:', error);
      return this.generateMockDemandPredictions(startDate, endDate);
    }
  }

  /**
   * Détecter la fraude dans les commandes
   */
  async detectFraud(orderData: any): Promise<FraudDetection> {
    try {
      const response = await apiService.post(`${this.baseUrl}/detect-fraud`, orderData);
      return response.data;
    } catch (error) {
      console.error('Erreur détection fraude:', error);
      return this.generateMockFraudDetection(orderData);
    }
  }

  /**
   * Optimiser les routes de livraison
   */
  async optimizeRoutes(
    deliveries: Array<{
      id: string;
      lat: number;
      lng: number;
      address: string;
      priority: 'high' | 'medium' | 'low';
    }>
  ): Promise<RouteOptimization> {
    try {
      const response = await apiService.post(`${this.baseUrl}/optimize-routes`, {
        deliveries
      });
      return response.data;
    } catch (error) {
      console.error('Erreur optimisation routes:', error);
      return this.generateMockRouteOptimization(deliveries);
    }
  }

  /**
   * Prédire les besoins en inventaire
   */
  async predictInventory(
    itemIds: string[],
    daysAhead: number = 30
  ): Promise<InventoryPrediction[]> {
    try {
      const response = await apiService.post(`${this.baseUrl}/predict-inventory`, {
        itemIds,
        daysAhead
      });
      return response.data;
    } catch (error) {
      console.error('Erreur prédiction inventaire:', error);
      return this.generateMockInventoryPredictions(itemIds);
    }
  }

  /**
   * Segmenter les clients
   */
  async segmentCustomers(): Promise<CustomerSegmentation[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/segment-customers`);
      return response.data;
    } catch (error) {
      console.error('Erreur segmentation clients:', error);
      return this.generateMockCustomerSegmentation();
    }
  }

  /**
   * Optimiser les prix
   */
  async optimizePricing(itemIds: string[]): Promise<PriceOptimization[]> {
    try {
      const response = await apiService.post(`${this.baseUrl}/optimize-pricing`, {
        itemIds
      });
      return response.data;
    } catch (error) {
      console.error('Erreur optimisation prix:', error);
      return this.generateMockPriceOptimization(itemIds);
    }
  }

  /**
   * Analyser les sentiments des clients
   */
  async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    keywords: string[];
  }> {
    try {
      const response = await apiService.post(`${this.baseUrl}/analyze-sentiment`, {
        text
      });
      return response.data;
    } catch (error) {
      console.error('Erreur analyse sentiment:', error);
      return this.generateMockSentimentAnalysis(text);
    }
  }

  /**
   * Prédire le taux de conversion
   */
  async predictConversionRate(
    campaignData: {
      targetAudience: string;
      offer: string;
      channel: string;
      budget: number;
    }
  ): Promise<{
    predictedRate: number;
    confidence: number;
    recommendations: string[];
  }> {
    try {
      const response = await apiService.post(`${this.baseUrl}/predict-conversion`, campaignData);
      return response.data;
    } catch (error) {
      console.error('Erreur prédiction conversion:', error);
      return this.generateMockConversionPrediction(campaignData);
    }
  }

  // Méthodes de génération de données mock pour la démo
  private generateMockDemandPredictions(startDate: Date, endDate: Date): DemandPrediction[] {
    const predictions: DemandPrediction[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const baseDemand = 50 + Math.random() * 100;
      const weatherFactor = 0.8 + Math.random() * 0.4;
      const eventFactor = 1 + Math.random() * 0.5;
      const seasonalFactor = 0.9 + Math.sin(currentDate.getTime() / (1000 * 60 * 60 * 24 * 365)) * 0.2;
      
      predictions.push({
        date: currentDate.toISOString().split('T')[0],
        predictedOrders: Math.round(baseDemand * weatherFactor * eventFactor * seasonalFactor),
        confidence: 0.85 + Math.random() * 0.1,
        factors: {
          weather: weatherFactor,
          events: eventFactor,
          historical: 0.95 + Math.random() * 0.05,
          seasonality: seasonalFactor
        }
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return predictions;
  }

  private generateMockFraudDetection(orderData: any): FraudDetection {
    const riskScore = Math.random();
    const riskFactors = [];
    
    if (riskScore > 0.7) {
      riskFactors.push('Montant élevé');
      riskFactors.push('Nouveau client');
      riskFactors.push('Adresse inhabituelle');
    }
    
    return {
      orderId: orderData.id || 'unknown',
      riskScore,
      riskFactors,
      isHighRisk: riskScore > 0.7,
      recommendations: riskScore > 0.7 ? [
        'Vérifier l\'identité du client',
        'Demander une pièce d\'identité',
        'Limiter le montant de la commande'
      ] : ['Commande approuvée']
    };
  }

  private generateMockRouteOptimization(deliveries: any[]): RouteOptimization {
    const optimizedPath = deliveries.map((delivery, index) => ({
      lat: delivery.lat,
      lng: delivery.lng,
      address: delivery.address,
      estimatedTime: 15 + index * 5
    }));
    
    return {
      routeId: 'route-' + Date.now(),
      optimizedPath,
      totalDistance: deliveries.length * 2.5,
      totalTime: deliveries.length * 20,
      fuelEfficiency: 0.85 + Math.random() * 0.1
    };
  }

  private generateMockInventoryPredictions(itemIds: string[]): InventoryPrediction[] {
    return itemIds.map((itemId, index) => ({
      itemId,
      itemName: `Produit ${index + 1}`,
      currentStock: Math.floor(Math.random() * 100),
      predictedDemand: Math.floor(Math.random() * 50),
      recommendedOrder: Math.floor(Math.random() * 30),
      reorderPoint: 20,
      daysUntilStockout: Math.floor(Math.random() * 30)
    }));
  }

  private generateMockCustomerSegmentation(): CustomerSegmentation[] {
    const segments: Array<'premium' | 'regular' | 'occasional' | 'new'> = ['premium', 'regular', 'occasional', 'new'];
    
    return Array.from({ length: 10 }, (_, i) => ({
      customerId: `customer-${i + 1}`,
      segment: segments[Math.floor(Math.random() * segments.length)],
      lifetimeValue: Math.floor(Math.random() * 1000000),
      churnRisk: Math.random(),
      nextPurchasePrediction: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      recommendedActions: [
        'Offre personnalisée',
        'Programme de fidélité',
        'Support premium'
      ]
    }));
  }

  private generateMockPriceOptimization(itemIds: string[]): PriceOptimization[] {
    return itemIds.map((itemId, index) => {
      const currentPrice = 1000 + Math.random() * 5000;
      const recommendedPrice = currentPrice * (0.9 + Math.random() * 0.2);
      
      return {
        itemId,
        currentPrice,
        recommendedPrice,
        demandElasticity: -0.5 + Math.random() * 0.5,
        competitorAnalysis: {
          averagePrice: currentPrice * (0.8 + Math.random() * 0.4),
          pricePosition: Math.random() > 0.5 ? 'high' : 'medium'
        },
        revenueImpact: (recommendedPrice - currentPrice) * 100
      };
    });
  }

  private generateMockSentimentAnalysis(text: string): {
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    keywords: string[];
  } {
    const positiveWords = ['bon', 'excellent', 'super', 'génial', 'parfait'];
    const negativeWords = ['mauvais', 'terrible', 'nul', 'horrible', 'décevant'];
    
    const textLower = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => textLower.includes(word)).length;
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let score = 0.5;
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      score = 0.5 + (positiveCount - negativeCount) * 0.1;
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      score = 0.5 - (negativeCount - positiveCount) * 0.1;
    }
    
    return {
      sentiment,
      score: Math.max(0, Math.min(1, score)),
      keywords: [...positiveWords, ...negativeWords].filter(word => textLower.includes(word))
    };
  }

  private generateMockConversionPrediction(campaignData: any): {
    predictedRate: number;
    confidence: number;
    recommendations: string[];
  } {
    const baseRate = 0.05;
    const channelMultiplier = {
      email: 1.2,
      sms: 1.5,
      push: 1.8,
      social: 0.8
    };
    
    const predictedRate = baseRate * (channelMultiplier[campaignData.channel as keyof typeof channelMultiplier] || 1);
    
    return {
      predictedRate: predictedRate + Math.random() * 0.02,
      confidence: 0.8 + Math.random() * 0.15,
      recommendations: [
        'Personnaliser le message',
        'Optimiser l\'heure d\'envoi',
        'Ajouter une offre limitée'
      ]
    };
  }
}

export const predictiveAI = new PredictiveAIService();
export default predictiveAI; 