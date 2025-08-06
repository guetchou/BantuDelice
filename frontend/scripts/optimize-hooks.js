#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Script d\'optimisation des hooks React...');

// Fonction pour optimiser les useEffect
function optimizeUseEffect(content) {
  let updatedContent = content;
  let hasChanges = false;
  
  // Pattern pour détecter useEffect avec dépendances manquantes
  const useEffectRegex = /useEffect\(\s*\(\s*\)\s*=>\s*\{[\s\S]*?\},\s*\[\s*\]\s*\)/g;
  
  updatedContent = updatedContent.replace(useEffectRegex, (match) => {
    // Extraire le contenu du useEffect
    const bodyMatch = match.match(/useEffect\(\s*\(\s*\)\s*=>\s*\{([\s\S]*?)\},\s*\[\s*\]\s*\)/);
    if (!bodyMatch) return match;
    
    const body = bodyMatch[1];
    
    // Chercher des variables/fonctions utilisées dans le body
    const usedVars = [];
    
    // Patterns pour détecter les variables/fonctions utilisées
    const varPatterns = [
      /(\w+)\./g, // obj.prop
      /(\w+)\(/g, // func()
      /set(\w+)/g, // setState
      /(\w+)\s*=/g, // var = 
    ];
    
    for (const pattern of varPatterns) {
      const matches = body.match(pattern);
      if (matches) {
        usedVars.push(...matches.map(m => m.replace(/[().=]/g, '')));
      }
    }
    
    // Filtrer les variables communes
    const commonVars = ['console', 'window', 'document', 'localStorage', 'sessionStorage'];
    const filteredVars = usedVars.filter(v => !commonVars.includes(v));
    
    if (filteredVars.length > 0) {
      const deps = [...new Set(filteredVars)].join(', ');
      hasChanges = true;
      return match.replace(/\[\s*\]/, `[${deps}]`);
    }
    
    return match;
  });
  
  return { content: updatedContent, hasChanges };
}

// Fonction pour ajouter useCallback
function addUseCallback(content) {
  let updatedContent = content;
  let hasChanges = false;
  
  // Pattern pour détecter les fonctions qui pourraient bénéficier de useCallback
  const functionRegex = /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\}/g;
  
  updatedContent = updatedContent.replace(functionRegex, (match, funcName) => {
    // Vérifier si la fonction est utilisée dans un useEffect ou comme prop
    if (content.includes(`useEffect`) && content.includes(funcName)) {
      hasChanges = true;
      return `const ${funcName} = useCallback((${match.match(/\([^)]*\)/)[0].slice(1, -1)}) => {
        ${match.match(/\{[\s\S]*\}/)[0].slice(1, -1)}
      }, [])`;
    }
    
    return match;
  });
  
  return { content: updatedContent, hasChanges };
}

// Fonction pour ajouter useMemo
function addUseMemo(content) {
  let updatedContent = content;
  let hasChanges = false;
  
  // Pattern pour détecter les calculs coûteux
  const expensiveCalcRegex = /const\s+(\w+)\s*=\s*([^;]+\.(map|filter|reduce|sort)\([^;]+\))/g;
  
  updatedContent = updatedContent.replace(expensiveCalcRegex, (match, varName, calculation) => {
    hasChanges = true;
    return `const ${varName} = useMemo(() => ${calculation}, [])`;
  });
  
  return { content: updatedContent, hasChanges };
}

// Fonction pour traiter un fichier
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;
  let hasChanges = false;
  
  // Vérifier si c'est un fichier React
  if (!content.includes('useEffect') && !content.includes('useState')) {
    return false;
  }
  
  // Ajouter les imports nécessaires
  if (!content.includes('useCallback') && (content.includes('useEffect') || content.includes('useMemo'))) {
    updatedContent = updatedContent.replace(
      /import\s+React[^}]*from\s+['"]react['"]/,
      'import React, { useCallback, useMemo } from \'react\''
    );
    hasChanges = true;
  }
  
  // Optimiser les hooks
  const useEffectResult = optimizeUseEffect(updatedContent);
  updatedContent = useEffectResult.content;
  hasChanges = hasChanges || useEffectResult.hasChanges;
  
  const useCallbackResult = addUseCallback(updatedContent);
  updatedContent = useCallbackResult.content;
  hasChanges = hasChanges || useCallbackResult.hasChanges;
  
  const useMemoResult = addUseMemo(updatedContent);
  updatedContent = useMemoResult.content;
  hasChanges = hasChanges || useMemoResult.hasChanges;
  
  if (hasChanges) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`✅ Fichier optimisé: ${path.relative(process.cwd(), filePath)}`);
  }
  
  return hasChanges;
}

// Fonction pour trouver tous les fichiers React
function findReactFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findReactFiles(fullPath, files);
    } else if (item.endsWith('.tsx') || (item.endsWith('.ts') && !item.includes('.test.'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('useEffect') || content.includes('useState')) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

// Fonction principale
function main() {
  const srcDir = path.join(__dirname, '..', 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.error('❌ Dossier src non trouvé');
    process.exit(1);
  }

  console.log('🔍 Recherche des fichiers React...');
  const reactFiles = findReactFiles(srcDir);
  console.log(`📁 ${reactFiles.length} fichiers React trouvés`);

  let processedCount = 0;
  let changedCount = 0;

  for (const file of reactFiles) {
    console.log(`🔧 Traitement: ${path.relative(srcDir, file)}`);
    const hasChanges = processFile(file);
    if (hasChanges) {
      changedCount++;
    }
    processedCount++;
  }

  console.log(`\n📊 Résumé:`);
  console.log(`   - Fichiers traités: ${processedCount}`);
  console.log(`   - Fichiers modifiés: ${changedCount}`);
  console.log(`   - Taux de modification: ${((changedCount / processedCount) * 100).toFixed(1)}%`);

  console.log('\n✅ Script terminé!');
}

main(); 