#!/usr/bin/env node

import fs from 'fs';

const filePath = 'frontend/src/pages/colis/ColisExpeditionModernFixed.tsx';

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remplacer toutes les apostrophes problématiques par des guillemets doubles
  const problematicStrings = [
    "Erreur lors de la création de l'expédition",
    "Erreur lors de la soumission de l'expédition", 
    "Erreur lors du traitement du paiement",
    "Erreur lors de l'envoi des notifications"
  ];
  
  problematicStrings.forEach(str => {
    const escapedStr = str.replace(/'/g, "\\'");
    const newStr = str.replace(/'/g, "'");
    content = content.replace(new RegExp(escapedStr, 'g'), `"${str}"`);
  });
  
  // Écrire le fichier modifié
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Toutes les apostrophes corrigées avec guillemets doubles !');
  
} catch (error) {
  console.error('❌ Erreur lors de la correction:', error.message);
  process.exit(1);
} 