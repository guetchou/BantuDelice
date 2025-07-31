import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Upload, 
  Image, 
  Package, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Settings,
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
  Activity,
  TrendingUp,
  BarChart3,
  Target,
  Shield,
  Clock,
  DollarSign,
  MapPin,
  Truck,
  Users,
  FileText,
  Copy,
  MoreHorizontal,
  Scan,
  QrCode,
  Barcode,
  Tag,
  Archive,
  Box,
  Cube,
  Weight,
  Ruler,
  Palette,
  Sparkles
} from 'lucide-react';

interface ImageAnalysis {
  id: string;
  imageUrl: string;
  fileName: string;
  fileSize: number;
  uploadTime: Date;
  analysisStatus: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  results: ImageAnalysisResult;
  confidence: number;
}

interface ImageAnalysisResult {
  packageType: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  weight: number;
  fragility: 'low' | 'medium' | 'high';
  materials: string[];
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  damage: DamageDetection[];
  barcode?: string;
  qrCode?: string;
  labels: Label[];
  recommendations: string[];
}

interface DamageDetection {
  type: 'scratch' | 'dent' | 'tear' | 'stain' | 'missing_part';
  severity: 'minor' | 'moderate' | 'severe';
  location: string;
  confidence: number;
  description: string;
}

interface Label {
  text: string;
  confidence: number;
  type: 'address' | 'instruction' | 'warning' | 'brand' | 'other';
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const ColisImageRecognition: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [analysisHistory, setAnalysisHistory] = useState<ImageAnalysis[]>([
    {
      id: '1',
      imageUrl: '/images/sample-package-1.jpg',
      fileName: 'colis-electronique.jpg',
      fileSize: 2048576,
      uploadTime: new Date('2024-01-15T10:30:00Z'),
      analysisStatus: 'completed',
      progress: 100,
      confidence: 94.2,
      results: {
        packageType: 'Électronique',
        dimensions: { length: 25, width: 18, height: 12 },
        weight: 2.3,
        fragility: 'high',
        materials: ['Carton', 'Mousse', 'Plastique'],
        condition: 'excellent',
        damage: [
          {
            type: 'scratch',
            severity: 'minor',
            location: 'Coin supérieur droit',
            confidence: 87.5,
            description: 'Petite rayure superficielle'
          }
        ],
        barcode: '1234567890123',
        qrCode: 'BD12345678',
        labels: [
          {
            text: 'Fragile - Ne pas empiler',
            confidence: 96.8,
            type: 'warning',
            boundingBox: { x: 10, y: 20, width: 200, height: 30 }
          },
          {
            text: 'Brazzaville → Pointe-Noire',
            confidence: 92.1,
            type: 'address',
            boundingBox: { x: 50, y: 60, width: 180, height: 25 }
          }
        ],
        recommendations: [
          'Emballage adapté pour électronique',
          'Assurance recommandée',
          'Livraison express conseillée'
        ]
      }
    },
    {
      id: '2',
      imageUrl: '/images/sample-package-2.jpg',
      fileName: 'colis-vetements.jpg',
      fileSize: 1536000,
      uploadTime: new Date('2024-01-15T09:15:00Z'),
      analysisStatus: 'completed',
      progress: 100,
      confidence: 91.7,
      results: {
        packageType: 'Vêtements',
        dimensions: { length: 40, width: 30, height: 15 },
        weight: 1.8,
        fragility: 'low',
        materials: ['Carton', 'Papier'],
        condition: 'good',
        damage: [],
        labels: [
          {
            text: 'Mode Express',
            confidence: 89.3,
            type: 'brand',
            boundingBox: { x: 15, y: 25, width: 120, height: 20 }
          }
        ],
        recommendations: [
          'Emballage standard suffisant',
          'Livraison économique possible'
        ]
      }
    }
  ]);
  const [currentAnalysis, setCurrentAnalysis] = useState<ImageAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    const newAnalysis: ImageAnalysis = {
      id: Date.now().toString(),
      imageUrl: imagePreview,
      fileName: selectedImage.name,
      fileSize: selectedImage.size,
      uploadTime: new Date(),
      analysisStatus: 'processing',
      progress: 0,
      confidence: 0,
      results: {
        packageType: '',
        dimensions: { length: 0, width: 0, height: 0 },
        weight: 0,
        fragility: 'low',
        materials: [],
        condition: 'good',
        damage: [],
        labels: [],
        recommendations: []
      }
    };

