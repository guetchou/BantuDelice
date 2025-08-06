-- Migration pour créer les tables du Call Center Multicanal
-- Date: 2024-01-15
-- Description: Tables pour gérer les tickets, agents, canaux, commandes et notifications

-- Table des agents du call center
CREATE TABLE IF NOT EXISTS call_center_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'agent' CHECK (role IN ('agent', 'supervisor', 'manager', 'admin')),
    status VARCHAR(50) NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'busy', 'break', 'training')),
    is_active BOOLEAN DEFAULT true,
    skills JSONB,
    languages JSONB,
    total_tickets_handled INTEGER DEFAULT 0,
    average_resolution_time_minutes INTEGER DEFAULT 0,
    customer_satisfaction_score INTEGER DEFAULT 0,
    last_active_at TIMESTAMPTZ,
    working_hours JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des canaux de communication
CREATE TABLE IF NOT EXISTS call_center_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('phone', 'sms', 'whatsapp', 'email', 'web_chat', 'social_media')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    phone_number VARCHAR(50),
    whatsapp_number VARCHAR(50),
    email_address VARCHAR(255),
    webhook_url TEXT,
    is_enabled BOOLEAN DEFAULT true,
    max_concurrent_tickets INTEGER DEFAULT 0,
    average_response_time_minutes INTEGER DEFAULT 0,
    operating_hours JSONB,
    auto_response JSONB,
    routing_rules JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des tickets de support
CREATE TABLE IF NOT EXISTS call_center_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    type VARCHAR(50) NOT NULL DEFAULT 'support' CHECK (type IN ('order', 'support', 'complaint', 'feedback', 'technical')),
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'escalated')),
    priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    notes TEXT,
    resolution TEXT,
    assigned_agent_id UUID REFERENCES call_center_agents(id),
    channel_id UUID NOT NULL REFERENCES call_center_channels(id),
    estimated_resolution_time TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    response_time_minutes INTEGER DEFAULT 0,
    resolution_time_minutes INTEGER DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des commandes via call center
CREATE TABLE IF NOT EXISTS call_center_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    ticket_id UUID NOT NULL REFERENCES call_center_tickets(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    delivery_address TEXT NOT NULL,
    delivery_instructions TEXT,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled')),
    payment_method VARCHAR(50) NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'mobile_money', 'card', 'bank_transfer')),
    payment_status VARCHAR(50) DEFAULT 'pending',
    estimated_delivery_time TIMESTAMPTZ,
    actual_delivery_time TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    tracking_updates JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS call_center_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('sms', 'whatsapp', 'email', 'push', 'voice')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'read')),
    template VARCHAR(50) NOT NULL CHECK (template IN ('order_confirmation', 'order_status_update', 'delivery_update', 'payment_confirmation', 'support_response', 'reminder', 'promotion')),
    recipient_phone VARCHAR(50) NOT NULL,
    recipient_email VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    translated_message TEXT,
    language VARCHAR(10) DEFAULT 'fr',
    ticket_id UUID REFERENCES call_center_tickets(id),
    order_id UUID REFERENCES call_center_orders(id),
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    failure_reason TEXT,
    delivery_report JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_call_center_tickets_status ON call_center_tickets(status);
CREATE INDEX IF NOT EXISTS idx_call_center_tickets_priority ON call_center_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_call_center_tickets_type ON call_center_tickets(type);
CREATE INDEX IF NOT EXISTS idx_call_center_tickets_assigned_agent ON call_center_tickets(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_call_center_tickets_channel ON call_center_tickets(channel_id);
CREATE INDEX IF NOT EXISTS idx_call_center_tickets_customer_phone ON call_center_tickets(customer_phone);
CREATE INDEX IF NOT EXISTS idx_call_center_tickets_created_at ON call_center_tickets(created_at);

CREATE INDEX IF NOT EXISTS idx_call_center_orders_status ON call_center_orders(status);
CREATE INDEX IF NOT EXISTS idx_call_center_orders_customer_phone ON call_center_orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_call_center_orders_ticket_id ON call_center_orders(ticket_id);
CREATE INDEX IF NOT EXISTS idx_call_center_orders_created_at ON call_center_orders(created_at);

CREATE INDEX IF NOT EXISTS idx_call_center_agents_status ON call_center_agents(status);
CREATE INDEX IF NOT EXISTS idx_call_center_agents_role ON call_center_agents(role);
CREATE INDEX IF NOT EXISTS idx_call_center_agents_email ON call_center_agents(email);

CREATE INDEX IF NOT EXISTS idx_call_center_channels_type ON call_center_channels(type);
CREATE INDEX IF NOT EXISTS idx_call_center_channels_status ON call_center_channels(status);

CREATE INDEX IF NOT EXISTS idx_call_center_notifications_type ON call_center_notifications(type);
CREATE INDEX IF NOT EXISTS idx_call_center_notifications_status ON call_center_notifications(status);
CREATE INDEX IF NOT EXISTS idx_call_center_notifications_recipient_phone ON call_center_notifications(recipient_phone);

-- Triggers pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_call_center_agents_updated_at BEFORE UPDATE ON call_center_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_call_center_channels_updated_at BEFORE UPDATE ON call_center_channels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_call_center_tickets_updated_at BEFORE UPDATE ON call_center_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_call_center_orders_updated_at BEFORE UPDATE ON call_center_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_call_center_notifications_updated_at BEFORE UPDATE ON call_center_notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Données initiales pour les canaux
INSERT INTO call_center_channels (name, type, phone_number, status) VALUES
('Téléphone Principal', 'phone', '+242 06 123 4567', 'active'),
('WhatsApp Business', 'whatsapp', '+242 06 123 4567', 'active'),
('SMS', 'sms', '+242 06 123 4567', 'active'),
('Email Support', 'email', 'support@bantudelice.cg', 'active'),
('Chat Web', 'web_chat', NULL, 'active')
ON CONFLICT DO NOTHING;

-- Données initiales pour les agents
INSERT INTO call_center_agents (name, email, phone, role, status, skills, languages) VALUES
('Marie Dubois', 'marie.dubois@bantudelice.cg', '+242 06 111 1111', 'supervisor', 'online', '["orders", "support", "complaints"]', '["fr", "en"]'),
('Paul Martin', 'paul.martin@bantudelice.cg', '+242 06 222 2222', 'agent', 'online', '["orders", "technical"]', '["fr", "lingala"]'),
('Sophie Nkounkou', 'sophie.nkounkou@bantudelice.cg', '+242 06 333 3333', 'agent', 'online', '["support", "payments"]', '["fr", "en", "lingala"]'),
('Jean Mutombo', 'jean.mutombo@bantudelice.cg', '+242 06 444 4444', 'agent', 'offline', '["orders", "delivery"]', '["fr", "lingala"]')
ON CONFLICT DO NOTHING;

-- Commentaires sur les tables
COMMENT ON TABLE call_center_agents IS 'Agents du call center avec leurs compétences et statuts';
COMMENT ON TABLE call_center_channels IS 'Canaux de communication disponibles (téléphone, SMS, WhatsApp, etc.)';
COMMENT ON TABLE call_center_tickets IS 'Tickets de support créés par les clients';
COMMENT ON TABLE call_center_orders IS 'Commandes créées via le call center';
COMMENT ON TABLE call_center_notifications IS 'Notifications envoyées aux clients via différents canaux'; 