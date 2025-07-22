import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Button } from '@/components/ui/button';

const statusOptions = [
  { value: 'PENDING', label: 'En attente' },
  { value: 'IN_TRANSIT', label: 'En transit' },
  { value: 'OUT_FOR_DELIVERY', label: 'En cours de livraison' },
  { value: 'DELIVERED', label: 'Livré' },
  { value: 'FAILED', label: 'Échec' },
];

export default function TrackingScanUpdate() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [status, setStatus] = useState('IN_TRANSIT');
  const [scanResult, setScanResult] = useState('');
  const [geo, setGeo] = useState<{lat: number, lng: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Récupérer la géoloc du device
  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => setMessage('Géolocalisation refusée ou indisponible')
      );
    } else {
      setMessage('Géolocalisation non supportée');
    }
  };

  // Scan QR code
  const handleScan = (data: string | null) => {
    if (data) {
      setScanResult(data);
      setTrackingNumber(data);
      setMessage(null);
    }
  };

  // Envoi de la mise à jour
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/tracking/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingNumber,
          status,
          latitude: geo?.lat,
          longitude: geo?.lng,
          updatedBy: 'agent',
          scanType: 'qr',
        })
      });
      if (!res.ok) throw new Error('Erreur serveur');
      setMessage('Statut mis à jour avec succès !');
    } catch (err) {
      setMessage('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">Scan QR & mise à jour tracking</h2>
      <div className="mb-4">
        <QrReader
          onResult={result => handleScan(result?.getText() || null)}
          constraints={{ facingMode: 'environment' }}
        />
        {scanResult && <div className="mt-2 text-sm">Tracking détecté : <b>{scanResult}</b></div>}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Numéro de tracking</label>
          <input
            className="border rounded px-2 py-1 w-full"
            value={trackingNumber}
            onChange={e => setTrackingNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Nouveau statut</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <Button type="button" onClick={getGeolocation} className="mb-2">Récupérer la géolocalisation</Button>
          {geo && <span className="text-xs ml-2">({geo.lat.toFixed(5)}, {geo.lng.toFixed(5)})</span>}
        </div>
        <Button type="submit" disabled={loading}>{loading ? 'Mise à jour...' : 'Mettre à jour le tracking'}</Button>
        {message && <div className="mt-2 text-sm text-center text-blue-700">{message}</div>}
      </form>
    </div>
  );
} 