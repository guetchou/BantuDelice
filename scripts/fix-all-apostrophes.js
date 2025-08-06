#!/usr/bin/env node

import fs from 'fs';

const filePath = 'frontend/src/pages/colis/ColisExpeditionModernFixed.tsx';

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Corriger toutes les apostrophes problématiques
  const replacements = [
    {
      from: /'Erreur lors de la création de l'expédition'/g,
      to: "'Erreur lors de la création de l\\'expédition'"
    },
    {
      from: /'Erreur lors de la soumission de l'expédition'/g,
      to: "'Erreur lors de la soumission de l\\'expédition'"
    },
    {
      from: /'Erreur lors du traitement du paiement'/g,
      to: "'Erreur lors du traitement du paiement'"
    }
  ];
  
  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });
  
  // Écrire le fichier modifié
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Toutes les apostrophes problématiques corrigées !');
  
} catch (error) {
  console.error('❌ Erreur lors de la correction:', error.message);
  process.exit(1);
} 