    setCurrentAnalysis(newAnalysis);
    setAnalysisHistory(prev => [newAnalysis, ...prev]);

    // Simulation de l'analyse IA
    const progressInterval = setInterval(() => {
      setCurrentAnalysis(prev => {
        if (!prev) return prev;
        const newProgress = Math.min(prev.progress + 10, 100);
        if (newProgress === 100) {
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          return {
            ...prev,
            progress: 100,
            analysisStatus: 'completed',
            confidence: 92.5,
            results: generateMockResults()
          };
        }
        return { ...prev, progress: newProgress };
      });
    }, 500);
  };

  const generateMockResults = (): ImageAnalysisResult => {
    const packageTypes = ['Électronique', 'Vêtements', 'Documents', 'Alimentation', 'Médicaments'];
    const materials = ['Carton', 'Plastique', 'Mousse', 'Papier', 'Bois'];
    const fragilityLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];

    return {
      packageType: packageTypes[Math.floor(Math.random() * packageTypes.length)],
      dimensions: {
        length: Math.floor(Math.random() * 50) + 10,
        width: Math.floor(Math.random() * 40) + 8,
        height: Math.floor(Math.random() * 30) + 5
      },
      weight: Math.random() * 10 + 0.5,
      fragility: fragilityLevels[Math.floor(Math.random() * fragilityLevels.length)],
      materials: materials.slice(0, Math.floor(Math.random() * 3) + 1),
      condition: 'good',
      damage: [],
      barcode: Math.random().toString(36).substring(2, 15),
      qrCode: 'BD' + Math.random().toString().slice(2, 10),
      labels: [
        {
          text: 'Fragile - Manipuler avec soin',
          confidence: 95.2,
          type: 'warning',
          boundingBox: { x: 10, y: 20, width: 200, height: 30 }
        }
      ],
      recommendations: [
        'Emballage adapté recommandé',
        'Assurance conseillée'
      ]
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Terminé</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800"><Activity className="h-3 w-3 mr-1" />Analyse</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Erreur</Badge>;
      default:
        return null;
    }
  };

  const getFragilityColor = (fragility: string) => {
    switch (fragility) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Reconnaissance d'Images IA</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Analysez automatiquement vos colis avec l'intelligence artificielle pour identifier 
          le type, les dimensions, les dommages et générer des recommandations.
        </p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Analyser une Image</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Zone d'upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Télécharger une Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-lg mx-auto"
                      />
                      <p className="text-sm text-gray-600">
                        {selectedImage?.name} ({(selectedImage?.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 mx-auto text-gray-400" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">Cliquez pour sélectionner une image</p>
                        <p className="text-sm text-gray-500">JPG, PNG, ou GIF jusqu'à 10MB</p>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="flex gap-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Sélectionner
                  </Button>
                  <Button
                    onClick={handleAnalyzeImage}
                    disabled={!selectedImage || isAnalyzing}
                    className="flex-1"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Analyse...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Analyser
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Résultats en temps réel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Résultats de l'Analyse
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentAnalysis ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progression</span>
                      <span className="text-sm text-gray-500">{currentAnalysis.progress}%</span>
                    </div>
                    <Progress value={currentAnalysis.progress} className="h-2" />

                    {currentAnalysis.analysisStatus === 'completed' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-600">Type de colis</p>
                            <p className="font-semibold">{currentAnalysis.results.packageType}</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-600">Fragilité</p>
                            <p className={`font-semibold ${getFragilityColor(currentAnalysis.results.fragility)}`}>
                              {currentAnalysis.results.fragility}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Dimensions</h4>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <Ruler className="h-4 w-4 mx-auto mb-1" />
                              <p className="font-medium">{currentAnalysis.results.dimensions.length} cm</p>
                              <p className="text-xs text-gray-500">Longueur</p>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <Ruler className="h-4 w-4 mx-auto mb-1" />
                              <p className="font-medium">{currentAnalysis.results.dimensions.width} cm</p>
                              <p className="text-xs text-gray-500">Largeur</p>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <Ruler className="h-4 w-4 mx-auto mb-1" />
                              <p className="font-medium">{currentAnalysis.results.dimensions.height} cm</p>
                              <p className="text-xs text-gray-500">Hauteur</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Poids estimé</h4>
                          <div className="flex items-center gap-2">
                            <Weight className="h-4 w-4" />
                            <span className="font-semibold">{currentAnalysis.results.weight} kg</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Matériaux détectés</h4>
                          <div className="flex flex-wrap gap-1">
                            {currentAnalysis.results.materials.map((material, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {material}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {currentAnalysis.results.recommendations.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium">Recommandations</h4>
                            <ul className="space-y-1">
                              {currentAnalysis.results.recommendations.map((rec, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                  <CheckCircle className="h-3 w-3 mt-0.5 text-green-500" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Image className="h-12 w-12 mx-auto mb-2" />
                    <p>Aucune analyse en cours</p>
                    <p className="text-sm">Téléchargez une image pour commencer</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysisHistory.map((analysis) => (
              <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{analysis.fileName}</CardTitle>
                      {getStatusBadge(analysis.analysisStatus)}
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img
                    src={analysis.imageUrl}
                    alt={analysis.fileName}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Type</span>
                      <span className="font-medium">{analysis.results.packageType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Fragilité</span>
                      <span className={`font-medium ${getFragilityColor(analysis.results.fragility)}`}>
                        {analysis.results.fragility}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Confiance IA</span>
                      <span className="font-medium">{analysis.confidence}%</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Rapport
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Analyses Effectuées</p>
                    <p className="text-2xl font-bold text-blue-900">{analysisHistory.length}</p>
                  </div>
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Précision Moyenne</p>
                    <p className="text-2xl font-bold text-green-900">94.2%</p>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600">Temps Moyen</p>
                    <p className="text-2xl font-bold text-purple-900">2.3s</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600">Types Détectés</p>
                    <p className="text-2xl font-bold text-orange-900">12</p>
                  </div>
                  <Package className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Types de Colis Détectés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Électronique</span>
                    <div className="flex items-center gap-2">
                      <Progress value={35} className="w-20 h-2" />
                      <span className="text-sm font-medium">35%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Vêtements</span>
                    <div className="flex items-center gap-2">
                      <Progress value={28} className="w-20 h-2" />
                      <span className="text-sm font-medium">28%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Documents</span>
                    <div className="flex items-center gap-2">
                      <Progress value={22} className="w-20 h-2" />
                      <span className="text-sm font-medium">22%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Autres</span>
                    <div className="flex items-center gap-2">
                      <Progress value={15} className="w-20 h-2" />
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Reconnaissance d'objets</span>
                      <span className="font-medium">96.8%</span>
                    </div>
                    <Progress value={96.8} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Détection de dommages</span>
                      <span className="font-medium">91.2%</span>
                    </div>
                    <Progress value={91.2} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Lecture de codes-barres</span>
                      <span className="font-medium">98.5%</span>
                    </div>
                    <Progress value={98.5} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyse de texte</span>
                      <span className="font-medium">89.7%</span>
                    </div>
                    <Progress value={89.7} className="h-2" />
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

export default ColisImageRecognition; 