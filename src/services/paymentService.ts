import { supabase } from '@/integrations/supabase/client';

export interface PaymentTransaction {
  id: string;
  user_id: string;
  order_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  provider_data?: any;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'mobile_money' | 'card' | 'wallet' | 'cash';
  provider?: string;
  last_four?: string;
  is_default: boolean;
  metadata?: any;
  created_at: string;
}

export class PaymentService {
  // Créer une nouvelle transaction de paiement
  static async createTransaction(data: {
    user_id: string;
    order_id: string;
    amount: number;
    currency: string;
    payment_method: string;
    provider_data?: any;
  }): Promise<PaymentTransaction> {
    const { data: transaction, error } = await supabase
      .from('payment_transactions')
      .insert({
        ...data,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création de la transaction: ${error.message}`);
    }

    return transaction;
  }

  // Mettre à jour le statut d'une transaction
  static async updateTransactionStatus(
    transactionId: string,
    status: PaymentTransaction['status'],
    provider_data?: any
  ): Promise<void> {
    const { error } = await supabase
      .from('payment_transactions')
      .update({
        status,
        provider_data,
        updated_at: new Date().toISOString()
      })
      .eq('id', transactionId);

    if (error) {
      throw new Error(`Erreur lors de la mise à jour de la transaction: ${error.message}`);
    }
  }

  // Récupérer les transactions d'un utilisateur
  static async getUserTransactions(userId: string): Promise<PaymentTransaction[]> {
    const { data: transactions, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération des transactions: ${error.message}`);
    }

    return transactions || [];
  }

  // Récupérer une transaction spécifique
  static async getTransaction(transactionId: string): Promise<PaymentTransaction | null> {
    const { data: transaction, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error) {
      throw new Error(`Erreur lors de la récupération de la transaction: ${error.message}`);
    }

    return transaction;
  }

  // Sauvegarder une méthode de paiement
  static async savePaymentMethod(data: {
    user_id: string;
    type: PaymentMethod['type'];
    provider?: string;
    last_four?: string;
    is_default?: boolean;
    metadata?: any;
  }): Promise<PaymentMethod> {
    const { data: paymentMethod, error } = await supabase
      .from('payment_methods')
      .insert({
        ...data,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la sauvegarde de la méthode de paiement: ${error.message}`);
    }

    return paymentMethod;
  }

  // Récupérer les méthodes de paiement d'un utilisateur
  static async getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    const { data: paymentMethods, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération des méthodes de paiement: ${error.message}`);
    }

    return paymentMethods || [];
  }

  // Supprimer une méthode de paiement
  static async deletePaymentMethod(methodId: string): Promise<void> {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', methodId);

    if (error) {
      throw new Error(`Erreur lors de la suppression de la méthode de paiement: ${error.message}`);
    }
  }

  // Traitement des paiements Mobile Money
  static async processMobileMoneyPayment(data: {
    phoneNumber: string;
    operator: string;
    amount: number;
    currency: string;
    orderId: string;
    userId: string;
  }): Promise<PaymentTransaction> {
    // Créer la transaction
    const transaction = await this.createTransaction({
      user_id: data.userId,
      order_id: data.orderId,
      amount: data.amount,
      currency: data.currency,
      payment_method: 'mobile_money',
      provider_data: {
        phone_number: data.phoneNumber,
        operator: data.operator
      }
    });

    // Simuler le traitement (dans un vrai projet, vous appelleriez l'API de l'opérateur)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mettre à jour le statut
    await this.updateTransactionStatus(transaction.id, 'completed', {
      ...transaction.provider_data,
      processed_at: new Date().toISOString()
    });

    return transaction;
  }

  // Traitement des paiements par carte
  static async processCardPayment(data: {
    cardNumber: string;
    cardHolder: string;
    cardExpiry: string;
    cardCvv: string;
    amount: number;
    currency: string;
    orderId: string;
    userId: string;
  }): Promise<PaymentTransaction> {
    // Créer la transaction
    const transaction = await this.createTransaction({
      user_id: data.userId,
      order_id: data.orderId,
      amount: data.amount,
      currency: data.currency,
      payment_method: 'card',
      provider_data: {
        card_holder: data.cardHolder,
        last_four: data.cardNumber.slice(-4),
        expiry: data.cardExpiry
      }
    });

    // Simuler le traitement (dans un vrai projet, vous appelleriez Stripe ou autre)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mettre à jour le statut
    await this.updateTransactionStatus(transaction.id, 'completed', {
      ...transaction.provider_data,
      processed_at: new Date().toISOString()
    });

    return transaction;
  }

  // Traitement des paiements en espèces
  static async processCashPayment(data: {
    amount: number;
    currency: string;
    orderId: string;
    userId: string;
  }): Promise<PaymentTransaction> {
    // Créer la transaction
    const transaction = await this.createTransaction({
      user_id: data.userId,
      order_id: data.orderId,
      amount: data.amount,
      currency: data.currency,
      payment_method: 'cash'
    });

    // Mettre à jour le statut
    await this.updateTransactionStatus(transaction.id, 'pending');

    return transaction;
  }

  // Traitement des paiements par portefeuille
  static async processWalletPayment(data: {
    amount: number;
    currency: string;
    orderId: string;
    userId: string;
  }): Promise<PaymentTransaction> {
    // Vérifier le solde du portefeuille (à implémenter)
    // const walletBalance = await this.getWalletBalance(data.userId);
    // if (walletBalance < data.amount) {
    //   throw new Error('Solde insuffisant');
    // }

    // Créer la transaction
    const transaction = await this.createTransaction({
      user_id: data.userId,
      order_id: data.orderId,
      amount: data.amount,
      currency: data.currency,
      payment_method: 'wallet'
    });

    // Déduire du portefeuille (à implémenter)
    // await this.deductFromWallet(data.userId, data.amount);

    // Mettre à jour le statut
    await this.updateTransactionStatus(transaction.id, 'completed');

    return transaction;
  }

  // Rembourser une transaction
  static async refundTransaction(transactionId: string, reason?: string): Promise<void> {
    const transaction = await this.getTransaction(transactionId);
    if (!transaction) {
      throw new Error('Transaction non trouvée');
    }

    if (transaction.status !== 'completed') {
      throw new Error('Seules les transactions complétées peuvent être remboursées');
    }

    // Mettre à jour le statut
    await this.updateTransactionStatus(transactionId, 'refunded', {
      refund_reason: reason,
      refunded_at: new Date().toISOString()
    });

    // Traiter le remboursement selon la méthode de paiement
    if (transaction.payment_method === 'wallet') {
      // Remettre dans le portefeuille
      // await this.addToWallet(transaction.user_id, transaction.amount);
    }
  }

  // Générer un rapport de paiements
  static async generatePaymentReport(userId: string, startDate?: string, endDate?: string): Promise<{
    total_transactions: number;
    total_amount: number;
    successful_transactions: number;
    failed_transactions: number;
    transactions: PaymentTransaction[];
  }> {
    let query = supabase
      .from('payment_transactions')
      .select('*')
      .eq('user_id', userId);

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: transactions, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la génération du rapport: ${error.message}`);
    }

    const successfulTransactions = transactions?.filter(t => t.status === 'completed') || [];
    const failedTransactions = transactions?.filter(t => t.status === 'failed') || [];
    const totalAmount = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);

    return {
      total_transactions: transactions?.length || 0,
      total_amount: totalAmount,
      successful_transactions: successfulTransactions.length,
      failed_transactions: failedTransactions.length,
      transactions: transactions || []
    };
  }
} 