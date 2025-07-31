// Utilitaire pour la génération d'étiquettes PDF
// Note: En production, cela devrait être géré côté backend avec une vraie bibliothèque PDF

export interface LabelData {
  trackingNumber: string;
  type: 'national' | 'international';
  weight: number;
  sender: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
  recipient: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
  service: string;
  date: string;
  barcode?: string;
}

export class PDFLabelGenerator {
  private static generateBarcode(trackingNumber: string): string {
    // Simulation d'un code-barres en ASCII
    return `|${trackingNumber.split('').join('|')}|`;
  }

  private static generateQRCode(trackingNumber: string): string {
    // Simulation d'un QR code en ASCII
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

  static generateLabelContent(data: LabelData): string {
    const barcode = this.generateBarcode(data.trackingNumber);
    const qrCode = this.generateQRCode(data.trackingNumber);
    
    return `
╔══════════════════════════════════════════════════════════════╗
║                    ÉTIQUETTE D'EXPÉDITION                    ║
║                        BANTUDELICE                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  NUMÉRO DE TRACKING: ${data.trackingNumber.padEnd(20)} ║
║  TYPE: ${data.type.toUpperCase().padEnd(25)} ║
║  SERVICE: ${data.service.padEnd(22)} ║
║  POIDS: ${data.weight} kg${' '.repeat(25)} ║
║  DATE: ${data.date.padEnd(27)} ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                        EXPÉDITEUR                            ║
║                                                              ║
║  ${data.sender.name.padEnd(40)} ║
║  ${data.sender.address.padEnd(40)} ║
║  ${data.sender.city.padEnd(40)} ║
║  Tél: ${data.sender.phone.padEnd(35)} ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                       DESTINATAIRE                           ║
║                                                              ║
║  ${data.recipient.name.padEnd(40)} ║
║  ${data.recipient.address.padEnd(40)} ║
║  ${data.recipient.city.padEnd(40)} ║
║  Tél: ${data.recipient.phone.padEnd(35)} ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                        CODE-BARRES                           ║
║                                                              ║
║  ${barcode.padEnd(40)} ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                         QR CODE                              ║
║                                                              ║
${qrCode.split('\n').map(line => `║  ${line.padEnd(40)} ║`).join('\n')}
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  INSTRUCTIONS:                                               ║
║  • Coller cette étiquette sur le colis                      ║
║  • S'assurer que le code-barres est lisible                 ║
║  • Ne pas plier ou endommager l'étiquette                   ║
║                                                              ║
║  SUPPORT: support@bantudelice.cg                            ║
║  TÉLÉPHONE: +242 06 XXX XXX                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `;
  }

  static generateReceiptContent(data: LabelData): string {
    return `
╔══════════════════════════════════════════════════════════════╗
║                      REÇU D'EXPÉDITION                       ║
║                        BANTUDELICE                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  DATE: ${data.date.padEnd(40)} ║
║  NUMÉRO DE TRACKING: ${data.trackingNumber.padEnd(20)} ║
║  TYPE: ${data.type.toUpperCase().padEnd(25)} ║
║  SERVICE: ${data.service.padEnd(22)} ║
║  POIDS: ${data.weight} kg${' '.repeat(25)} ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                        EXPÉDITEUR                            ║
║                                                              ║
║  ${data.sender.name.padEnd(40)} ║
║  ${data.sender.address.padEnd(40)} ║
║  ${data.sender.city.padEnd(40)} ║
║  Tél: ${data.sender.phone.padEnd(35)} ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                       DESTINATAIRE                           ║
║                                                              ║
║  ${data.recipient.name.padEnd(40)} ║
║  ${data.recipient.address.padEnd(40)} ║
║  ${data.recipient.city.padEnd(40)} ║
║  Tél: ${data.recipient.phone.padEnd(35)} ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                        TARIFS                                ║
║                                                              ║
║  Service de base: ${this.calculateBasePrice(data.type).toLocaleString()} FCFA ║
║  Supplément poids: ${this.calculateWeightPrice(data.weight).toLocaleString()} FCFA ║
║  ─────────────────────────────────────────────────────────── ║
║  TOTAL: ${this.calculateTotalPrice(data).toLocaleString()} FCFA ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  CONDITIONS:                                                 ║
║  • Livraison sous 3-5 jours ouvrables                       ║
║  • Assurance incluse jusqu'à 500 000 FCFA                   ║
║  • Suivi en temps réel disponible                           ║
║                                                              ║
║  SUPPORT: support@bantudelice.cg                            ║
║  TÉLÉPHONE: +242 06 XXX XXX                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `;
  }

  private static calculateBasePrice(type: 'national' | 'international'): number {
    return type === 'national' ? 2500 : 5000;
  }

  private static calculateWeightPrice(weight: number): number {
    return weight * 500;
  }

  private static calculateTotalPrice(data: LabelData): number {
    return this.calculateBasePrice(data.type) + this.calculateWeightPrice(data.weight);
  }

  static downloadLabel(data: LabelData, filename?: string): void {
    try {
      const content = this.generateLabelContent(data);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `etiquette-${data.trackingNumber}.txt`;
      link.click();
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Erreur lors de la génération de l\'étiquette:', error);
      throw new Error('Impossible de générer l\'étiquette');
    }
  }

  static downloadReceipt(data: LabelData, filename?: string): void {
    try {
      const content = this.generateReceiptContent(data);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `recu-${data.trackingNumber}.txt`;
      link.click();
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Erreur lors de la génération du reçu:', error);
      throw new Error('Impossible de générer le reçu');
    }
  }
} 