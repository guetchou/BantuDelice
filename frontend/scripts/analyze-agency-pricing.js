#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Analyse des problèmes de sélection d\'agences et de tarification...');

// Configuration des agences par ville
const AGENCIES_BY_CITY = {
  'Brazzaville': [
    'agence_brazzaville_centre',
    'agence_brazzaville_aeroport',
    'agence_brazzaville_bacongo',
    'agence_brazzaville_poto_poto',
    'agence_brazzaville_moungali'
  ],
  'Pointe-Noire': [
    'agence_pointe_noire_centre',
    'agence_pointe_noire_port',
    'agence_pointe_noire_aeroport',
    'agence_pointe_noire_loandjili'
  ],
  'Dolisie': [
    'agence_dolisie_centre',
    'agence_dolisie_gare'
  ],
  'Nkayi': [
    'agence_nkayi_centre'
  ],
  'Ouesso': [
    'agence_ouesso_centre'
  ],
  'Impfondo': [
    'agence_impfondo_centre'
  ],
  'Gamboma': [
    'agence_gamboma_centre'
  ],
  'Madingou': [
    'agence_madingou_centre'
  ],
  'Mossendjo': [
    'agence_mossendjo_centre'
  ],
  'Kinkala': [
    'agence_kinkala_centre'
  ]
};

// Politique de tarification par zone
const PRICING_POLICY = {
  'urbain': {
    name: 'Zone Urbaine',
    baseRate: 1500,
    fuelSurcharge: 0.05,
    insuranceIncluded: 25000,
    cities: ['Brazzaville', 'Pointe-Noire']
  },
  'axe-principal': {
    name: 'Axe Principal',
    baseRate: 5000,
    fuelSurcharge: 0.08,
    insuranceIncluded: 50000,
    cities: ['Brazzaville', 'Pointe-Noire']
  },
  'secondaire': {
    name: 'Villes Secondaires',
    baseRate: 3500,
    fuelSurcharge: 0.10,
    insuranceIncluded: 40000,
    cities: ['Dolisie', 'Nkayi', 'Gamboma', 'Madingou', 'Mossendjo', 'Kinkala']
  },
  'enclave': {
    name: 'Zones Enclavées',
    baseRate: 4500,
    fuelSurcharge: 0.15,
    insuranceIncluded: 35000,
    cities: ['Ouesso', 'Impfondo']
  }
};

// Fonction pour analyser les problèmes de sélection d'agences
function analyzeAgencySelection() {
  console.log('\n📊 Analyse de la sélection d\'agences:');
  
  const expeditionFile = path.join(__dirname, '..', 'src/pages/colis/ColisExpeditionModernFixed.tsx');
  const content = fs.readFileSync(expeditionFile, 'utf8');
  
  // Extraire la liste actuelle des agences
  const agencyMatches = content.match(/SelectItem value="([^"]+)">([^<]+)</g);
  const currentAgencies = [];
  
  if (agencyMatches) {
    agencyMatches.forEach(match => {
      const value = match.match(/value="([^"]+)"/)[1];
      const label = match.match(/>([^<]+)</)[1];
      currentAgencies.push({ value, label });
    });
  }
  
  console.log('\n1. Agences actuellement configurées:');
  currentAgencies.forEach(agency => {
    console.log(`   📍 ${agency.value} → ${agency.label}`);
  });
  
  // Identifier les problèmes
  const issues = [];
  
  // Problème 1: Agences non liées aux villes
  console.log('\n2. Problèmes identifiés:');
  
  // Vérifier si les agences sont correctement liées aux villes
  const cityAgencyMismatch = [];
  Object.entries(AGENCIES_BY_CITY).forEach(([city, agencies]) => {
    agencies.forEach(agency => {
      if (!currentAgencies.find(a => a.value === agency)) {
        cityAgencyMismatch.push({ city, agency });
      }
    });
  });
  
  if (cityAgencyMismatch.length > 0) {
    console.log('   ❌ Agences manquantes par ville:');
    cityAgencyMismatch.forEach(item => {
      console.log(`      - ${item.city}: ${item.agency} manquante`);
    });
    issues.push('agences_manquantes');
  }
  
  // Problème 2: Agences sans ville associée
  const orphanAgencies = currentAgencies.filter(agency => {
    return !Object.values(AGENCIES_BY_CITY).flat().includes(agency.value);
  });
  
  if (orphanAgencies.length > 0) {
    console.log('   ❌ Agences orphelines (sans ville):');
    orphanAgencies.forEach(agency => {
      console.log(`      - ${agency.value} (${agency.label})`);
    });
    issues.push('agences_orphelines');
  }
  
  return { currentAgencies, issues, cityAgencyMismatch, orphanAgencies };
}

