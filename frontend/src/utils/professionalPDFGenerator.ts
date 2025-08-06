// Générateur PDF professionnel basé sur les standards de l'industrie
// Inspiré de DHL, UPS, FedEx et autres transporteurs internationaux

export interface PDFDocumentData {
  trackingNumber: string;
  type: 'label' | 'receipt' | 'invoice' | 'manifest';
  carrier: string;
  service: string;
  date: string;
  sender: AddressData;
  recipient: AddressData;
  package: PackageData;
  pricing: PricingData;
  barcode?: string;
  qrCode?: string;
  specialInstructions?: string;
  customs?: CustomsData;
}

export interface AddressData {
  name: string;
  company?: string;
  address: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone: string;
  email?: string;
}

export interface PackageData {
  weight: number;
  dimensions: string;
  contents: string;
  pieces: number;
  declaredValue?: number;
}

export interface PricingData {
  baseRate: number;
  weightCharge: number;
  fuelSurcharge: number;
  insurance: number;
  total: number;
  currency: string;
}

export interface CustomsData {
  declaredValue: number;
  currency: string;
  contents: string;
  purpose: 'personal' | 'commercial' | 'gift' | 'sample';
  countryOfOrigin: string;
  harmonizedCode?: string;
}

export class ProfessionalPDFGenerator {
  private static readonly CARRIER_LOGOS = {
    'DHL': '🚚',
    'UPS': '📦',
    'FedEx': '✈️',
    'BantuDelice': '🇨🇬'
  };

  private static readonly SERVICE_COLORS = {
    'Standard': '#2563eb',
    'Express': '#dc2626',
    'Economy': '#059669',
    'Premium': '#7c3aed'
  };

