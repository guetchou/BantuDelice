import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, QrCode, X, CheckCircle, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose, isOpen }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen && !isScanning) {
      startScanning();
    }
    return () => {
      stopScanning();
    };
  }, [isOpen]);

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Utiliser la caméra arrière sur mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      // Simuler la détection QR (en production, utiliser une vraie librairie)
      setTimeout(() => {
        simulateQRDetection();
      }, 3000);

    } catch (err) {
      setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const simulateQRDetection = () => {
    // Simulation d'une détection QR
    const mockQRData = `BD${Date.now().toString().slice(-6)}`;
    setSuccess('QR Code détecté !');
    
    setTimeout(() => {
      onScan(mockQRData);
      onClose();
    }, 1000);
  };

  const handleManualInput = () => {
    const manualCode = prompt('Entrez le numéro de tracking manuellement:');
    if (manualCode) {
      onScan(manualCode);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Scanner QR Code
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Zone de scan */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 object-cover"
            />
            
            {/* Overlay de scan */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-white border-dashed w-48 h-48 rounded-lg flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-orange-500 rounded-lg relative">
                  {/* Coin de scan animé */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-500"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-500"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-500"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-500"></div>
                </div>
              </div>
            </div>

            {/* Indicateur de scan */}
            {isScanning && (
              <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                En cours de scan...
              </div>
            )}
          </div>

          {/* Messages d'état */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-700">{success}</span>
            </div>
          )}

          {/* Instructions */}
          <div className="text-center text-sm text-gray-600">
            <p>Placez le QR code dans le cadre pour le scanner</p>
            <p className="text-xs mt-1">Ou utilisez le bouton ci-dessous pour saisir manuellement</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleManualInput}
              className="flex-1"
            >
              Saisie manuelle
            </Button>
            <Button
              onClick={startScanning}
              disabled={isScanning}
              className="flex-1"
            >
              <Camera className="h-4 w-4 mr-2" />
              {isScanning ? 'Scanning...' : 'Scanner'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner; 