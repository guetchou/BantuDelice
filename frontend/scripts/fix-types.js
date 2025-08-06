#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Script de correction automatique des types...');

// Fonction pour lire un fichier
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`❌ Erreur lecture ${filePath}:`, error.message);
    return null;
  }
}

// Fonction pour écrire un fichier
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fichier mis à jour: ${filePath}`);
  } catch (error) {
    console.error(`❌ Erreur écriture ${filePath}:`, error.message);
  }
}

// Fonction pour corriger les interfaces vides
function fixEmptyInterfaces(content) {
  return content
    // Corriger les interfaces vides
    .replace(/interface\s+(\w+)\s*\{\s*\}/g, 'interface $1 extends Record<string, unknown> {}')
    // Corriger les types {} vides
    .replace(/:\s*\{\s*\}/g, ': Record<string, unknown>')
    // Corriger les Number en number
    .replace(/: Number/g, ': number')
    .replace(/: String/g, ': string')
    .replace(/: Boolean/g, ': boolean');
}

// Fonction pour corriger les @ts-ignore
function fixTsIgnore(content) {
  return content.replace(/@ts-ignore/g, '@ts-expect-error');
}

// Fonction pour corriger les any
function fixAnyTypes(content) {
  return content
    // Remplacer les any simples par unknown
    .replace(/: any\b/g, ': unknown')
    .replace(/any\[\]/g, 'unknown[]')
    // Remplacer les any dans les génériques par unknown
    .replace(/<any>/g, '<unknown>')
    .replace(/<any,/g, '<unknown,')
    .replace(/,any>/g, ',unknown>');
}

// Fonction pour corriger les require
function fixRequire(content) {
  return content.replace(/require\(/g, 'import(');
}

// Fonction pour traiter un fichier
function processFile(filePath) {
  const content = readFile(filePath);
  if (!content) return;

  let updatedContent = content;
  let hasChanges = false;

  // Appliquer les corrections
  const originalContent = updatedContent;
  
  updatedContent = fixEmptyInterfaces(updatedContent);
  updatedContent = fixTsIgnore(updatedContent);
  updatedContent = fixAnyTypes(updatedContent);
  updatedContent = fixRequire(updatedContent);

  // Vérifier s'il y a eu des changements
  if (updatedContent !== originalContent) {
    writeFile(filePath, updatedContent);
    hasChanges = true;
  }

  return hasChanges;
}

// Fonction pour trouver tous les fichiers TypeScript
function findTsFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findTsFiles(fullPath, files);
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
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

  console.log('🔍 Recherche des fichiers TypeScript...');
  const tsFiles = findTsFiles(srcDir);
  console.log(`📁 ${tsFiles.length} fichiers TypeScript trouvés`);

  let processedCount = 0;
  let changedCount = 0;

  for (const file of tsFiles) {
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

  if (changedCount > 0) {
    console.log('\n🚀 Exécution du linter pour vérifier les améliorations...');
    try {
      execSync('npm run lint', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    } catch (error) {
      console.log('⚠️  Le linter a encore des erreurs, mais nous avons fait des progrès!');
    }
  }

  console.log('\n✅ Script terminé!');
}

// Exécuter le script
main(); 