// Fonction pour analyser la politique de tarification
function analyzePricingPolicy() {
  console.log('\n💰 Analyse de la politique de tarification:');
  
  const tarifServiceFile = path.join(__dirname, '..', 'src/services/tarifService.ts');
  const content = fs.readFileSync(tarifServiceFile, 'utf8');
  
  // Extraire les zones tarifaires
  const zoneMatches = content.match(/id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*type:\s*'([^']+)'/g);
  const currentZones = [];
  
  if (zoneMatches) {
    zoneMatches.forEach(match => {
      const id = match.match(/id:\s*'([^']+)'/)[1];
      const name = match.match(/name:\s*'([^']+)'/)[1];
      const type = match.match(/type:\s*'([^']+)'/)[1];
      currentZones.push({ id, name, type });
    });
  }
  
  console.log('\n1. Zones tarifaires configurées:');
  currentZones.forEach(zone => {
    console.log(`   📍 ${zone.id} (${zone.type}) → ${zone.name}`);
  });
  
  // Vérifier la cohérence
  const pricingIssues = [];
  
  // Problème 1: Villes non couvertes par les zones
  const allCities = Object.keys(AGENCIES_BY_CITY);
  const coveredCities = Object.values(PRICING_POLICY).flatMap(zone => zone.cities);
  const uncoveredCities = allCities.filter(city => !coveredCities.includes(city));
  
  if (uncoveredCities.length > 0) {
    console.log('\n2. Problèmes de tarification:');
    console.log('   ❌ Villes sans politique tarifaire:');
    uncoveredCities.forEach(city => {
      console.log(`      - ${city}`);
    });
    pricingIssues.push('villes_sans_tarification');
  }
  
  // Problème 2: Incohérences dans les tarifs
  console.log('\n3. Vérification de la cohérence tarifaire:');
  
  Object.entries(PRICING_POLICY).forEach(([zoneId, policy]) => {
    const zoneInCode = currentZones.find(z => z.id === zoneId);
    if (!zoneInCode) {
      console.log(`   ❌ Zone ${zoneId} manquante dans le code`);
      pricingIssues.push('zones_manquantes');
    } else {
      console.log(`   ✅ Zone ${zoneId} configurée correctement`);
    }
  });
  
  return { currentZones, pricingIssues, uncoveredCities };
}

