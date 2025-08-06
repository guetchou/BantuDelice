#!/usr/bin/env node

import fs from 'fs';

const filePath = 'frontend/src/pages/colis/ColisExpeditionModernFixed.tsx';

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Corriger l'apostrophe dans le message d'erreur
  content = content.replace(
    /throw new Error\('Erreur lors de la création de l'expédition'\);/g,
    "throw new Error('Erreur lors de la création de l\\'expédition');"
  );
  
  // Écrire le fichier modifié
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Erreur d\'apostrophe corrigée !');
  
} catch (error) {
  console.error('❌ Erreur lors de la correction:', error.message);
  process.exit(1);
} 