import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Package, Truck, Navigation } from 'lucide-react';

interface ColisMapProps {
  trackingInfo: {
    currentLocation?: {
      latitude: number;
      longitude: number;
    };
    sender: {
      address: string;
    };
    recipient: {
      address: string;
    };
    status: string;
    lastUpdate?: Date;
  };
  showRoute?: boolean;
}

const ColisMap: React.FC<ColisMapProps> = ({ trackingInfo, showRoute = true }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    // Simulation d'une carte interactive
    const canvas = document.createElement('canvas');
    canvas.width = mapRef.current.clientWidth || 600;
    canvas.height = 400;
    canvas.style.borderRadius = '8px';
    canvas.style.cursor = 'pointer';

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fond de carte avec grille
    const drawMap = () => {
      // Fond
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grille
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Points d'intérêt
      const points = [
        {
          x: 100,
          y: 150,
          label: 'Expéditeur',
          color: '#3b82f6',
          icon: '📦'
        },
        {
          x: 500,
          y: 250,
          label: 'Destinataire',
          color: '#10b981',
          icon: '🏠'
        }
      ];

      // Position actuelle du colis
      if (trackingInfo.currentLocation) {
        const colisX = 300;
        const colisY = 200;
        
        // Cercle de position
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(colisX, colisY, 12, 0, 2 * Math.PI);
        ctx.fill();

        // Bordure
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(colisX, colisY, 12, 0, 2 * Math.PI);
        ctx.stroke();

        // Icône de colis
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📦', colisX, colisY + 5);

        // Cercle de précision
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(colisX, colisY, 30, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label "Colis"
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.fillText('Colis', colisX, colisY + 35);
      }

      // Dessiner les points d'intérêt
      points.forEach(point => {
        // Cercle
        ctx.fillStyle = point.color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
        ctx.fill();

        // Icône
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(point.icon, point.x, point.y + 4);

        // Label
        ctx.fillStyle = '#374151';
        ctx.font = '11px Arial';
        ctx.fillText(point.label, point.x, point.y + 25);
      });

      // Itinéraire si activé
      if (showRoute) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(100, 150);
        ctx.lineTo(300, 200);
        ctx.lineTo(500, 250);
        ctx.stroke();
        ctx.setLineDash([]);

        // Flèches de direction
        const arrows = [
          { x: 200, y: 175 },
          { x: 400, y: 225 }
        ];

        arrows.forEach(arrow => {
          ctx.fillStyle = '#3b82f6';
          ctx.beginPath();
          ctx.moveTo(arrow.x - 5, arrow.y - 5);
          ctx.lineTo(arrow.x + 5, arrow.y);
          ctx.lineTo(arrow.x - 5, arrow.y + 5);
          ctx.closePath();
          ctx.fill();
        });
      }
    };

    drawMap();
    setMapLoaded(true);

    // Nettoyer et ajouter la carte
    mapRef.current.innerHTML = '';
    mapRef.current.appendChild(canvas);

    // Redessiner quand la fenêtre change de taille
    const handleResize = () => {
      if (mapRef.current) {
        canvas.width = mapRef.current.clientWidth || 600;
        drawMap();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [trackingInfo.currentLocation, showRoute]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Carte de suivi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="w-full h-96 bg-gray-50 rounded-lg overflow-hidden">
          {!mapLoaded && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                <p>Chargement de la carte...</p>
              </div>
            </div>
          )}
        </div>

        {/* Légende */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Colis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Expéditeur</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Destinataire</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Itinéraire</span>
          </div>
        </div>

        {/* Informations de localisation */}
        {trackingInfo.currentLocation && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Position actuelle</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Latitude:</span>
                <span className="font-mono ml-1">{trackingInfo.currentLocation.latitude.toFixed(6)}</span>
              </div>
              <div>
                <span className="text-gray-600">Longitude:</span>
                <span className="font-mono ml-1">{trackingInfo.currentLocation.longitude.toFixed(6)}</span>
              </div>
            </div>
            {trackingInfo.lastUpdate && (
              <p className="text-xs text-gray-500 mt-2">
                Dernière mise à jour: {new Date(trackingInfo.lastUpdate).toLocaleString('fr-FR')}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ColisMap; 