// Fonction pour créer un script de correction
function createFixScript(agencyAnalysis, pricingAnalysis) {
  console.log('\n🔧 Création du script de correction...');
  
  const fixScriptContent = `#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Correction des problèmes d\'agences et de tarification...');

// Configuration des agences par ville
const AGENCIES_BY_CITY = ${JSON.stringify(AGENCIES_BY_CITY, null, 2)};

// Fonction pour corriger la sélection d'agences
function fixAgencySelection() {
  const expeditionFile = path.join(__dirname, '..', 'src/pages/colis/ColisExpeditionModernFixed.tsx');
  let content = fs.readFileSync(expeditionFile, 'utf8');
  
  // Créer la liste complète des agences
  const allAgencies = [];
  Object.entries(AGENCIES_BY_CITY).forEach(([city, agencies]) => {
    agencies.forEach(agency => {
      const label = agency.replace(/_/g, ' ').replace(/agence /, 'Agence ').replace(/\\b\\w/g, l => l.toUpperCase());
      allAgencies.push({ value: agency, label });
    });
  });
  
  // Ajouter les options spéciales
  allAgencies.push(
    { value: 'ramassage_domicile', label: 'Ramassage à domicile' },
    { value: 'point_relais', label: 'Point Relais' }
  );
  
  // Générer le nouveau contenu SelectContent
  const newSelectContent = \`
                            <SelectContent>
                              {cities.map((city) => (
                                <React.Fragment key={city}>
                                  <SelectItem value="" disabled className="font-semibold text-gray-600">
                                    --- \${city} ---
                                  </SelectItem>
                                  {getAgenciesForCity(city).map((agency) => (
                                    <SelectItem key={agency.value} value={agency.value}>
                                      {agency.label}
                                    </SelectItem>
                                  ))}
                                </React.Fragment>
                              ))}
                              <SelectItem value="" disabled className="font-semibold text-gray-600">
                                --- Options spéciales ---
                              </SelectItem>
                              <SelectItem value="ramassage_domicile">Ramassage à domicile</SelectItem>
                              <SelectItem value="point_relais">Point Relais</SelectItem>
                            </SelectContent>\`;
  
  // Remplacer l'ancien SelectContent
  const oldSelectContentRegex = /<SelectContent>[\s\S]*?<\/SelectContent>/;
  content = content.replace(oldSelectContentRegex, newSelectContent);
  
  // Ajouter la fonction helper
  const helperFunction = \`
  // Fonction helper pour obtenir les agences par ville
  const getAgenciesForCity = (city: string) => {
    const agenciesByCity = ${JSON.stringify(AGENCIES_BY_CITY)};
    const agencies = agenciesByCity[city] || [];
    return agencies.map(agency => ({
      value: agency,
      label: agency.replace(/_/g, ' ').replace(/agence /, 'Agence ').replace(/\\b\\w/g, l => l.toUpperCase())
    }));
  };\`;
  
  // Insérer la fonction helper
  const insertAfter = 'const ColisExpeditionModernFixed: React.FC = () => {';
  const insertIndex = content.indexOf(insertAfter) + insertAfter.length;
  content = content.slice(0, insertIndex) + '\\n' + helperFunction + content.slice(insertIndex);
  
  fs.writeFileSync(expeditionFile, content, 'utf8');
  console.log('✅ Sélection d\'agences corrigée');
}

// Fonction pour corriger la politique de tarification
function fixPricingPolicy() {
  const tarifServiceFile = path.join(__dirname, '..', 'src/services/tarifService.ts');
  let content = fs.readFileSync(tarifServiceFile, 'utf8');
  
  // Ajouter les villes manquantes dans les zones
  const pricingPolicy = ${JSON.stringify(PRICING_POLICY, null, 2)};
  
  // Mettre à jour les zones avec toutes les villes
  Object.entries(pricingPolicy).forEach(([zoneId, policy]) => {
    const zoneRegex = new RegExp(\`(id: '\${zoneId}',[\\s\\S]*?cities:\\s*\\[)[^\\]]*(\\])\`, 'g');
    const citiesString = policy.cities.map(city => \`'\${city}'\`).join(', ');
    content = content.replace(zoneRegex, \`\$1\${citiesString}\$2\`);
  });
  
  fs.writeFileSync(tarifServiceFile, content, 'utf8');
  console.log('✅ Politique de tarification corrigée');
}

// Fonction pour ajouter la validation ville-agence
function addCityAgencyValidation() {
  const expeditionFile = path.join(__dirname, '..', 'src/pages/colis/ColisExpeditionModernFixed.tsx');
  let content = fs.readFileSync(expeditionFile, 'utf8');
  
  // Ajouter la validation
  const validationFunction = \`
  // Validation ville-agence
  const validateCityAgency = (city: string, agency: string) => {
    const agenciesByCity = ${JSON.stringify(AGENCIES_BY_CITY)};
    const validAgencies = agenciesByCity[city] || [];
    const specialOptions = ['ramassage_domicile', 'point_relais'];
    
    return validAgencies.includes(agency) || specialOptions.includes(agency);
  };
  
  // Effet pour valider la sélection ville-agence
  useEffect(() => {
    if (formData.sender.city && formData.sender.agency) {
      if (!validateCityAgency(formData.sender.city, formData.sender.agency)) {
        // Réinitialiser l'agence si elle ne correspond pas à la ville
        updateNestedField('sender', 'agency', '');
      }
    }
  }, [formData.sender.city]);\`;
  
  // Insérer la validation
  const insertAfter = 'const getAgenciesForCity = (city: string) => {';
  const insertIndex = content.indexOf(insertAfter) + insertAfter.length;
  const endOfFunction = content.indexOf('};', insertIndex) + 2;
  content = content.slice(0, endOfFunction) + '\\n' + validationFunction + content.slice(endOfFunction);
  
  fs.writeFileSync(expeditionFile, content, 'utf8');
  console.log('✅ Validation ville-agence ajoutée');
}

// Exécuter les corrections
fixAgencySelection();
fixPricingPolicy();
addCityAgencyValidation();

console.log('\\n✅ Corrections appliquées !');
console.log('\\n📋 Prochaines étapes:');
console.log('1. Tester la sélection d\'agences par ville');
console.log('2. Vérifier la cohérence tarifaire');
console.log('3. Valider la logique ville-agence');
`;

  const fixScriptPath = path.join(__dirname, 'fix-agency-pricing.js');
  fs.writeFileSync(fixScriptPath, fixScriptContent, 'utf8');
  console.log(`✅ Script de correction créé: ${path.relative(process.cwd(), fixScriptPath)}`);
}

