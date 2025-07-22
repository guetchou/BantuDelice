/**
 * ColisNationalPage - Page d'envoi de colis avec paiement multi-provider (MTN MoMo, Airtel Money)
 * - Utilise PaymentGateway pour la sélection du provider et l'initiation du paiement
 * - Transmet paymentMethod au backend pour routage dynamique
 * - Monitoring UX : logs frontend pour chaque étape clé
 * - Polling automatique du statut de paiement
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Truck, Calculator, Download, Clock, CheckCircle } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

import ColisImageUpload from '@/components/colis/ColisImageUpload';
import Stepper from '@/components/colis/Stepper';
import PaymentGateway from '@/components/colis/PaymentGateway';

const villesNationales = [
  'Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Ouesso', 'Owando', 'Madingou', 'Loango', 'Impfondo', 'Ewo', 'Kinkala'
];
const partenaires = [
  { name: 'Congo Express', value: 'congo_express' },
  { name: 'Taxi Colis', value: 'taxi_colis' },
  { name: 'Colis Rapide', value: 'colis_rapide' }
];
const packageTypes = [
  { label: 'Document', value: 'DOCUMENT' },
  { label: 'Petit colis', value: 'SMALL_PACKAGE' },
  { label: 'Moyen colis', value: 'MEDIUM_PACKAGE' },
  { label: 'Gros colis', value: 'LARGE_PACKAGE' },
  { label: 'Fragile', value: 'FRAGILE' },
  { label: 'Électronique', value: 'ELECTRONICS' },
  { label: 'Autre', value: 'OTHER' }
];
const deliverySpeeds = [
  { label: 'Économique', value: 'ECONOMY' },
  { label: 'Standard', value: 'STANDARD' },
  { label: 'Express', value: 'EXPRESS' },
];

const ColisNationalPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    sender_name: '', sender_phone: '', sender_address: '', sender_city: '',
    recipient_name: '', recipient_phone: '', recipient_address: '', recipient_city: '',
    package_type: 'SMALL_PACKAGE', package_description: '',
    weight_kg: '', length_cm: '', width_cm: '', height_cm: '',
    delivery_speed: 'STANDARD',
    // pickup_notes et delivery_notes sont retirés du state car non utilisés dans un champ de formulaire
    requires_signature: false, is_fragile: false, is_insured: false,
    partner: partenaires[0].value
  });
  const [images, setImages] = useState<string[]>([]);
  const [calcul, setCalcul] = useState<{base: number, assurance: number, total: number, estimation: string}|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [colisInfo, setColisInfo] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (step === 5 && colisInfo?.trackingNumber) {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/colis-national/${colisInfo.trackingNumber}`);
          if (!res.ok) return;
          const data = await res.json();
          if (data.status === 'PENDING') {
            setColisInfo(data);
            setStep(6);
            clearInterval(interval);
          }
        } catch (e) {
          console.error("Erreur de polling:", e);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [step, colisInfo]);


  const steps = ["Infos", "Colis", "Récap.", "Paiement", "En Attente", "Confirmation"];

  const calculerPrixLocal = () => {
    let base = 2000;
    switch(formData.package_type) {
      case 'DOCUMENT': base = 1000; break;
      case 'SMALL_PACKAGE': base = 2000; break;
      case 'MEDIUM_PACKAGE': base = 3500; break;
      case 'LARGE_PACKAGE': base = 5000; break;
      case 'FRAGILE': base = 4000; break;
      case 'ELECTRONICS': base = 4500; break;
      default: base = 2500;
    }
    switch(formData.delivery_speed) {
      case 'ECONOMY': base *= 0.8; break;
      case 'STANDARD': base *= 1.0; break;
      case 'EXPRESS': base *= 1.5; break;
    }
    base += (parseFloat(formData.weight_kg) || 0) * 500;
    const assurance = formData.is_insured ? Math.round(base * 0.15) : 0;
    const total = Math.round(base + assurance);
    let estimation = '2-3 jours';
    if(formData.delivery_speed==='EXPRESS') estimation = '24h';
    if(formData.delivery_speed==='SAME_DAY') estimation = 'Le jour même';
    setCalcul({ base, assurance, total, estimation });
  };
  
  const validateStep = (targetStep: number): boolean => {
    setError(null);
    switch (targetStep) {
        case 1:
            if (!formData.sender_name || !formData.sender_phone || !formData.sender_address || !formData.sender_city ||
                !formData.recipient_name || !formData.recipient_phone || !formData.recipient_address || !formData.recipient_city) {
                setError("Veuillez remplir toutes les informations sur l'expéditeur et le destinataire.");
                return false;
            }
            break;
        case 2:
            if (!formData.package_type || !formData.weight_kg || isNaN(parseFloat(formData.weight_kg)) || parseFloat(formData.weight_kg) <= 0) {
                setError("Veuillez fournir un type de colis et un poids valide (supérieur à 0).");
                return false;
            }
            break;
        default:
            break;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) {
        return;
    }
    if (step === 2) {
        calculerPrixLocal();
    }
    setStep(s => s + 1);
  };
  const handlePrev = () => setStep(s => s - 1);

  const handlePaymentInitiate = async (paymentMethod: 'momo' | 'airtel', phoneNumber: string) => {
    setLoading(true);
    setError(null);
    try {
        const payload = {
            ...formData,
            sender_phone: phoneNumber,
            images,
            paymentMethod: paymentMethod === 'momo' ? 'mtn' : 'airtel',
            weight_kg: Number(formData.weight_kg),
            length_cm: Number(formData.length_cm),
            width_cm: Number(formData.width_cm),
            height_cm: Number(formData.height_cm),
        };
        console.log('Payload envoyé à l’API:', payload);

        const res = await fetch('/api/colis-national/initiate-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const text = await res.text();
            setError(text);
            setLoading(false);
            return;
        }

        const data = await res.json();
        setColisInfo(data);
        setStep(5);
        // Log UX
        console.log(`[Paiement] Demande envoyée via ${paymentMethod} pour ${phoneNumber}`);

    } catch (e) {
        setError('Erreur lors de l\'initiation du paiement.');
    } finally {
        setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1: return (
          <Card>
              <CardHeader><CardTitle>Informations Expéditeur & Destinataire</CardTitle></CardHeader>
              <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Expéditeur</h3>
                        <Input id="sender_name" value={formData.sender_name} onChange={e => setFormData({...formData, sender_name: e.target.value})} placeholder="Nom complet" required/>
                        <Input id="sender_phone" value={formData.sender_phone} onChange={e => setFormData({...formData, sender_phone: e.target.value})} placeholder="Téléphone" required/>
                        <Textarea id="sender_address" value={formData.sender_address} onChange={e => setFormData({...formData, sender_address: e.target.value})} placeholder="Adresse complète" required/>
                        <Select value={formData.sender_city} onValueChange={value => setFormData({...formData, sender_city: value})}>
                            <SelectTrigger><SelectValue placeholder="Ville de départ"/></SelectTrigger>
                            <SelectContent>{villesNationales.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Destinataire</h3>
                        <Input id="recipient_name" value={formData.recipient_name} onChange={e => setFormData({...formData, recipient_name: e.target.value})} placeholder="Nom complet" required/>
                        <Input id="recipient_phone" value={formData.recipient_phone} onChange={e => setFormData({...formData, recipient_phone: e.target.value})} placeholder="Téléphone" required/>
                        <Textarea id="recipient_address" value={formData.recipient_address} onChange={e => setFormData({...formData, recipient_address: e.target.value})} placeholder="Adresse complète" required/>
                        <Select value={formData.recipient_city} onValueChange={value => setFormData({...formData, recipient_city: value})}>
                            <SelectTrigger><SelectValue placeholder="Ville de destination"/></SelectTrigger>
                            <SelectContent>{villesNationales.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                  </div>
              </CardContent>
          </Card>
      );
      case 2: return (
        <Card>
          <CardHeader><CardTitle>Informations sur le Colis</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
                <Select value={formData.package_type} onValueChange={value => setFormData({...formData, package_type: value})}>
                    <SelectTrigger><SelectValue placeholder="Type de colis"/></SelectTrigger>
                    <SelectContent>{packageTypes.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                </Select>
                <Textarea id="package_description" value={formData.package_description} onChange={e => setFormData({...formData, package_description: e.target.value})} placeholder="Description détaillée du contenu"/>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Input id="weight_kg" type="number" value={formData.weight_kg} onChange={e => setFormData({...formData, weight_kg: e.target.value})} placeholder="Poids (kg)" required/>
                    <Input id="length_cm" value={formData.length_cm} onChange={e => setFormData({...formData, length_cm: e.target.value})} placeholder="L (cm)"/>
                    <Input id="width_cm" value={formData.width_cm} onChange={e => setFormData({...formData, width_cm: e.target.value})} placeholder="l (cm)"/>
                    <Input id="height_cm" value={formData.height_cm} onChange={e => setFormData({...formData, height_cm: e.target.value})} placeholder="H (cm)"/>
                </div>
                <ColisImageUpload onImagesUpload={setImages} />
            </div>
          </CardContent>
        </Card>
      );
      case 3: return (
        <Card>
            <CardHeader><CardTitle>Récapitulatif de votre envoi</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2">Expéditeur</h3>
                    <p>{formData.sender_name}, {formData.sender_phone}</p>
                    <p>{formData.sender_address}, {formData.sender_city}</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Destinataire</h3>
                    <p>{formData.recipient_name}, {formData.recipient_phone}</p>
                    <p>{formData.recipient_address}, {formData.recipient_city}</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Détails du colis</h3>
                    <p>Type: {packageTypes.find(p => p.value === formData.package_type)?.label}</p>
                    <p>Poids: {formData.weight_kg} kg</p>
                    <p>Description: {formData.package_description}</p>
                    {images.length > 0 && <p>Images: {images.length} photo(s)</p>}
                </div>
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Tarif Final</span>
                        <span className="text-2xl font-bold text-orange-600">{calcul?.total.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                </div>
            </CardContent>
        </Card>
      );
      case 4: return (
        <PaymentGateway 
          amount={calcul?.total || 0}
          onPaymentInitiate={handlePaymentInitiate}
          isProcessing={loading}
        />
      );
      case 5: return (
        <Card>
            <CardHeader><CardTitle>En attente de confirmation</CardTitle></CardHeader>
            <CardContent className="text-center space-y-4 py-12">
                <Clock className="mx-auto h-12 w-12 text-orange-500 animate-spin"/>
                <p className="font-semibold text-lg">Vérification du paiement en cours...</p>
                <p className="text-gray-600">Veuillez patienter pendant que nous confirmons votre transaction.</p>
                <p className="text-sm text-gray-500">Cela peut prendre quelques instants.</p>
            </CardContent>
        </Card>
      );
      case 6: return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl text-green-600 flex items-center gap-2"><CheckCircle/>Envoi confirmé !</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <p>Votre colis a été enregistré avec succès. Voici vos informations de suivi :</p>
                <div>
                    <p className="text-sm text-gray-500">Numéro de suivi</p>
                    <p className="text-lg font-bold tracking-widest">{colisInfo?.trackingNumber}</p>
                </div>
                <div className="flex justify-center my-4">
                    <QRCodeCanvas 
                        value={colisInfo?.trackingNumber || ''}
                        size={128}
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"L"}
                        includeMargin={false}
                    />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Date de livraison estimée</p>
                    <p className="text-lg font-bold">{new Date(colisInfo?.estimatedDeliveryDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <p className="text-xs text-gray-500">Vous recevrez des notifications par SMS et email.</p>
                <Button onClick={() => window.print()}><Download className="mr-2 h-4 w-4" /> Télécharger le reçu</Button>
            </CardContent>
        </Card>
      );
      default: return null;
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
        <header className={`sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-white/90 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo/logo.png" alt="BantuDelice" className="h-10 w-10 rounded-full border-2 border-orange-400 shadow" />
                        <span className={`font-bold text-orange-700 text-xl transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
                            Envoi National
                        </span>
                    </div>
                    <nav className={`hidden md:flex items-center gap-6 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
                        <Link to="/tracking" className="text-orange-700 hover:text-orange-900 font-medium">Suivi</Link>
                        <Link to="/services" className="text-orange-700 hover:text-orange-900 font-medium">Nos Services</Link>
                    </nav>
                </div>
            </div>
        </header>

        <main className="container mx-auto max-w-4xl py-8 px-4 -mt-16">
            <header className="text-center mb-8 pt-16">
                <h1 className="text-3xl font-bold">Envoyer  et recevoir son colis partout au Congo</h1>
                <p className="text-gray-600 mt-2">Simple, rapide et sécurisé pour tous vos envois au Congo.</p>
            </header>

            <Stepper currentStep={step} steps={steps} />

            {error && <p className="text-red-500 mb-4 text-center bg-red-100 p-3 rounded-lg">{error}</p>}

            {renderStep()}

            <div className="mt-8 flex justify-between items-center">
                <div>
                    {step > 1 && step < 5 && (
                        <Button variant="outline" onClick={handlePrev}>Précédent</Button>
                    )}
                </div>
                <div>
                    {step < 3 && (
                        <Button onClick={handleNext}>Suivant</Button>
                    )}
                    {step === 3 && (
                        <Button onClick={handleNext}>Procéder au paiement</Button>
                    )}
                    {step === 6 && (
                        <Link to={colisInfo?.trackingNumber ? `/tracking/${colisInfo.trackingNumber}`: '/tracking'}>
                            <Button>Suivre mon colis</Button>
                        </Link>
                    )}
                </div>
            </div>
        </main>
    </div>
  );
};

export default ColisNationalPage;