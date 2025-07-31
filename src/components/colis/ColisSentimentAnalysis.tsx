import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Smile, 
  Frown, 
  Meh,
  Star,
  Users,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  Share2,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  RefreshCw,
  Zap,
  Brain,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Calendar,
  DollarSign,
  Package,
  Truck,
  MapPin,
  Settings,
  MoreHorizontal,
  Search,
  Filter as FilterIcon,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface CustomerReview {
  id: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  review: string;
  date: Date;
  service: 'delivery' | 'tracking' | 'pricing' | 'support' | 'overall';
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  keywords: string[];
  category: 'praise' | 'complaint' | 'suggestion' | 'question';
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'reviewed' | 'resolved' | 'ignored';
  response?: string;
  responseDate?: Date;
}

interface SentimentMetrics {
  totalReviews: number;
  positiveReviews: number;
  negativeReviews: number;
  neutralReviews: number;
  averageRating: number;
  sentimentScore: number;
  responseRate: number;
  averageResponseTime: number;
}

const ColisSentimentAnalysis: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([
    {
      id: '1',
      customerName: 'Marie Dubois',
      customerEmail: 'marie.dubois@email.com',
      rating: 5,
      review: 'Service exceptionnel ! Ma livraison est arrivée en avance et en parfait état. Le suivi en temps réel était très rassurant. Je recommande vivement BantuDelice Colis !',
      date: new Date('2024-01-15T14:30:00Z'),
      service: 'delivery',
      sentiment: 'positive',
      sentimentScore: 0.95,
      keywords: ['exceptionnel', 'avance', 'parfait', 'recommandé'],
      category: 'praise',
      priority: 'low',
      status: 'resolved'
    },
    {
      id: '2',
      customerName: 'Jean Martin',
      customerEmail: 'jean.martin@email.com',
      rating: 2,
      review: 'Très déçu du service. Ma livraison a eu 3 jours de retard et le colis était endommagé. Le service client n\'a pas été très réactif.',
      date: new Date('2024-01-14T16:45:00Z'),
      service: 'delivery',
      sentiment: 'negative',
      sentimentScore: 0.15,
      keywords: ['déçu', 'retard', 'endommagé', 'non réactif'],
      category: 'complaint',
      priority: 'high',
      status: 'reviewed'
    },
    {
      id: '3',
      customerName: 'Sophie Bernard',
      customerEmail: 'sophie.bernard@email.com',
      rating: 4,
      review: 'Bon service dans l\'ensemble. La livraison était à l\'heure mais j\'aurais aimé plus de communication sur le statut.',
      date: new Date('2024-01-13T11:20:00Z'),
      service: 'tracking',
      sentiment: 'neutral',
      sentimentScore: 0.65,
      keywords: ['bon', 'heure', 'communication', 'statut'],
      category: 'suggestion',
      priority: 'medium',
      status: 'new'
    },
    {
      id: '4',
      customerName: 'Pierre Durand',
      customerEmail: 'pierre.durand@email.com',
      rating: 5,
      review: 'Excellent rapport qualité-prix ! Le suivi était parfait et la livraison rapide. Je vais certainement réutiliser vos services.',
      date: new Date('2024-01-12T09:15:00Z'),
      service: 'pricing',
      sentiment: 'positive',
      sentimentScore: 0.92,
      keywords: ['excellent', 'qualité-prix', 'parfait', 'rapide'],
      category: 'praise',
      priority: 'low',
      status: 'resolved'
    },
    {
      id: '5',
      customerName: 'Lucie Moreau',
      customerEmail: 'lucie.moreau@email.com',
      rating: 1,
      review: 'Service catastrophique ! Mon colis est perdu depuis 2 semaines et personne ne me répond. C\'est inadmissible !',
      date: new Date('2024-01-11T13:10:00Z'),
      service: 'support',
      sentiment: 'negative',
      sentimentScore: 0.05,
      keywords: ['catastrophique', 'perdu', 'inadmissible'],
      category: 'complaint',
      priority: 'high',
      status: 'new'
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const sentimentMetrics: SentimentMetrics = {
    totalReviews: reviews.length,
    positiveReviews: reviews.filter(r => r.sentiment === 'positive').length,
    negativeReviews: reviews.filter(r => r.sentiment === 'negative').length,
    neutralReviews: reviews.filter(r => r.sentiment === 'neutral').length,
    averageRating: reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length,
    sentimentScore: reviews.reduce((acc, r) => acc + r.sentimentScore, 0) / reviews.length,
    responseRate: reviews.filter(r => r.response).length / reviews.length * 100,
    averageResponseTime: 2.5 // heures
  };

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = selectedFilter === 'all' || review.status === selectedFilter;
    const matchesService = selectedService === 'all' || review.service === selectedService;
    const matchesSentiment = selectedSentiment === 'all' || review.sentiment === selectedSentiment;
    const matchesSearch = review.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesService && matchesSentiment && matchesSearch;
  });

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <Frown className="h-4 w-4 text-red-600" />;
      case 'neutral':
        return <Meh className="h-4 w-4 text-yellow-600" />;
      default:
        return <Meh className="h-4 w-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      case 'neutral':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Nouveau</Badge>;
      case 'reviewed':
        return <Badge className="bg-yellow-100 text-yellow-800"><Eye className="h-3 w-3 mr-1" />Examiné</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Résolu</Badge>;
      case 'ignored':
        return <Badge className="bg-gray-100 text-gray-800"><MoreHorizontal className="h-3 w-3 mr-1" />Ignoré</Badge>;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Analyse de Sentiment</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Analysez les sentiments de vos clients avec l'IA pour améliorer la satisfaction 
          et identifier les opportunités d'amélioration.
        </p>
      </div>

      {/* Métriques de sentiment */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Score de Sentiment</p>
                <p className="text-2xl font-bold text-green-900">
                  {(sentimentMetrics.sentimentScore * 100).toFixed(1)}%
                </p>
              </div>
              <Heart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Note Moyenne</p>
                <p className="text-2xl font-bold text-blue-900">
                  {sentimentMetrics.averageRating.toFixed(1)}/5
                </p>
              </div>
              <Star className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Taux de Réponse</p>
                <p className="text-2xl font-bold text-purple-900">
                  {sentimentMetrics.responseRate.toFixed(1)}%
                </p>
              </div>
              <MessageCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Temps de Réponse</p>
                <p className="text-2xl font-bold text-orange-900">
                  {sentimentMetrics.averageResponseTime}h
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="reviews">Avis Clients</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Répartition des sentiments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Répartition des Sentiments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smile className="h-4 w-4 text-green-600" />
                      <span>Positif</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{sentimentMetrics.positiveReviews}</span>
                      <span className="text-sm text-gray-500">
                        ({((sentimentMetrics.positiveReviews / sentimentMetrics.totalReviews) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <Progress value={(sentimentMetrics.positiveReviews / sentimentMetrics.totalReviews) * 100} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Meh className="h-4 w-4 text-yellow-600" />
                      <span>Neutre</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{sentimentMetrics.neutralReviews}</span>
                      <span className="text-sm text-gray-500">
                        ({((sentimentMetrics.neutralReviews / sentimentMetrics.totalReviews) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <Progress value={(sentimentMetrics.neutralReviews / sentimentMetrics.totalReviews) * 100} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Frown className="h-4 w-4 text-red-600" />
                      <span>Négatif</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{sentimentMetrics.negativeReviews}</span>
                      <span className="text-sm text-gray-500">
                        ({((sentimentMetrics.negativeReviews / sentimentMetrics.totalReviews) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <Progress value={(sentimentMetrics.negativeReviews / sentimentMetrics.totalReviews) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Tendances */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tendances Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Satisfaction</span>
                    </div>
                    <span className="text-green-600 font-semibold">+12.5%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Réactivité</span>
                    </div>
                    <span className="text-blue-600 font-semibold">+8.3%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Note moyenne</span>
                    </div>
                    <span className="text-purple-600 font-semibold">+0.4</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Temps de réponse</span>
                    </div>
                    <span className="text-orange-600 font-semibold">-15.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans les avis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="new">Nouveau</SelectItem>
                  <SelectItem value="reviewed">Examiné</SelectItem>
                  <SelectItem value="resolved">Résolu</SelectItem>
                  <SelectItem value="ignored">Ignoré</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les services</SelectItem>
                  <SelectItem value="delivery">Livraison</SelectItem>
                  <SelectItem value="tracking">Suivi</SelectItem>
                  <SelectItem value="pricing">Tarification</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="overall">Global</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les sentiments</SelectItem>
                  <SelectItem value="positive">Positif</SelectItem>
                  <SelectItem value="neutral">Neutre</SelectItem>
                  <SelectItem value="negative">Négatif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Liste des avis */}
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <Users className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{review.customerName}</h4>
                        <p className="text-sm text-gray-500">{review.customerEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(review.status)}
                      <Badge className={getPriorityColor(review.priority)}>
                        {review.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <Badge className={getSentimentColor(review.sentiment)}>
                      {getSentimentIcon(review.sentiment)}
                      <span className="ml-1">{(review.sentimentScore * 100).toFixed(0)}%</span>
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {review.date.toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700">{review.review}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {review.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Répondre
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mots-clés les plus fréquents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Mots-clés Fréquents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Exceptionnel</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-20 h-2" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rapide</span>
                    <div className="flex items-center gap-2">
                      <Progress value={72} className="w-20 h-2" />
                      <span className="text-sm font-medium">72%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Retard</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45} className="w-20 h-2" />
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Endommagé</span>
                    <div className="flex items-center gap-2">
                      <Progress value={28} className="w-20 h-2" />
                      <span className="text-sm font-medium">28%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance par service */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance par Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Livraison</span>
                      <span className="font-medium">4.2/5</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Suivi</span>
                      <span className="font-medium">4.5/5</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tarification</span>
                      <span className="font-medium">4.1/5</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Support</span>
                      <span className="font-medium">3.8/5</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Insights automatiques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Insights IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                    <h4 className="font-semibold text-green-800">Satisfaction en hausse</h4>
                    <p className="text-sm text-green-700">
                      La satisfaction client a augmenté de 12.5% ce mois-ci. 
                      Les améliorations du suivi en temps réel sont appréciées.
                    </p>
                  </div>

                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <h4 className="font-semibold text-yellow-800">Attention aux retards</h4>
                    <p className="text-sm text-yellow-700">
                      15% des avis négatifs mentionnent des retards. 
                      Considérer l'optimisation des routes.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <h4 className="font-semibold text-blue-800">Communication améliorée</h4>
                    <p className="text-sm text-blue-700">
                      Les clients apprécient les notifications proactives. 
                      Continuer dans cette direction.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions recommandées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Actions Recommandées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Améliorer le support client</h4>
                      <p className="text-sm text-gray-600">Impact élevé • 2 semaines</p>
                    </div>
                    <Button size="sm">Appliquer</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Optimiser les routes</h4>
                      <p className="text-sm text-gray-600">Impact moyen • 1 semaine</p>
                    </div>
                    <Button size="sm">Appliquer</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Formation équipe</h4>
                      <p className="text-sm text-gray-600">Impact faible • 3 semaines</p>
                    </div>
                    <Button size="sm">Appliquer</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColisSentimentAnalysis; 