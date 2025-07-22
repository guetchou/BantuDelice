import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, CheckCircle, Clock, RefreshCw } from 'lucide-react';

const ColisNationalTracking: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    setLoading(true);
    setData(null);
    try {
      const res = await fetch(`/colis-national/${trackingNumber}`);
      if (!res.ok) throw new Error('Erreur serveur');
      const json = await res.json();
      setData(json);
    } catch (e) {
      setData({ error: 'Colis non trouvé ou erreur réseau.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200 py-8 px-2">
      <Card className="max-w-xl w-full shadow-2xl border-0 bg-white/90 backdrop-blur-xl z-10 animate-fade-in-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Truck className="h-6 w-6 animate-pulse" />
            Suivi de colis national
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <Input
              placeholder="Numéro de suivi (ex: 123456)"
              value={trackingNumber}
              onChange={e => setTrackingNumber(e.target.value)}
              className="flex-1 focus:ring-2 focus:ring-orange-400"
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
            />
            <Button onClick={handleTrack} disabled={loading || !trackingNumber} className="bg-gradient-to-r from-orange-400 to-yellow-300 text-white font-bold shadow-lg">
              {loading ? <RefreshCw className="animate-spin h-5 w-5" /> : <Truck className="h-5 w-5" />} Suivre
            </Button>
          </div>
          {data && !data.error && (
            <div className="bg-white/90 rounded-xl p-4 shadow-lg animate-fade-in-up">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="text-base px-3 py-1 font-bold shadow bg-yellow-100 text-orange-800">{data.status}</Badge>
                {data.status === 'En cours de livraison' && <Truck className="h-5 w-5 text-orange-500 animate-pulse" />}
                {data.status === 'Livré' && <CheckCircle className="h-5 w-5 text-green-500 animate-bounce" />}
              </div>
              <div className="mb-2 text-sm text-gray-500">{data.villeDepart} → {data.villeArrivee}</div>
              <ol className="relative border-l-4 border-orange-200 ml-2 my-4">
                {data.timeline.map((step: any, i: number) => (
                  <li key={i} className="mb-6 ml-4 flex items-center group">
                    <span className="absolute -left-6 flex items-center justify-center w-8 h-8 rounded-full shadow-lg bg-yellow-100 text-orange-800">
                      {step.label === 'Pris en charge' && <MapPin className="h-5 w-5" />}
                      {step.label === 'En transit' && <Truck className="h-5 w-5" />}
                      {step.label === 'En cours de livraison' && <Clock className="h-5 w-5" />}
                      {step.label === 'Livré' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-orange-700">{step.label}</span>
                      <span className="text-xs text-gray-500">{step.date}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {data && data.error && (
            <div className="text-red-600 font-bold text-center my-4">{data.error}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ColisNationalTracking; 