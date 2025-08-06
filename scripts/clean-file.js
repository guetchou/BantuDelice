#!/usr/bin/env node

import fs from 'fs';

const filePath = 'frontend/src/pages/colis/ColisExpeditionModernFixed.tsx';

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Supprimer les lignes vides en trop
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // 2. Supprimer les espaces en fin de ligne
  content = content.replace(/[ \t]+$/gm, '');
  
  // 3. Vérifier et corriger l'expression régulière du téléphone
  content = content.replace(
    /const validatePhoneNumber = \(phone: string\): boolean => \{[\s\S]*?return \/.*\/\.test\(cleanPhone\);/,
    `const validatePhoneNumber = (phone: string): boolean => {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\\s/g, '');
    return /^(\\+242|242)?[0-9]{9}$/.test(cleanPhone);
  }`
  );
  
  // 4. Écrire le fichier nettoyé
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Fichier nettoyé avec succès !');
  
  // 5. Vérifier la syntaxe
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  
  console.log(`📊 Vérification syntaxique:`);
  console.log(`   Accolades ouvertes: ${openBraces}`);
  console.log(`   Accolades fermées: ${closeBraces}`);
  console.log(`   Différence: ${openBraces - closeBraces}`);
  
  if (openBraces === closeBraces) {
    console.log('✅ Syntaxe correcte !');
  } else {
    console.log('❌ Problème de syntaxe détecté !');
  }
  
} catch (error) {
  console.error('❌ Erreur lors du nettoyage:', error.message);
  process.exit(1);
} 