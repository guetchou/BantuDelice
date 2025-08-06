#!/usr/bin/env node

import fs from 'fs';

const filePath = 'frontend/src/pages/colis/ColisExpeditionModernFixed.tsx';

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Ajouter un commentaire avec timestamp pour forcer le rechargement
  const timestamp = new Date().toISOString();
  const headerComment = `// Version mise à jour le ${timestamp} - Force reload\n`;
  
  // Ajouter le commentaire au début du fichier
  if (!content.startsWith('// Version mise à jour')) {
    content = headerComment + content;
  } else {
    // Remplacer l'ancien timestamp
    content = content.replace(/\/\/ Version mise à jour le .*?\n/, headerComment);
  }
  
  // Écrire le fichier avec le nouveau timestamp
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Timestamp ajouté pour forcer le rechargement !');
  console.log(`📅 Timestamp: ${timestamp}`);
  
  // Vérifier que l'expression régulière est correcte
  const phoneRegexMatch = content.match(/return \/.*\/\.test\(cleanPhone\);/);
  if (phoneRegexMatch) {
    console.log('🔍 Expression régulière trouvée:', phoneRegexMatch[0]);
    if (phoneRegexMatch[0].includes('\\+242')) {
      console.log('✅ Expression régulière correcte (\\+242 échappé)');
    } else {
      console.log('❌ Expression régulière incorrecte');
    }
  }
  
  // Vérifier l'ordre des fonctions
  const validateEmailIndex = content.indexOf('const validateEmail');
  const validatePhoneIndex = content.indexOf('const validatePhoneNumber');
  const validateDimensionsIndex = content.indexOf('const validateDimensions');
  const updateNestedFieldIndex = content.indexOf('const updateNestedField');
  const handleCityChangeIndex = content.indexOf('const handleCityChange');
  
  console.log('📋 Ordre des fonctions:');
  console.log(`   validateEmail: ${validateEmailIndex}`);
  console.log(`   validatePhoneNumber: ${validatePhoneIndex}`);
  console.log(`   validateDimensions: ${validateDimensionsIndex}`);
  console.log(`   updateNestedField: ${updateNestedFieldIndex}`);
  console.log(`   handleCityChange: ${handleCityChangeIndex}`);
  
  if (validateEmailIndex < validatePhoneIndex && 
      validatePhoneIndex < validateDimensionsIndex && 
      validateDimensionsIndex < updateNestedFieldIndex && 
      updateNestedFieldIndex < handleCityChangeIndex) {
    console.log('✅ Ordre des fonctions correct !');
  } else {
    console.log('❌ Ordre des fonctions incorrect !');
  }
  
} catch (error) {
  console.error('❌ Erreur lors du rechargement forcé:', error.message);
  process.exit(1);
} 