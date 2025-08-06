#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Analyse de la configuration de routage...');

// Fonction pour analyser la structure des routes
function analyzeRoutingStructure() {
  console.log('\n📊 Structure des routes:');
  
  // Analyser mainRoutes.tsx
  const mainRoutesPath = path.join(__dirname, '..', 'src/routes/mainRoutes.tsx');
  const mainRoutesContent = fs.readFileSync(mainRoutesPath, 'utf8');
  
  console.log('\n1. Routes principales (mainRoutes.tsx):');
  const mainRouteMatches = mainRoutesContent.match(/path:\s*"([^"]+)"/g);
  if (mainRouteMatches) {
    mainRouteMatches.forEach(match => {
      const path = match.replace('path: "', '').replace('"', '');
      console.log(`   📍 ${path}`);
    });
  }
  
  // Analyser colisRoutes.tsx
  const colisRoutesPath = path.join(__dirname, '..', 'src/routes/colisRoutes.tsx');
  const colisRoutesContent = fs.readFileSync(colisRoutesPath, 'utf8');
  
  console.log('\n2. Routes Colis (colisRoutes.tsx):');
  const colisRouteMatches = colisRoutesContent.match(/path:\s*'([^']+)'/g);
  if (colisRouteMatches) {
    colisRouteMatches.forEach(match => {
      const path = match.replace("path: '", '').replace("'", '');
      console.log(`   📍 ${path}`);
    });
  }
  
  // Analyser index.tsx
  const indexPath = path.join(__dirname, '..', 'src/routes/index.tsx');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  console.log('\n3. Configuration du routeur (index.tsx):');
  console.log(`   🔧 Type de routeur: ${indexContent.includes('createHashRouter') ? 'Hash Router' : 'Browser Router'}`);
  console.log(`   📍 Base URL: ${indexContent.includes('basename') ? 'Configurée' : 'Non configurée'}`);
}