// Fonction pour créer un rapport
function createReport(agencyAnalysis, pricingAnalysis) {
  const reportContent = `# 🔍 RAPPORT D'ANALYSE AGENCES ET TARIFICATION

## 📊 Problèmes identifiés

### **1. Sélection d'agences**

#### **Problèmes trouvés :**
${agencyAnalysis.issues.length > 0 ? agencyAnalysis.issues.map(issue => `- ❌ ${issue}`).join('\\n') : '- ✅ Aucun problème majeur'}

#### **Agences actuellement configurées :**
${agencyAnalysis.currentAgencies.map(agency => `- ${agency.value} → ${agency.label}`).join('\\n')}

#### **Agences manquantes par ville :**
${agencyAnalysis.cityAgencyMismatch.length > 0 ? agencyAnalysis.cityAgencyMismatch.map(item => `- ${item.city}: ${item.agency}`).join('\\n') : '- ✅ Toutes les agences sont configurées'}

#### **Agences orphelines :**
${agencyAnalysis.orphanAgencies.length > 0 ? agencyAnalysis.orphanAgencies.map(agency => `- ${agency.value} (${agency.label})`).join('\\n') : '- ✅ Aucune agence orpheline'}

### **2. Politique de tarification**

#### **Zones tarifaires configurées :**
${pricingAnalysis.currentZones.map(zone => `- ${zone.id} (${zone.type}) → ${zone.name}`).join('\\n')}

#### **Problèmes de tarification :**
${pricingAnalysis.pricingIssues.length > 0 ? pricingAnalysis.pricingIssues.map(issue => `- ❌ ${issue}`).join('\\n') : '- ✅ Aucun problème majeur'}

#### **Villes sans politique tarifaire :**
${pricingAnalysis.uncoveredCities.length > 0 ? pricingAnalysis.uncoveredCities.map(city => `- ${city}`).join('\\n') : '- ✅ Toutes les villes sont couvertes'}

## 🔧 Corrections proposées

### **1. Sélection d'agences dynamique**
- ✅ Filtrer les agences selon la ville sélectionnée
- ✅ Ajouter une validation ville-agence
- ✅ Organiser les agences par ville dans le dropdown

### **2. Politique de tarification cohérente**
- ✅ Couvrir toutes les villes avec des zones tarifaires
- ✅ Standardiser les tarifs par zone
- ✅ Ajouter des validations de cohérence

### **3. Améliorations UX**
- ✅ Messages d'aide contextuels
- ✅ Validation en temps réel
- ✅ Suggestions intelligentes

## 🎯 Recommandations

### **Immédiates :**
1. Implémenter la sélection d'agences par ville
2. Corriger les zones tarifaires manquantes
3. Ajouter la validation ville-agence

### **À moyen terme :**
1. Créer une interface d'administration des agences
2. Implémenter un système de géolocalisation
3. Ajouter des statistiques d'utilisation

### **À long terme :**
1. Système de gestion des agences en temps réel
2. Tarification dynamique selon la demande
3. Optimisation des routes de livraison

## ✅ Résultat attendu

Après correction, le système sera :
- ✅ **Cohérent** : Agences liées aux villes
- ✅ **Complet** : Toutes les villes couvertes
- ✅ **Logique** : Tarification standardisée
- ✅ **Utilisable** : Interface intuitive

---
*Rapport généré le ${new Date().toLocaleDateString('fr-FR')}*
`;

  const reportPath = path.join(__dirname, '..', 'ANALYSE_AGENCES_TARIFICATION.md');
  fs.writeFileSync(reportPath, reportContent, 'utf8');
  console.log(`✅ Rapport créé: ${path.relative(process.cwd(), reportPath)}`);
}

// Fonction principale
function main() {
  console.log('🔍 Début de l\'analyse...\n');
  
  // 1. Analyser les problèmes d'agences
  const agencyAnalysis = analyzeAgencySelection();
  
  // 2. Analyser la politique de tarification
  const pricingAnalysis = analyzePricingPolicy();
  
  // 3. Créer le script de correction
  createFixScript(agencyAnalysis, pricingAnalysis);
  
  // 4. Créer le rapport
  createReport(agencyAnalysis, pricingAnalysis);
  
  console.log('\n📊 Résumé:');
  console.log(`   - Problèmes d'agences: ${agencyAnalysis.issues.length}`);
  console.log(`   - Problèmes de tarification: ${pricingAnalysis.pricingIssues.length}`);
  console.log(`   - Agences manquantes: ${agencyAnalysis.cityAgencyMismatch.length}`);
  console.log(`   - Villes non couvertes: ${pricingAnalysis.uncoveredCities.length}`);
  
  console.log('\n🎯 Recommandation:');
  console.log('   Exécuter le script de correction pour résoudre les problèmes:');
  console.log('   node scripts/fix-agency-pricing.js');
}

main(); 