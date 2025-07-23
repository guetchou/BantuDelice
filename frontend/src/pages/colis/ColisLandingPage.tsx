import React, { useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Globe, Calculator, Package, Users, Star, ArrowRight, MapPin, Clock, Shield, QrCode } from 'lucide-react';
import { useZxing } from 'react-zxing';
import { BrowserQRCodeReader } from '@zxing/browser';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const ColisLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [trackingInput, setTrackingInput] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      navigate(`/colis/tracking?code=${encodeURIComponent(trackingInput.trim())}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const codeReader = new BrowserQRCodeReader();
      const result = await codeReader.decodeFromImage(undefined, URL.createObjectURL(file));
      
      if (result) {
        setTrackingInput(result.getText());
        setShowScanner(false);
        setQrError(null);
        navigate(`/colis/tracking?code=${encodeURIComponent(result.getText())}`);
      } else {
        setQrError('Aucun QR code détecté dans l\'image.');
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du QR code:', error);
      setQrError('Erreur lors de la lecture du QR code.');
    }
  };

  // Configuration du lecteur QR
  const { ref } = useZxing({
    onDecodeResult: (result) => {
      const text = result.getText();
      setTrackingInput(text);
      setShowScanner(false);
      setQrError(null);
      navigate(`/colis/tracking?code=${encodeURIComponent(text)}`);
    },
    onError: (error) => {
      console.error(error);
      setQrError('Erreur lors de la lecture du QR code');
    },
    timeBetweenDecodingAttempts: 300,
    constraints: {
      video: {
        facingMode: 'environment',
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 }
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200">
      {/* Header avec navigation */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/logo/logo.png" alt="BantuDelice" className="h-10 w-10 rounded-full border-2 border-yellow-400 shadow" />
              <span className="font-bold text-orange-700 text-xl">BantuDelice Colis</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/colis/tracking" className="text-orange-700 hover:text-orange-900 font-medium">Suivi</Link>
              <Link to="/colis/tarifs" className="text-orange-700 hover:text-orange-900 font-medium">Tarifs</Link>
              <Link to="/colis/expedier" className="text-orange-700 hover:text-orange-900 font-medium">Expédier</Link>
              <Link to="/colis/historique" className="text-orange-700 hover:text-orange-900 font-medium">Historique</Link>
              <Link to="/colis/api" className="text-orange-700 hover:text-orange-900 font-medium">API</Link>
              <Link to="/colis/a-propos" className="text-orange-700 hover:text-orange-900 font-medium">À propos</Link>
            </nav>
            <Button asChild className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold">
              <Link to="/colis/tracking">Commencer</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section améliorée */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-extrabold text-orange-700 mb-6">
              Envoyez vos colis partout
              <span className="block text-yellow-600">au Congo & International</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Marchandises, courrier, documents, colis volumineux...<br />
              Choisissez votre destination et le type de colis, nous nous occupons du reste !
            </p>
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <input
                type="text"
                placeholder="Entrer le numéro de suivi ou code barre..."
                value={trackingInput}
                onChange={e => setTrackingInput(e.target.value)}
                className="px-4 py-3 rounded-lg border border-orange-300 focus:ring-2 focus:ring-orange-400 w-72 text-lg"
                required
              />
              <Button type="submit" size="lg" className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold text-lg px-8 py-4">
                Suivre
              </Button>
              <Dialog open={showScanner} onOpenChange={setShowScanner}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="lg" className="flex items-center gap-2 border-orange-300 text-orange-700 font-bold text-lg px-6 py-4">
                    <QrCode className="w-5 h-5" /> Scanner QR
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Scanner un QR code</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-full aspect-video bg-black rounded overflow-hidden">
                    <video
                      ref={(node) => {
                        if (node) {
                          // @ts-ignore - react-zxing utilise une ref différente
                          ref(node);
                          videoRef.current = node;
                        }
                      }}
                      className="w-full h-full object-cover"
                      style={{
                        transform: 'scaleX(-1)' // Miroir pour une meilleure expérience utilisateur
                      }}
                      playsInline
                    />
                  </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        setQrError(null);
                        document.getElementById('qr-upload-fallback')?.click();
                      }}
                    >
                      Téléverser une image
                    </Button>
                    <input
                      id="qr-upload-fallback"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <p className="text-sm text-gray-500 text-center">
                      Placez le QR code devant la caméra <br />
                      <span className="text-orange-600 font-semibold">ou téléversez une image</span> si la caméra n'est pas accessible.<br />
                      {qrError && <span className="text-red-600">{qrError}</span>}
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </form>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Colis National */}
            <Card className="bg-white/90 border-0 shadow-2xl hover:scale-105 transition-transform">
              <CardHeader className="flex flex-col items-center">
                <Truck className="h-12 w-12 text-orange-500 mb-2" />
                <CardTitle className="text-2xl text-orange-700">Colis National</CardTitle>
                <p className="text-gray-600 mt-2 text-center">Envoyez vos colis partout au Congo : Brazzaville, Pointe-Noire, Dolisie, etc.</p>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="flex gap-4 mt-2">
                  <span className="flex flex-col items-center"><Package className="h-7 w-7 text-orange-400" /><span className="text-xs mt-1">Marchandises</span></span>
                  <span className="flex flex-col items-center"><Badge className="bg-orange-200 text-orange-700">✉️</Badge><span className="text-xs mt-1">Courrier</span></span>
                  <span className="flex flex-col items-center"><Badge className="bg-orange-100 text-orange-700">📄</Badge><span className="text-xs mt-1">Documents</span></span>
                  <span className="flex flex-col items-center"><Badge className="bg-orange-100 text-orange-700">📦</Badge><span className="text-xs mt-1">Colis volumineux</span></span>
                </div>
                <Button asChild className="w-full mt-4 bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold">
                  <Link to="/colis/national">Commencer</Link>
                </Button>
              </CardContent>
            </Card>
            {/* Colis International */}
            <Card className="bg-white/90 border-0 shadow-2xl hover:scale-105 transition-transform">
              <CardHeader className="flex flex-col items-center">
                <Globe className="h-12 w-12 text-blue-500 mb-2" />
                <CardTitle className="text-2xl text-blue-700">Colis International</CardTitle>
                <p className="text-gray-600 mt-2 text-center">Envoyez vos colis dans le monde entier avec DHL, FedEx, La Poste, etc.</p>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="flex gap-4 mt-2">
                  <span className="flex flex-col items-center"><Package className="h-7 w-7 text-blue-400" /><span className="text-xs mt-1">Marchandises</span></span>
                  <span className="flex flex-col items-center"><Badge className="bg-blue-200 text-blue-700">✉️</Badge><span className="text-xs mt-1">Courrier</span></span>
                  <span className="flex flex-col items-center"><Badge className="bg-blue-100 text-blue-700">📄</Badge><span className="text-xs mt-1">Documents</span></span>
                  <span className="flex flex-col items-center"><Badge className="bg-blue-100 text-blue-700">📦</Badge><span className="text-xs mt-1">Colis volumineux</span></span>
                </div>
                <Button asChild className="w-full mt-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold">
                  <Link to="/colis/international">Commencer</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services disponibles */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-orange-700 mb-12">Nos services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Truck className="h-8 w-8 text-orange-500" />
                  <CardTitle className="text-orange-700">Suivi National</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Suivez vos colis partout au Congo : Brazzaville, Pointe-Noire, Dolisie et plus.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-orange-500" /> Livraison interville</li>
                  <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-orange-500" /> Suivi en temps réel</li>
                  <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-orange-500" /> Assurance incluse</li>
                </ul>
                <Button asChild className="w-full mt-4 bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
                  <Link to="/colis/national">En savoir plus</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Globe className="h-8 w-8 text-blue-500" />
                  <CardTitle className="text-blue-700">Suivi International</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Colis internationaux avec DHL, FedEx, La Poste et plus de 2500 transporteurs.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><Globe className="h-4 w-4 text-blue-500" /> Monde entier</li>
                  <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-blue-500" /> Suivi universel</li>
                  <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-blue-500" /> Sécurisé</li>
                </ul>
                <Button asChild className="w-full mt-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white">
                  <Link to="/colis/international">En savoir plus</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calculator className="h-8 w-8 text-green-500" />
                  <CardTitle className="text-green-700">Tarifs & Calcul</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Calculez vos tarifs instantanément, comparez les transporteurs, optimisez vos coûts.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><Calculator className="h-4 w-4 text-green-500" /> Calcul instantané</li>
                  <li className="flex items-center gap-2"><Package className="h-4 w-4 text-green-500" /> Comparaison transporteurs</li>
                  <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-green-500" /> Options d'assurance</li>
                </ul>
                <Button asChild className="w-full mt-4 bg-gradient-to-r from-green-400 to-green-600 text-white">
                  <Link to="/colis/tarifs">Calculer</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-orange-700 mb-12">Nos chiffres</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">50,000+</div>
              <div className="text-gray-600">Colis livrés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction client</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">24h</div>
              <div className="text-gray-600">Livraison express</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">15+</div>
              <div className="text-gray-600">Villes desservies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-orange-700 mb-12">Ce que disent nos clients</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"Service exceptionnel ! Mon colis a été livré en 24h de Brazzaville à Pointe-Noire. Suivi en temps réel très pratique."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Marie K.</div>
                    <div className="text-sm text-gray-500">Brazzaville</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"Parfait pour mes envois internationaux. L'intégration avec DHL fonctionne parfaitement, tarifs transparents."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Jean P.</div>
                    <div className="text-sm text-gray-500">Pointe-Noire</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"Interface simple et efficace. Le calculateur de tarifs m'aide beaucoup pour optimiser mes coûts d'expédition."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Sarah M.</div>
                    <div className="text-sm text-gray-500">Dolisie</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call-to-action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-yellow-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Prêt à expédier votre premier colis ?</h2>
          <p className="text-xl text-white/90 mb-8">Rejoignez des milliers de clients satisfaits qui nous font confiance pour leurs livraisons.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-orange-600 font-bold text-lg px-8 py-4 hover:bg-gray-100">
              <Link to="/colis/expedier">Expédier maintenant</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white font-bold text-lg px-8 py-4 hover:bg-white/10">
              <Link to="/colis/tracking">Suivre un colis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur border-t border-yellow-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/images/logo/logo.png" alt="BantuDelice" className="h-8 w-8 rounded-full border-2 border-yellow-400" />
                <span className="font-bold text-orange-700">BantuDelice Colis</span>
              </div>
              <p className="text-gray-600">Service de livraison de colis national et international au Congo.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Services</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/colis/national" className="hover:text-orange-600">Suivi National</Link></li>
                <li><Link to="/colis/international" className="hover:text-orange-600">Suivi International</Link></li>
                <li><Link to="/colis/tarifs" className="hover:text-orange-600">Calcul de tarifs</Link></li>
                <li><Link to="/colis/expedier" className="hover:text-orange-600">Expédier un colis</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/colis/api" className="hover:text-orange-600">Documentation API</Link></li>
                <li><Link to="/colis/historique" className="hover:text-orange-600">Historique</Link></li>
                <li><a href="#" className="hover:text-orange-600">Contact</a></li>
                <li><a href="#" className="hover:text-orange-600">Aide</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Légal</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-orange-600">Conditions d'utilisation</a></li>
                <li><a href="#" className="hover:text-orange-600">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-orange-600">CGV</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 BantuDelice Colis. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ColisLandingPage; 