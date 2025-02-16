
CREATE TABLE IF NOT EXISTS order_tracking_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR NOT NULL,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  current_location POINT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT valid_status CHECK (status IN ('preparing', 'ready', 'picked_up', 'delivering', 'delivered'))
);

CREATE INDEX order_tracking_order_id_idx ON order_tracking_details(order_id);

-- Trigger pour mettre à jour le timestamp
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON order_tracking_details
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour créer automatiquement une entrée de suivi
CREATE OR REPLACE FUNCTION create_order_tracking()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO order_tracking_details (order_id, status)
  VALUES (NEW.id, 'preparing');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour créer automatiquement le suivi
CREATE TRIGGER create_order_tracking_on_order
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION create_order_tracking();
