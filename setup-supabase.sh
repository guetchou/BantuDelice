#!/bin/bash

echo "🚀 Setting up Supabase for Buntudelice..."

# Install Supabase client
echo "📦 Installing @supabase/supabase-js..."
npm install @supabase/supabase-js

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Supabase Configuration
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# For production, use your actual Supabase project URL and keys
# VITE_SUPABASE_URL=https://your-project-ref.supabase.co
# VITE_SUPABASE_ANON_KEY=your-actual-anon-key
EOF
    echo "✅ Created .env file with default values"
    echo "⚠️  Please update the .env file with your actual Supabase credentials"
else
    echo "✅ .env file already exists"
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
else
    echo "✅ Supabase CLI is already installed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with your Supabase credentials"
echo "2. Run the SQL scripts in SUPABASE_SETUP.md to create tables"
echo "3. Start your development server: npm run dev"
echo ""
echo "📚 Check SUPABASE_SETUP.md for detailed instructions" 