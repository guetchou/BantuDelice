-- Tables pour le système de paiement Buntudelice

-- Table des transactions de paiement
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  provider_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des méthodes de paiement sauvegardées
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('mobile_money', 'card', 'wallet', 'cash')),
  provider TEXT,
  last_four TEXT,
  is_default BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des portefeuilles utilisateurs
CREATE TABLE IF NOT EXISTS public.user_wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'XOF',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des transactions de portefeuille
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID REFERENCES public.user_wallets(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON public.payment_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON public.wallet_transactions(wallet_id);

-- RLS (Row Level Security) pour les transactions de paiement
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment transactions" ON public.payment_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment transactions" ON public.payment_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment transactions" ON public.payment_transactions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS pour les méthodes de paiement
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment methods" ON public.payment_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment methods" ON public.payment_methods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods" ON public.payment_methods
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods" ON public.payment_methods
  FOR DELETE USING (auth.uid() = user_id);

-- RLS pour les portefeuilles
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet" ON public.user_wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet" ON public.user_wallets
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS pour les transactions de portefeuille
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet transactions" ON public.wallet_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_wallets 
      WHERE user_wallets.id = wallet_transactions.wallet_id 
      AND user_wallets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own wallet transactions" ON public.wallet_transactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_wallets 
      WHERE user_wallets.id = wallet_transactions.wallet_id 
      AND user_wallets.user_id = auth.uid()
    )
  );

-- Fonction pour créer automatiquement un portefeuille pour les nouveaux utilisateurs
CREATE OR REPLACE FUNCTION public.handle_new_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_wallets (user_id, balance, currency)
  VALUES (NEW.id, 0, 'XOF');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un portefeuille
CREATE TRIGGER on_auth_user_created_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_wallet();

-- Fonction pour mettre à jour le solde du portefeuille
CREATE OR REPLACE FUNCTION public.update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.type = 'credit' THEN
      UPDATE public.user_wallets 
      SET balance = balance + NEW.amount, updated_at = NOW()
      WHERE id = NEW.wallet_id;
    ELSIF NEW.type = 'debit' THEN
      UPDATE public.user_wallets 
      SET balance = balance - NEW.amount, updated_at = NOW()
      WHERE id = NEW.wallet_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour mettre à jour automatiquement le solde
CREATE TRIGGER on_wallet_transaction_insert
  AFTER INSERT ON public.wallet_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_wallet_balance();

-- Fonction pour obtenir le solde du portefeuille
CREATE OR REPLACE FUNCTION public.get_wallet_balance(user_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  wallet_balance DECIMAL;
BEGIN
  SELECT balance INTO wallet_balance
  FROM public.user_wallets
  WHERE user_id = user_uuid;
  
  RETURN COALESCE(wallet_balance, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour ajouter de l'argent au portefeuille
CREATE OR REPLACE FUNCTION public.add_to_wallet(user_uuid UUID, amount DECIMAL, description TEXT DEFAULT 'Dépôt')
RETURNS BOOLEAN AS $$
DECLARE
  wallet_id UUID;
BEGIN
  -- Récupérer l'ID du portefeuille
  SELECT id INTO wallet_id
  FROM public.user_wallets
  WHERE user_id = user_uuid;
  
  IF wallet_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Ajouter la transaction
  INSERT INTO public.wallet_transactions (wallet_id, type, amount, description)
  VALUES (wallet_id, 'credit', amount, description);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour déduire de l'argent du portefeuille
CREATE OR REPLACE FUNCTION public.deduct_from_wallet(user_uuid UUID, amount DECIMAL, description TEXT DEFAULT 'Paiement')
RETURNS BOOLEAN AS $$
DECLARE
  wallet_id UUID;
  current_balance DECIMAL;
BEGIN
  -- Récupérer l'ID du portefeuille et le solde
  SELECT id, balance INTO wallet_id, current_balance
  FROM public.user_wallets
  WHERE user_id = user_uuid;
  
  IF wallet_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Vérifier le solde
  IF current_balance < amount THEN
    RETURN FALSE;
  END IF;
  
  -- Ajouter la transaction de débit
  INSERT INTO public.wallet_transactions (wallet_id, type, amount, description)
  VALUES (wallet_id, 'debit', amount, description);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vues pour faciliter les requêtes
CREATE OR REPLACE VIEW public.user_payment_summary AS
SELECT 
  pt.user_id,
  COUNT(*) as total_transactions,
  SUM(CASE WHEN pt.status = 'completed' THEN pt.amount ELSE 0 END) as total_paid,
  SUM(CASE WHEN pt.status = 'pending' THEN pt.amount ELSE 0 END) as pending_amount,
  COUNT(CASE WHEN pt.status = 'completed' THEN 1 END) as successful_transactions,
  COUNT(CASE WHEN pt.status = 'failed' THEN 1 END) as failed_transactions
FROM public.payment_transactions pt
GROUP BY pt.user_id;

-- Données de test (optionnel)
INSERT INTO public.payment_methods (user_id, type, provider, last_four, is_default, metadata) VALUES
('00000000-0000-0000-0000-000000000001', 'mobile_money', 'mtn', '1234', true, '{"phone_number": "0612345678"}'),
('00000000-0000-0000-0000-000000000001', 'card', 'visa', '5678', false, '{"card_holder": "John Doe", "expiry": "12/25"}');

-- Commentaires sur les tables
COMMENT ON TABLE public.payment_transactions IS 'Transactions de paiement des utilisateurs';
COMMENT ON TABLE public.payment_methods IS 'Méthodes de paiement sauvegardées par les utilisateurs';
COMMENT ON TABLE public.user_wallets IS 'Portefeuilles électroniques des utilisateurs';
COMMENT ON TABLE public.wallet_transactions IS 'Transactions de portefeuille (crédits/débits)'; 