// Fonction pour analyser les problèmes de navigation
function analyzeNavigationIssues() {
  console.log('\n🔍 Analyse des problèmes de navigation:');
  
  const filesToCheck = [
    'src/components/colis/ColisSearch.tsx',
    'src/components/colis/ColisCTASection.tsx',
    'src/components/colis/NavbarColis.tsx',
    'src/components/colis/FooterColis.tsx'
  ];
  
  const navigationPatterns = [];
  
  for (const filePath of filesToCheck) {
    const fullPath = path.join(__dirname, '..', filePath);
    if (!fs.existsSync(fullPath)) continue;
    
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Chercher les patterns de navigation
    const navigateMatches = content.match(/navigate\(`([^`]+)`\)/g);
    const linkMatches = content.match(/to="([^"]+)"/g);
    
    if (navigateMatches) {
      navigateMatches.forEach(match => {
        const url = match.replace('navigate(`', '').replace('`)', '');
        navigationPatterns.push({ type: 'navigate', url, file: filePath });
      });
    }
    
    if (linkMatches) {
      linkMatches.forEach(match => {
        const url = match.replace('to="', '').replace('"', '');
        navigationPatterns.push({ type: 'link', url, file: filePath });
      });
    }
  }
  
  console.log('\n4. Patterns de navigation trouvés:');
  navigationPatterns.forEach(pattern => {
    console.log(`   ${pattern.type === 'navigate' ? '🚀' : '🔗'} ${pattern.url} (${pattern.file})`);
  });
  
  return navigationPatterns;
}

// Fonction pour expliquer le problème
function explainRoutingIssue() {
  console.log('\n❌ PROBLÈME IDENTIFIÉ:');
  console.log('\nLe problème `/colis/#/colis/` se produit à cause de:');
  
  console.log('\n1. **Configuration du Hash Router:**');
  console.log('   - L\'application utilise createHashRouter()');
  console.log('   - Les URLs sont formatées comme: http://domain.com/#/path');
  console.log('   - Le # sépare l\'URL du serveur de l\'URL de l\'application');
  
  console.log('\n2. **Structure des routes:**');
  console.log('   - Route principale: /colis → ColisLandingPage');
  console.log('   - Routes enfants: /colis/expedition, /colis/tracking, etc.');
  console.log('   - Quand on navigue vers /colis/expedition depuis /colis');
  console.log('   - L\'URL devient: /colis/#/colis/expedition');
  
  console.log('\n3. **Pourquoi la duplication:**');
  console.log('   - L\'utilisateur est sur: http://domain.com/colis/#/');
  console.log('   - Il clique sur un lien vers: /colis/expedition');
  console.log('   - React Router ajoute: /colis/expedition');
  console.log('   - Résultat: http://domain.com/colis/#/colis/expedition');
  
  console.log('\n4. **Solutions possibles:**');
  console.log('   a) Utiliser Browser Router au lieu de Hash Router');
  console.log('   b) Configurer un basename pour le routeur');
  console.log('   c) Utiliser des routes relatives au lieu d\'absolues');
  console.log('   d) Rediriger automatiquement les URLs dupliquées');
}

// Fonction pour proposer des corrections
function proposeFixes() {
  console.log('\n🔧 SOLUTIONS PROPOSÉES:');
  
  console.log('\n1. **Solution immédiate - Redirection automatique:**');
  console.log('   Ajouter un middleware pour détecter et corriger les URLs dupliquées');
  
  console.log('\n2. **Solution recommandée - Routes relatives:**');
  console.log('   Utiliser des chemins relatifs dans les composants:');
  console.log('   - Au lieu de: navigate("/colis/expedition")');
  console.log('   - Utiliser: navigate("expedition") ou navigate("./expedition")');
  
  console.log('\n3. **Solution optimale - Configuration du routeur:**');
  console.log('   Configurer le basename dans createHashRouter:');
  console.log('   createHashRouter(mainRoutes, { basename: "/colis" })');
  
  console.log('\n4. **Solution alternative - Browser Router:**');
  console.log('   Remplacer createHashRouter par createBrowserRouter');
  console.log('   Nécessite une configuration serveur pour le SPA routing');
}

// Fonction pour créer un script de correction
function createFixScript() {
  const fixScriptContent = `#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Correction de la configuration de routage...');

// 1. Corriger les routes relatives dans les composants
function fixRelativeRoutes() {
  const filesToFix = [
    'src/components/colis/ColisSearch.tsx',
    'src/components/colis/ColisCTASection.tsx',
    'src/components/colis/NavbarColis.tsx',
    'src/components/colis/FooterColis.tsx'
  ];
  
  filesToFix.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    if (!fs.existsSync(fullPath)) return;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let hasChanges = false;
    
    // Remplacer les routes absolues par des routes relatives
    const absoluteRouteRegex = /navigate\\(\\`\\/colis\\/([^\\`]+)\\`\\)/g;
    content = content.replace(absoluteRouteRegex, (match, route) => {
      hasChanges = true;
      return \`navigate(\`\${route}\`)\`;
    });
    
    // Corriger les liens
    const absoluteLinkRegex = /to="\\/colis\\/([^"]+)"/g;
    content = content.replace(absoluteLinkRegex, (match, route) => {
      hasChanges = true;
      return \`to="\${route}"\`;
    });
    
    if (hasChanges) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(\`✅ Fichier corrigé: \${filePath}\`);
    }
  });
}

// 2. Configurer le basename du routeur
function configureRouterBasename() {
  const indexPath = path.join(__dirname, '..', 'src/routes/index.tsx');
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Ajouter la configuration basename
  content = content.replace(
    'export const router = createHashRouter(mainRoutes);',
    'export const router = createHashRouter(mainRoutes, { basename: "/colis" });'
  );
  
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('✅ Configuration basename ajoutée');
}

// 3. Ajouter un middleware de redirection
function addRedirectMiddleware() {
  const appPath = path.join(__dirname, '..', 'src/App.tsx');
  if (!fs.existsSync(appPath)) return;
  
  let content = fs.readFileSync(appPath, 'utf8');
  
  // Ajouter un composant de redirection
  const redirectComponent = \`
// Composant pour corriger les URLs dupliquées
const RedirectMiddleware = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/colis/colis/')) {
      const correctedPath = path.replace('/colis/colis/', '/colis/');
      navigate(correctedPath, { replace: true });
    }
  }, [location, navigate]);
  
  return null;
};
\`;
  
  // Ajouter le composant dans le rendu
  content = content.replace(
    '<Outlet />',
    '<>\n      <RedirectMiddleware />\n      <Outlet />\n    </>'
  );
  
  fs.writeFileSync(appPath, content, 'utf8');
  console.log('✅ Middleware de redirection ajouté');
}

// Exécuter les corrections
fixRelativeRoutes();
configureRouterBasename();
addRedirectMiddleware();

console.log('\\n✅ Corrections appliquées !');
console.log('\\n📋 Prochaines étapes:');
console.log('1. Tester la navigation');
console.log('2. Vérifier que les URLs sont correctes');
console.log('3. Mettre à jour la documentation');
`;

  const fixScriptPath = path.join(__dirname, 'fix-routing-config.js');
  fs.writeFileSync(fixScriptPath, fixScriptContent, 'utf8');
  console.log(`\n✅ Script de correction créé: ${path.relative(process.cwd(), fixScriptPath)}`);
}

// Fonction principale
function main() {
  console.log('🔍 Analyse de la configuration de routage...\n');
  
  // 1. Analyser la structure
  analyzeRoutingStructure();
  
  // 2. Analyser les problèmes de navigation
  const navigationPatterns = analyzeNavigationIssues();
  
  // 3. Expliquer le problème
  explainRoutingIssue();
  
  // 4. Proposer des solutions
  proposeFixes();
  
  // 5. Créer un script de correction
  createFixScript();
  
  console.log('\n📊 Résumé:');
  console.log(`   - Patterns de navigation analysés: ${navigationPatterns.length}`);
  console.log(`   - Problème identifié: Duplication /colis/#/colis/`);
  console.log(`   - Solutions proposées: 4 options`);
  console.log(`   - Script de correction: Créé`);
  
  console.log('\n🎯 Recommandation:');
  console.log('   Exécuter le script de correction pour résoudre le problème:');
  console.log('   node scripts/fix-routing-config.js');
}

main(); 