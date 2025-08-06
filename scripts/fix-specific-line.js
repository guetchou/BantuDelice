#!/usr/bin/env node

import fs from 'fs';

const filePath = 'frontend/src/pages/colis/ColisExpeditionModernFixed.tsx';

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Corriger la ligne spécifique
  content = content.replace(
    /console\.warn\('⚠️ "Erreur lors de l'envoi des notifications"'\);/g,
    "console.warn('⚠️ Erreur lors de l\\'envoi des notifications');"
  );
  
  // Écrire le fichier modifié
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Ligne spécifique corrigée !');
  
} catch (error) {
  console.error('❌ Erreur lors de la correction:', error.message);
  process.exit(1);
} 