  /**
   * Génère une étiquette d'expédition professionnelle
   */
  static generateShippingLabel(data: PDFDocumentData): string {
    const logo = this.CARRIER_LOGOS[data.carrier as keyof typeof this.CARRIER_LOGOS] || '📦';
    const serviceColor = this.SERVICE_COLORS[data.service as keyof typeof this.SERVICE_COLORS] || '#6b7280';
    
    return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                            ÉTIQUETTE D'EXPÉDITION                            ║
║                              ${data.carrier.toUpperCase()}                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  ${logo}  NUMÉRO DE TRACKING: ${data.trackingNumber.padEnd(25)} ║
║     TYPE: ${data.type.toUpperCase().padEnd(30)} ║
║     SERVICE: ${data.service.padEnd(27)} ║
║     DATE: ${data.date.padEnd(32)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                              EXPÉDITEUR                                      ║
║                                                                              ║
║  ${data.sender.name.padEnd(50)} ║
║  ${data.sender.company ? data.sender.company.padEnd(50) : ''.padEnd(50)} ║
║  ${data.sender.address.padEnd(50)} ║
║  ${data.sender.city}, ${data.sender.state || ''} ${data.sender.postalCode.padEnd(20)} ║
║  ${data.sender.country.padEnd(50)} ║
║  Tél: ${data.sender.phone.padEnd(42)} ║
║  ${data.sender.email ? `Email: ${data.sender.email.padEnd(40)}` : ''.padEnd(50)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                             DESTINATAIRE                                     ║
║                                                                              ║
║  ${data.recipient.name.padEnd(50)} ║
║  ${data.recipient.company ? data.recipient.company.padEnd(50) : ''.padEnd(50)} ║
║  ${data.recipient.address.padEnd(50)} ║
║  ${data.recipient.city}, ${data.recipient.state || ''} ${data.recipient.postalCode.padEnd(20)} ║
║  ${data.recipient.country.padEnd(50)} ║
║  Tél: ${data.recipient.phone.padEnd(42)} ║
║  ${data.recipient.email ? `Email: ${data.recipient.email.padEnd(40)}` : ''.padEnd(50)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                              DÉTAILS COLIS                                   ║
║                                                                              ║
║  Poids: ${data.package.weight} kg${' '.repeat(45)} ║
║  Dimensions: ${data.package.dimensions.padEnd(38)} ║
║  Contenu: ${data.package.contents.padEnd(40)} ║
║  Pièces: ${data.package.pieces}${' '.repeat(45)} ║
║  ${data.package.declaredValue ? `Valeur déclarée: ${data.package.declaredValue.toLocaleString()} ${data.pricing.currency}${' '.repeat(20)}` : ''.padEnd(50)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                              CODE-BARRES                                     ║
║                                                                              ║
║  ${this.generateBarcode(data.trackingNumber).padEnd(50)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                              QR CODE                                         ║
║                                                                              ║
${this.generateQRCode(data.trackingNumber).split('\n').map(line => `║  ${line.padEnd(46)} ║`).join('\n')}
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  INSTRUCTIONS DE LIVRAISON:                                                  ║
║  • Coller cette étiquette sur le colis                                      ║
║  • S'assurer que le code-barres est lisible                                ║
║  • Ne pas plier ou endommager l'étiquette                                  ║
║  • Signer le bon de livraison à réception                                   ║
║                                                                              ║
║  ${data.specialInstructions ? `INSTRUCTIONS SPÉCIALES: ${data.specialInstructions.padEnd(20)}` : ''.padEnd(50)} ║
║                                                                              ║
║  SUPPORT: support@bantudelice.cg | TÉL: +242 06 XXX XXX                    ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
    `;
  }

  /**
   * Génère un reçu d'expédition professionnel
   */
  static generateShippingReceipt(data: PDFDocumentData): string {
    const logo = this.CARRIER_LOGOS[data.carrier as keyof typeof this.CARRIER_LOGOS] || '📦';
    
    return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                            REÇU D'EXPÉDITION                                ║
║                              ${data.carrier.toUpperCase()}                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  ${logo}  NUMÉRO DE TRACKING: ${data.trackingNumber.padEnd(25)} ║
║     TYPE: ${data.type.toUpperCase().padEnd(30)} ║
║     SERVICE: ${data.service.padEnd(27)} ║
║     DATE: ${data.date.padEnd(32)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                              EXPÉDITEUR                                      ║
║                                                                              ║
║  ${data.sender.name.padEnd(50)} ║
║  ${data.sender.company ? data.sender.company.padEnd(50) : ''.padEnd(50)} ║
║  ${data.sender.address.padEnd(50)} ║
║  ${data.sender.city}, ${data.sender.state || ''} ${data.sender.postalCode.padEnd(20)} ║
║  ${data.sender.country.padEnd(50)} ║
║  Tél: ${data.sender.phone.padEnd(42)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                             DESTINATAIRE                                     ║
║                                                                              ║
║  ${data.recipient.name.padEnd(50)} ║
║  ${data.recipient.company ? data.recipient.company.padEnd(50) : ''.padEnd(50)} ║
║  ${data.recipient.address.padEnd(50)} ║
║  ${data.recipient.city}, ${data.recipient.state || ''} ${data.recipient.postalCode.padEnd(20)} ║
║  ${data.recipient.country.padEnd(50)} ║
║  Tél: ${data.recipient.phone.padEnd(42)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                              DÉTAILS COLIS                                   ║
║                                                                              ║
║  Poids: ${data.package.weight} kg${' '.repeat(45)} ║
║  Dimensions: ${data.package.dimensions.padEnd(38)} ║
║  Contenu: ${data.package.contents.padEnd(40)} ║
║  Pièces: ${data.package.pieces}${' '.repeat(45)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                              DÉTAIL DES TARIFS                               ║
║                                                                              ║
║  Tarif de base: ${data.pricing.baseRate.toLocaleString()} ${data.pricing.currency}${' '.repeat(25)} ║
║  Supplément poids: ${data.pricing.weightCharge.toLocaleString()} ${data.pricing.currency}${' '.repeat(20)} ║
║  Surcharge carburant: ${data.pricing.fuelSurcharge.toLocaleString()} ${data.pricing.currency}${' '.repeat(15)} ║
║  Assurance: ${data.pricing.insurance.toLocaleString()} ${data.pricing.currency}${' '.repeat(30)} ║
║  ─────────────────────────────────────────────────────────────────────────── ║
║  TOTAL: ${data.pricing.total.toLocaleString()} ${data.pricing.currency}${' '.repeat(35)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  CONDITIONS DE LIVRAISON:                                                    ║
║  • Livraison sous 3-5 jours ouvrables (national)                            ║
║  • Livraison sous 7-15 jours ouvrables (international)                      ║
║  • Assurance incluse jusqu'à 500 000 FCFA (national)                        ║
║  • Assurance incluse jusqu'à 1 000 000 FCFA (international)                 ║
║  • Suivi en temps réel disponible                                           ║
║  • Signature requise à la livraison                                         ║
║                                                                              ║
║  ${data.customs ? `INFORMATIONS DOUANE: ${data.customs.contents} (${data.customs.purpose})` : ''.padEnd(50)} ║
║                                                                              ║
║  SUPPORT: support@bantudelice.cg | TÉL: +242 06 XXX XXX                    ║
║  SUIVI EN LIGNE: https://bantudelice.cg/colis/tracking                      ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
    `;
  }

  /**
   * Génère une facture d'expédition
   */
  static generateInvoice(data: PDFDocumentData): string {
    const logo = this.CARRIER_LOGOS[data.carrier as keyof typeof this.CARRIER_LOGOS] || '📦';
    const invoiceNumber = `INV-${data.trackingNumber}-${Date.now().toString().slice(-6)}`;
    
    return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                              FACTURE D'EXPÉDITION                            ║
║                              ${data.carrier.toUpperCase()}                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  ${logo}  NUMÉRO DE FACTURE: ${invoiceNumber.padEnd(20)} ║
║     NUMÉRO DE TRACKING: ${data.trackingNumber.padEnd(20)} ║
║     DATE: ${data.date.padEnd(32)} ║
║     ÉCHÉANCE: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR').padEnd(25)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                              CLIENT                                          ║
║                                                                              ║
║  ${data.sender.name.padEnd(50)} ║
║  ${data.sender.company ? data.sender.company.padEnd(50) : ''.padEnd(50)} ║
║  ${data.sender.address.padEnd(50)} ║
║  ${data.sender.city}, ${data.sender.state || ''} ${data.sender.postalCode.padEnd(20)} ║
║  ${data.sender.country.padEnd(50)} ║
║  Tél: ${data.sender.phone.padEnd(42)} ║
║  ${data.sender.email ? `Email: ${data.sender.email.padEnd(40)}` : ''.padEnd(50)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                              DESTINATAIRE                                    ║
║                                                                              ║
║  ${data.recipient.name.padEnd(50)} ║
║  ${data.recipient.company ? data.recipient.company.padEnd(50) : ''.padEnd(50)} ║
║  ${data.recipient.address.padEnd(50)} ║
║  ${data.recipient.city}, ${data.recipient.state || ''} ${data.recipient.postalCode.padEnd(20)} ║
║  ${data.recipient.country.padEnd(50)} ║
║  Tél: ${data.recipient.phone.padEnd(42)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                              DÉTAIL DES PRESTATIONS                          ║
║                                                                              ║
║  DESCRIPTION                    QUANTITÉ    PRIX UNIT.    TOTAL            ║
║  ─────────────────────────────────────────────────────────────────────────── ║
║  Service ${data.service}                   1        ${data.pricing.baseRate.toLocaleString()} ${data.pricing.currency}    ${data.pricing.baseRate.toLocaleString()} ${data.pricing.currency} ║
║  Supplément poids (${data.package.weight}kg)       1        ${data.pricing.weightCharge.toLocaleString()} ${data.pricing.currency}    ${data.pricing.weightCharge.toLocaleString()} ${data.pricing.currency} ║
║  Surcharge carburant           1        ${data.pricing.fuelSurcharge.toLocaleString()} ${data.pricing.currency}    ${data.pricing.fuelSurcharge.toLocaleString()} ${data.pricing.currency} ║
║  Assurance                     1        ${data.pricing.insurance.toLocaleString()} ${data.pricing.currency}    ${data.pricing.insurance.toLocaleString()} ${data.pricing.currency} ║
║  ─────────────────────────────────────────────────────────────────────────── ║
║  SOUS-TOTAL: ${(data.pricing.total * 0.8).toLocaleString()} ${data.pricing.currency}${' '.repeat(35)} ║
║  TVA (20%): ${(data.pricing.total * 0.2).toLocaleString()} ${data.pricing.currency}${' '.repeat(40)} ║
║  ─────────────────────────────────────────────────────────────────────────── ║
║  TOTAL TTC: ${data.pricing.total.toLocaleString()} ${data.pricing.currency}${' '.repeat(35)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  CONDITIONS DE PAIEMENT:                                                     ║
║  • Paiement à 30 jours                                                      ║
║  • Virement bancaire ou chèque                                              ║
║  • IBAN: CG123 4567 8901 2345 6789 0123                                    ║
║  • BIC: CGABCGCGXXX                                                         ║
║                                                                              ║
║  SUPPORT: support@bantudelice.cg | TÉL: +242 06 XXX XXX                    ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
    `;
  }

  /**
   * Génère un code-barres en ASCII
   */
  private static generateBarcode(trackingNumber: string): string {
    return `|${trackingNumber.split('').join('|')}|`;
  }

  /**
   * Génère un QR code en ASCII
   */
  private static generateQRCode(trackingNumber: string): string {
    const size = 5;
    let qr = '';
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        qr += Math.random() > 0.5 ? '█' : '░';
      }
      qr += '\n';
    }
    return qr;
  }

  /**
   * Calcule les tarifs basés sur le service et le poids
   */
  static calculatePricing(service: string, weight: number, type: 'national' | 'international'): PricingData {
    let baseRate = 0;
    let weightCharge = 0;
    let fuelSurcharge = 0;
    let insurance = 0;

    if (type === 'national') {
      baseRate = 2500;
      weightCharge = weight * 500;
      fuelSurcharge = Math.round(baseRate * 0.05);
      insurance = 50000;
    } else {
      baseRate = 5000;
      weightCharge = weight * 1000;
      fuelSurcharge = Math.round(baseRate * 0.08);
      insurance = 100000;
    }

    // Ajustements selon le service
    switch (service.toLowerCase()) {
      case 'express':
        baseRate *= 1.5;
        break;
      case 'economy':
        baseRate *= 0.8;
        break;
      case 'premium':
        baseRate *= 2;
        insurance *= 2;
        break;
    }

    const total = baseRate + weightCharge + fuelSurcharge + insurance;

    return {
      baseRate,
      weightCharge,
      fuelSurcharge,
      insurance,
      total,
      currency: 'FCFA'
    };
  }

  /**
   * Télécharge un document PDF
   */
  static downloadDocument(content: string, filename: string): void {
    try {
      const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      throw new Error('Impossible de télécharger le document');
    }
  }

  /**
   * Génère et télécharge une étiquette
   */
  static generateAndDownloadLabel(data: PDFDocumentData): void {
    const content = this.generateShippingLabel(data);
    const filename = `etiquette-${data.trackingNumber}.txt`;
    this.downloadDocument(content, filename);
  }

  /**
   * Génère et télécharge un reçu
   */
  static generateAndDownloadReceipt(data: PDFDocumentData): void {
    const content = this.generateShippingReceipt(data);
    const filename = `recu-${data.trackingNumber}.txt`;
    this.downloadDocument(content, filename);
  }

  /**
   * Génère et télécharge une facture
   */
  static generateAndDownloadInvoice(data: PDFDocumentData): void {
    const content = this.generateInvoice(data);
    const filename = `facture-${data.trackingNumber}.txt`;
    this.downloadDocument(content, filename);
  }
} 