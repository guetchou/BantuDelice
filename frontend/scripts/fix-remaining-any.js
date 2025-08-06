#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Script de correction des any restants...');

// Types de remplacement basés sur le contexte
const ANY_REPLACEMENTS = {
  // Types génériques
  'any[]': 'unknown[]',
  'Array<any>': 'Array<unknown>',
  'Promise<any>': 'Promise<unknown>',
  'Record<string, any>': 'Record<string, unknown>',
  
  // Types d'événements
  'event: any': 'event: Event',
  'e: any': 'e: Event',
  'error: any': 'error: Error',
  
  // Types d'API
  'response: any': 'response: Response',
  'data: any': 'data: unknown',
  'result: any': 'result: unknown',
  
  // Types de props
  'props: any': 'props: Record<string, unknown>',
  'params: any': 'params: Record<string, unknown>',
  
  // Types de callbacks
  'callback: any': 'callback: (...args: unknown[]) => void',
  'handler: any': 'handler: (...args: unknown[]) => void',
  
  // Types de configuration
  'config: any': 'config: Record<string, unknown>',
  'options: any': 'options: Record<string, unknown>',
  
  // Types de données
  'item: any': 'item: unknown',
  'value: any': 'value: unknown',
  'obj: any': 'obj: Record<string, unknown>',
  
  // Types de fonctions
  'fn: any': 'fn: (...args: unknown[]) => unknown',
  'func: any': 'func: (...args: unknown[]) => unknown',
};

// Fonction pour analyser le contexte d'un any
function analyzeAnyContext(content, lineNumber) {
  const lines = content.split('\n');
  const line = lines[lineNumber - 1];
  
  // Chercher des patterns spécifiques
  if (line.includes('event:')) return 'Event';
  if (line.includes('error:')) return 'Error';
  if (line.includes('response:')) return 'Response';
  if (line.includes('data:')) return 'unknown';
  if (line.includes('props:')) return 'Record<string, unknown>';
  if (line.includes('params:')) return 'Record<string, unknown>';
  if (line.includes('callback:')) return '(...args: unknown[]) => void';
  if (line.includes('handler:')) return '(...args: unknown[]) => void';
  if (line.includes('config:')) return 'Record<string, unknown>';
  if (line.includes('options:')) return 'Record<string, unknown>';
  if (line.includes('item:')) return 'unknown';
  if (line.includes('value:')) return 'unknown';
  if (line.includes('obj:')) return 'Record<string, unknown>';
  if (line.includes('fn:') || line.includes('func:')) return '(...args: unknown[]) => unknown';
  
  // Patterns génériques
  if (line.includes('any[]')) return 'unknown[]';
  if (line.includes('Array<any>')) return 'Array<unknown>';
  if (line.includes('Promise<any>')) return 'Promise<unknown>';
  if (line.includes('Record<string, any>')) return 'Record<string, unknown>';
  
  // Par défaut
  return 'unknown';
}

// Fonction pour corriger les any dans un fichier
function fixAnyInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;
  let hasChanges = false;
  
  // Remplacer les patterns connus
  for (const [pattern, replacement] of Object.entries(ANY_REPLACEMENTS)) {
    const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    if (regex.test(updatedContent)) {
      updatedContent = updatedContent.replace(regex, replacement);
      hasChanges = true;
    }
  }
  
  // Corriger les any simples avec analyse de contexte
  const anyRegex = /:\s*any\b/g;
  let match;
  let offset = 0;
  
  while ((match = anyRegex.exec(updatedContent)) !== null) {
    const position = match.index + offset;
    const lineNumber = updatedContent.substring(0, position).split('\n').length;
    const replacementType = analyzeAnyContext(updatedContent, lineNumber);
    
    const before = updatedContent.substring(0, match.index + offset);
    const after = updatedContent.substring(match.index + offset + match[0].length);
    updatedContent = before + `: ${replacementType}` + after;
    
    offset += replacementType.length - match[0].length;
    hasChanges = true;
  }
  
  if (hasChanges) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`✅ Fichier mis à jour: ${path.relative(process.cwd(), filePath)}`);
  }
  
  return hasChanges;
}

// Fonction pour trouver tous les fichiers avec des any
function findFilesWithAny(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findFilesWithAny(fullPath, files);
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(': any') || content.includes('any[]') || content.includes('Array<any>')) {
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

  console.log('🔍 Recherche des fichiers avec des any...');
  const filesWithAny = findFilesWithAny(srcDir);
  console.log(`📁 ${filesWithAny.length} fichiers avec des any trouvés`);

  let processedCount = 0;
  let changedCount = 0;

  for (const file of filesWithAny) {
    console.log(`🔧 Traitement: ${path.relative(srcDir, file)}`);
    const hasChanges = fixAnyInFile(file);
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
    console.log('\n🚀 Vérification des améliorations...');
    try {
      const result = execSync('npm run lint 2>&1 | grep "Unexpected any" | wc -l', { 
        cwd: path.join(__dirname, '..'), 
        encoding: 'utf8' 
      });
      const remainingAny = parseInt(result.trim());
      console.log(`📈 Any restants: ${remainingAny}`);
    } catch (error) {
      console.log('⚠️  Impossible de vérifier les any restants');
    }
  }

  console.log('\n✅ Script terminé!');
}

main(); 