
import { useState } from 'react';
import { TaxiInvoice } from '@/types/taxi';
import { paymentApi } from '@/integrations/api/payments';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UseInvoiceGenerationOptions {
  onSuccess?: (invoiceData: { id: string; url: string }) => void;
  onError?: (error: Error) => void;
}

export function useInvoiceGeneration(options?: UseInvoiceGenerationOptions) {
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<TaxiInvoice | null>(null);
  
  /**
   * Generate an invoice for a completed ride
   */
  const generateInvoice = async (
    rideId: string,
    options?: {
      includeTip?: boolean;
      customAmount?: number;
      additionalItems?: Array<{name: string; amount: number}>;
      customerEmail?: string;
      sendEmail?: boolean;
    }
  ) => {
    setLoading(true);
    
    try {
      const response = await paymentApi.createInvoice(rideId, {
        include_tip: options?.includeTip,
        custom_amount: options?.customAmount,
        additional_items: options?.additionalItems,
        customer_email: options?.customerEmail,
        send_email: options?.sendEmail
      });
      
      // Fetch the full invoice details
      const invoiceDetails = await paymentApi.getInvoice(response.invoice_id);
      
      setInvoiceData({
        id: invoiceDetails.id,
        ride_id: invoiceDetails.ride_id,
        user_id: invoiceDetails.user_id,
        driver_id: invoiceDetails.driver_id,
        subtotal: invoiceDetails.subtotal,
        tax: invoiceDetails.tax,
        discount: invoiceDetails.discount,
        total: invoiceDetails.total,
        payment_method: invoiceDetails.payment_method,
        currency: invoiceDetails.currency,
        issued_at: invoiceDetails.issued_at,
        due_at: invoiceDetails.due_at,
        paid_at: invoiceDetails.paid_at,
        status: invoiceDetails.status,
        invoice_url: invoiceDetails.invoice_url,
        pdf_url: invoiceDetails.pdf_url,
        reference_number: invoiceDetails.reference_number
      });
      
      toast.success('Facture générée avec succès', {
        description: `Référence: ${invoiceDetails.reference_number}`
      });
      
      if (options?.onSuccess) {
        options.onSuccess({
          id: response.invoice_id,
          url: response.invoice_url
        });
      }
      
      return response;
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Erreur lors de la génération de la facture');
      
      if (options?.onError && error instanceof Error) {
        options.onError(error);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Send an invoice by email
   */
  const sendInvoice = async (invoiceId: string, email: string) => {
    setLoading(true);
    
    try {
      const response = await paymentApi.sendInvoiceByEmail(invoiceId, email);
      
      if (response.success) {
        toast.success('Facture envoyée par email', {
          description: `Envoyée à ${email}`
        });
      } else {
        toast.error('Erreur lors de l\'envoi de la facture');
      }
      
      return response;
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error('Erreur lors de l\'envoi de la facture');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Get a formatted invoice for display
   */
  const getFormattedInvoice = (invoice: TaxiInvoice) => {
    const issuedDate = format(
      new Date(invoice.issued_at),
      'dd MMMM yyyy',
      { locale: fr }
    );
    
    return {
      ...invoice,
      formattedDate: issuedDate,
      formattedTotal: formatCurrency(invoice.total),
      formattedSubtotal: formatCurrency(invoice.subtotal),
      formattedTax: formatCurrency(invoice.tax),
      formattedDiscount: invoice.discount > 0 ? formatCurrency(invoice.discount) : null
    };
  };
  
  return {
    loading,
    invoiceData,
    generateInvoice,
    sendInvoice,
    getFormattedInvoice
  };
}
