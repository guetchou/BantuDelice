#!/bin/bash

echo "🔄 Remplacement des références Supabase par le service API..."

# Remplacer les imports Supabase
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|import { supabase } from '\''@/integrations/supabase/client'\'';|import apiService from '\''@/services/api'\'';|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|import { supabase } from '\''@/lib/supabase'\'';|import apiService from '\''@/services/api'\'';|g'

# Remplacer les appels supabase par apiService
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|supabase\.|apiService\.|g'

# Remplacer les références aux types Supabase
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|Database|any|g'

echo "✅ Remplacement terminé !" 