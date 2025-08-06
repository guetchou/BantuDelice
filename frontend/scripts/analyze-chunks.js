#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fonction pour analyser les chunks
function analyzeChunks() {
  const distPath = path.join(__dirname, '../dist');
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ Dossier dist non trouvé. Lancez d\'abord: npm run build');
    return;
  }

  const jsPath = path.join(distPath, 'js');
  if (!fs.existsSync(jsPath)) {
    console.log('❌ Dossier js non trouvé dans dist');
    return;
  }

  const files = fs.readdirSync(jsPath);
  const jsFiles = files.filter(file => file.endsWith('.js'));

  console.log('📊 ANALYSE DES CHUNKS - BANTUDELICE\n');

  const chunks = [];

  jsFiles.forEach(file => {
    const filePath = path.join(jsPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    chunks.push({
      name: file,
      size: stats.size,
      sizeKB: parseFloat(sizeKB),
      sizeMB: parseFloat(sizeMB)
    });
  });

  // Trier par taille décroissante
  chunks.sort((a, b) => b.size - a.size);

  console.log('📋 CHUNKS PAR TAILLE (du plus gros au plus petit):\n');

  chunks.forEach((chunk, index) => {
    const icon = chunk.sizeMB > 1 ? '🔴' : chunk.sizeMB > 0.5 ? '🟡' : '🟢';
    const sizeDisplay = chunk.sizeMB > 1 ? `${chunk.sizeMB} MB` : `${chunk.sizeKB} KB`;
    
    console.log(`${icon} ${index + 1}. ${chunk.name}`);
    console.log(`   Taille: ${sizeDisplay} (${chunk.size} bytes)`);
    console.log('');
  });

  // Statistiques globales
  const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  const avgSizeKB = (totalSize / chunks.length / 1024).toFixed(2);

  console.log('📈 STATISTIQUES GLOBALES:\n');
  console.log(`📦 Nombre total de chunks: ${chunks.length}`);
  console.log(`📊 Taille totale: ${totalSizeMB} MB`);
  console.log(`📏 Taille moyenne: ${avgSizeKB} KB`);
  console.log(`🔴 Chunks > 1MB: ${chunks.filter(c => c.sizeMB > 1).length}`);
  console.log(`🟡 Chunks > 500KB: ${chunks.filter(c => c.sizeMB > 0.5).length}`);
  console.log(`🟢 Chunks < 500KB: ${chunks.filter(c => c.sizeMB <= 0.5).length}`);

  // Recommandations
  console.log('\n💡 RECOMMANDATIONS:\n');

  const largeChunks = chunks.filter(c => c.sizeMB > 1);
  if (largeChunks.length > 0) {
    console.log('🔴 CHUNKS TROP LOURDS (> 1MB):');
    largeChunks.forEach(chunk => {
      console.log(`   - ${chunk.name}: ${chunk.sizeMB} MB`);
      console.log(`     → Considérer le lazy loading ou la division`);
    });
    console.log('');
  }

  const mediumChunks = chunks.filter(c => c.sizeMB > 0.5 && c.sizeMB <= 1);
  if (mediumChunks.length > 0) {
    console.log('🟡 CHUNKS MOYENS (500KB - 1MB):');
    mediumChunks.forEach(chunk => {
      console.log(`   - ${chunk.name}: ${chunk.sizeMB} MB`);
      console.log(`     → Surveiller et optimiser si nécessaire`);
    });
    console.log('');
  }

  // Optimisations suggérées
  console.log('🚀 OPTIMISATIONS SUGGÉRÉES:\n');
  console.log('1. Lazy loading pour les pages lourdes');
  console.log('2. Division des chunks vendor trop gros');
  console.log('3. Compression gzip/brotli');
  console.log('4. Tree shaking des dépendances inutilisées');
  console.log('5. Optimisation des images et assets');

  // Exemple de configuration
  console.log('\n⚙️ EXEMPLE DE CONFIGURATION OPTIMISÉE:\n');
  console.log('```javascript');
  console.log('// vite.config.ts');
  console.log('build: {');
  console.log('  chunkSizeWarningLimit: 500,');
  console.log('  rollupOptions: {');
  console.log('    output: {');
  console.log('      manualChunks: {');
  console.log('        "react-vendor": ["react", "react-dom"],');
  console.log('        "router-vendor": ["react-router-dom"],');
  console.log('        "ui-vendor": ["@radix-ui/react-*", "lucide-react"],');
  console.log('        "utils-vendor": ["@tanstack/react-query", "sonner"]');
  console.log('      }');
  console.log('    }');
  console.log('  }');
  console.log('}');
  console.log('```');
}

// Exécuter l'analyse
analyzeChunks(); 