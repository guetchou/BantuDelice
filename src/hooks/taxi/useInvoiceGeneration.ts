
import { useState } from 'react';
import { TaxiRide, TaxiDriver } from '@/types/taxi';
import { toast } from 'sonner';

interface InvoiceData {
  invoiceId: string;
  rideId: string;
  date: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
  driver: {
    name: string;
    vehicleType: string;
    licensePlate: string;
  };
  ride: {
    pickup: string;
    destination: string;
    startTime: string;
    endTime: string;
    distance: number;
    duration: number;
  };
  payment: {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    method: string;
    currency: string;
  };
  company: {
    name: string;
    address: string;
    phone: string;
    logo?: string;
    website?: string;
  };
}

/**
 * Hook pour la génération et l'envoi de factures
 */
export function useInvoiceGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(null);

  /**
   * Génère les données de la facture
   */
  const generateInvoiceData = (
    ride: TaxiRide,
    driver: TaxiDriver,
    userName: string,
    userEmail?: string,
    userPhone?: string
  ): InvoiceData => {
    // Générer un ID unique pour la facture
    const invoiceId = `INV-${Date.now().toString().slice(-8)}-${ride.id.slice(-4)}`;
    
    // Calculer la TVA (simplifié)
    const subtotal = ride.actual_price || ride.estimated_price;
    const taxRate = 0.18; // 18% TVA
    const taxAmount = Math.round(subtotal * taxRate);
    
    // Calculer la réduction (si applicable)
    const discount = ride.promo_discount || 0;
    
    // Calculer le total
    const total = subtotal + taxAmount - discount;
    
    // Créer l'objet facture
    const invoiceData: InvoiceData = {
      invoiceId,
      rideId: ride.id,
      date: new Date().toISOString(),
      customer: {
        name: userName,
        email: userEmail,
        phone: userPhone
      },
      driver: {
        name: driver.name,
        vehicleType: driver.vehicle_type,
        licensePlate: driver.license_plate
      },
      ride: {
        pickup: ride.pickup_address,
        destination: ride.destination_address,
        startTime: ride.pickup_time,
        endTime: ride.actual_arrival_time || new Date().toISOString(),
        distance: ride.distance_km || 0,
        duration: calculateDuration(ride.pickup_time, ride.actual_arrival_time)
      },
      payment: {
        subtotal,
        tax: taxAmount,
        discount,
        total,
        method: ride.payment_method,
        currency: 'FCFA'
      },
      company: {
        name: 'Taxi Express',
        address: 'Avenue du Port, Brazzaville, Congo',
        phone: '+242 06 123 4567',
        logo: '/logo.png',
        website: 'www.taxiexpress.cg'
      }
    };
    
    return invoiceData;
  };

  /**
   * Calcule la durée d'un trajet en minutes
   */
  const calculateDuration = (startTime?: string, endTime?: string): number => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    
    // Convertir en minutes
    return Math.round((end - start) / (1000 * 60));
  };

  /**
   * Génère une facture PDF pour une course
   */
  const generateInvoice = async (
    ride: TaxiRide,
    driver: TaxiDriver,
    userName: string,
    userEmail?: string,
    userPhone?: string
  ): Promise<Blob | null> => {
    setIsLoading(true);
    
    try {
      // Générer les données de la facture
      const invoiceData = generateInvoiceData(ride, driver, userName, userEmail, userPhone);
      setCurrentInvoice(invoiceData);
      
      // Dans une implémentation réelle, ici on appellerait une API ou une bibliothèque
      // pour générer un PDF. On simule le processus pour la démo.
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simuler un blob PDF
      const mockPdfBlob = new Blob(['PDF content'], { type: 'application/pdf' });
      
      toast.success('Facture générée avec succès', {
        description: `ID de facture: ${invoiceData.invoiceId}`
      });
      
      return mockPdfBlob;
    } catch (error) {
      console.error('Erreur lors de la génération de la facture:', error);
      toast.error('Impossible de générer la facture');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Envoie la facture par email
   */
  const sendInvoiceByEmail = async (
    invoiceData: InvoiceData,
    email: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Dans une implémentation réelle, ici on appellerait une API pour envoyer l'email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Facture envoyée par email', {
        description: `Un email a été envoyé à ${email}`
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la facture:', error);
      toast.error('Impossible d\'envoyer la facture par email');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Télécharge la facture en PDF
   */
  const downloadInvoice = async (
    ride: TaxiRide,
    driver: TaxiDriver,
    userName: string
  ): Promise<boolean> => {
    try {
      const pdfBlob = await generateInvoice(ride, driver, userName);
      
      if (!pdfBlob) {
        return false;
      }
      
      // Créer un URL pour le blob
      const blobUrl = URL.createObjectURL(pdfBlob);
      
      // Créer un lien de téléchargement
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `facture-taxi-${ride.id.slice(-6)}.pdf`;
      
      // Simuler un clic pour démarrer le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Libérer l'URL
      URL.revokeObjectURL(blobUrl);
      
      return true;
    } catch (error) {
      console.error('Erreur lors du téléchargement de la facture:', error);
      toast.error('Impossible de télécharger la facture');
      return false;
    }
  };

  return {
    isLoading,
    currentInvoice,
    generateInvoice,
    sendInvoiceByEmail,
    downloadInvoice
  };
}
