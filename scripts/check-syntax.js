#!/usr/bin/env node

import fs from 'fs';

const filePath = 'frontend/src/pages/colis/ColisExpeditionModernFixed.tsx';

try {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Compter les accolades
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  
  console.log(`📊 Analyse syntaxique:`);
  console.log(`   Accolades ouvertes: ${openBraces}`);
  console.log(`   Accolades fermées: ${closeBraces}`);
  console.log(`   Différence: ${openBraces - closeBraces}`);
  
  if (openBraces !== closeBraces) {
    console.log(`❌ Erreur: Nombre d'accolades déséquilibré!`);
    
    // Trouver les lignes avec des accolades
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      const openCount = (line.match(/\{/g) || []).length;
      const closeCount = (line.match(/\}/g) || []).length;
      if (openCount > 0 || closeCount > 0) {
        console.log(`   Ligne ${index + 1}: {${openCount}} }${closeCount} - ${line.trim()}`);
      }
    });
  } else {
    console.log(`✅ Syntaxe correcte!`);
  }
  
  // Vérifier les fonctions
  const functionMatches = content.match(/const \w+ = \(/g) || [];
  console.log(`\n🔍 Fonctions trouvées: ${functionMatches.length}`);
  functionMatches.forEach(match => {
    console.log(`   ${match}`);
  });
  
} catch (error) {
  console.error('❌ Erreur lors de l\'analyse:', error.message);
  process.exit(1);
} 