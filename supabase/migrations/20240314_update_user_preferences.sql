
-- Add new columns to user_preferences if they don't exist
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS dark_mode BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'fr',
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS order_updates BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS promotional_emails BOOLEAN DEFAULT true;
