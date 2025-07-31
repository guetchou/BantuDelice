import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Globe, CheckCircle, Clock, RefreshCw, MapPin, Search, QrCode, Package, Users, Star, ArrowRight, Shield, Zap } from 'lucide-react';

const ColisTracking: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'national' | 'international' | null>(null);

  // Détection automatique du type de colis
  const detectColisType = (number: string): 'national' | 'international' => {
    if (number.length <= 8 && /^\d+$/.test(number)) {
      return 'national';
    }
    return 'international';
  };

  const handleTrack = async () => {
    setLoading(true);
    setData(null);
    const colisType = detectColisType(trackingNumber);
    setType(colisType);

    try {
      const baseUrl = import.meta.env?.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${baseUrl}/colis/${trackingNumber}`);
      if (!res.ok) throw new Error('Erreur serveur');
      const json = await res.json();
      setData(json.data || json);
    } catch (e) {
      setData({ error: 'Colis non trouvé ou erreur réseau.' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Livré') return 'bg-green-500 text-white';
    if (status === 'En cours de livraison') return 'bg-orange-100 text-orange-800';
    if (status === 'En transit') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-200 text-gray-700';
  };

  return (
    <div className="min-h-screen w-full">
      {/* HERO SECTION - Utilise toute la largeur */}
      <div className="relative h-[50vh] w-full flex items-center justify-center bg-cover bg-center" style={{backgroundImage: 'url(/images/hero-tracking.jpg)'}}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-yellow-900/50"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-extrabold mb-6">Suivi de colis en temps réel</h1>
          <p className="text-xl mb-8">Consultez l'état de votre colis à chaque étape du transport</p>
          
          {/* Barre de recherche principale */}
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Entrez votre numéro de suivi..."
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  className="pl-12 h-14 text-lg bg-white/90 backdrop-blur border-0 shadow-lg"
                  onKeyDown={e => e.key === 'Enter' && handleTrack()}
                />
              </div>
              <Button 
                onClick={handleTrack} 
                disabled={loading || !trackingNumber} 
                className="h-14 px-8 bg-yellow-400 text-black text-lg font-bold shadow-lg hover:bg-yellow-300"
              >
                {loading ? <RefreshCw className="animate-spin h-6 w-6" /> : <Search className="h-6 w-6" />} 
                Suivre
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION PRINCIPALE - Utilise toute la largeur */}
      <div className="w-full bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Résultat du suivi */}
          {data && !data.error && (
            <div className="mb-12">
              <Card className="bg-white/40 backdrop-blur-md border border-white/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-orange-700">
                    <Package className="h-8 w-8" />
                    Résultat du suivi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Informations principales */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-lg px-4 py-2 font-bold shadow-lg ${getStatusColor(data.status)}`}>
                          {data.status}
                        </Badge>
                        {data.status === 'Livré' && <CheckCircle className="h-6 w-6 text-green-500 animate-bounce" />}
                        {data.status === 'En cours de livraison' && <Truck className="h-6 w-6 text-orange-500 animate-pulse" />}
                      </div>
                      
                      {type === 'national' && data.villeDepart && (
                        <div className="bg-white/60 backdrop-blur rounded-lg p-4">
                          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                            <MapPin className="h-5 w-5 text-orange-500" />
                            {data.villeDepart} <ArrowRight className="h-4 w-4" /> {data.villeArrivee}
                          </div>
                        </div>
                      )}
                      
                      {type === 'international' && data.transporteur && (
                        <div className="bg-white/60 backdrop-blur rounded-lg p-4">
                          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                            <Globe className="h-5 w-5 text-blue-500" />
                            {data.transporteur} • {data.paysDepart} <ArrowRight className="h-4 w-4" /> {data.paysArrivee}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timeline */}
                    <div className="bg-white/60 backdrop-blur rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Historique du colis</h3>
                      <ol className="relative border-l-4 border-orange-300 ml-4">
                        {data.timeline.map((step: any, i: number) => (
                          <li key={i} className="mb-6 flex items-center group">
                            <span className="absolute -left-8 flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-orange-100 text-orange-800 border-4 border-white">
                              {step.label === 'Pris en charge' && <MapPin className="h-6 w-6" />}
                              {step.label === 'En transit' && <Truck className="h-6 w-6" />}
                              {step.label === 'En cours de livraison' && <Clock className="h-6 w-6" />}
                              {step.label === 'Livré' && <CheckCircle className="h-6 w-6 text-green-500" />}
                            </span>
                            <div className="ml-4">
                              <span className="font-bold text-lg text-orange-700">{step.label}</span>
                              <div className="text-sm text-gray-600">{step.date}</div>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {data && data.error && (
            <div className="mb-12">
              <Card className="bg-red-50/80 backdrop-blur-md border border-red-200 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <div className="text-red-600 text-xl font-bold">{data.error}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* SECTION SERVICES ILLUSTRES */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="bg-orange-100 p-6 rounded-full mb-6 mx-auto w-20 h-20 flex items-center justify-center">
                <QrCode className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Scan QR Code</h3>
              <p className="text-gray-600 mb-6">Scannez le QR code de votre colis pour un suivi instantané</p>
              <Button className="bg-orange-500 text-white hover:bg-orange-600">Scanner</Button>
            </div>

            <div className="bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="bg-blue-100 p-6 rounded-full mb-6 mx-auto w-20 h-20 flex items-center justify-center">
                <Globe className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Suivi International</h3>
              <p className="text-gray-600 mb-6">Suivez vos colis partout dans le monde en temps réel</p>
              <Button className="bg-blue-500 text-white hover:bg-blue-600">Suivre</Button>
            </div>

            <div className="bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="bg-green-100 p-6 rounded-full mb-6 mx-auto w-20 h-20 flex items-center justify-center">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Assurance Colis</h3>
              <p className="text-gray-600 mb-6">Protégez vos envois avec notre assurance premium</p>
              <Button className="bg-green-500 text-white hover:bg-green-600">Assurer</Button>
            </div>
          </div>

          {/* SECTION STATISTIQUES */}
          <div className="bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Nos performances</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
                <div className="text-gray-600">Taux de livraison</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">24h</div>
                <div className="text-gray-600">Délai moyen</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-gray-600">Pays desservis</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">10k+</div>
                <div className="text-gray-600">Clients satisfaits</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColisTracking; 