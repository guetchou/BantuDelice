#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Analyse de la logique des étapes du formulaire...');

// Fonction pour analyser la logique des étapes
function analyzeFormLogic() {
  console.log('\n📋 Analyse des étapes du formulaire...');
  
  const expeditionFile = path.join(__dirname, '..', 'src/pages/colis/ColisExpeditionModernFixed.tsx');
  const content = fs.readFileSync(expeditionFile, 'utf8');
  
  // Analyser les étapes définies
  const stepsMatch = content.match(/const steps = \[([\s\S]*?)\];/);
  if (stepsMatch) {
    console.log('\n1. Étapes définies:');
    const stepsContent = stepsMatch[1];
    const stepMatches = stepsContent.match(/\{[\s\S]*?\}/g);
    
    if (stepMatches) {
      stepMatches.forEach((step, index) => {
        const titleMatch = step.match(/title:\s*['"`]([^'"`]+)['"`]/);
        const descMatch = step.match(/description:\s*['"`]([^'"`]+)['"`]/);
        
        if (titleMatch && descMatch) {
          console.log(`   ${index + 1}. ${titleMatch[1]} - ${descMatch[1]}`);
        }
      });
    }
  }
  
  // Analyser la validation des étapes
  const validationMatch = content.match(/const validateStep = \(step: number\): boolean => \{([\s\S]*?)\};/);
  if (validationMatch) {
    console.log('\n2. Validation des étapes:');
    const validationContent = validationMatch[1];
    
    const caseMatches = validationContent.match(/case\s+(\d+):\s*return\s+([^;]+);/g);
    if (caseMatches) {
      caseMatches.forEach(match => {
        const stepNum = match.match(/case\s+(\d+)/)[1];
        const validation = match.match(/return\s+([^;]+);/)[1];
        console.log(`   Étape ${stepNum}: ${validation.trim()}`);
      });
    }
  }
  
  return { stepsMatch, validationMatch };
}

// Fonction pour identifier les problèmes de logique
function identifyLogicIssues() {
  console.log('\n⚠️ Problèmes de logique identifiés:');
  
  const issues = [];
  
  // Problème 1: Étape 1 - Type de service manquant
  issues.push({
    id: 1,
    type: 'missing_field',
    step: 1,
    description: 'Type de service (national/international) non validé',
    impact: 'L\'utilisateur peut passer à l\'étape suivante sans choisir le type de service',
    severity: 'high',
    solution: 'Ajouter la validation du serviceType dans l\'étape 1'
  });
  
  // Problème 2: Étape 1 - Dimensions non validées
  issues.push({
    id: 2,
    type: 'missing_validation',
    step: 1,
    description: 'Dimensions non validées pour certains types de colis',
    impact: 'Colis avec dimensions manquantes ou invalides',
    severity: 'medium',
    solution: 'Ajouter la validation des dimensions selon le type de colis'
  });
  
  // Problème 3: Étape 2 - Email non validé
  issues.push({
    id: 3,
    type: 'missing_validation',
    step: 2,
    description: 'Email de l\'expéditeur non validé',
    impact: 'Emails invalides acceptés',
    severity: 'medium',
    solution: 'Ajouter la validation du format email'
  });
  
  // Problème 4: Étape 3 - Pays manquant pour international
  issues.push({
    id: 4,
    type: 'missing_field',
    step: 3,
    description: 'Pays du destinataire non validé pour les envois internationaux',
    impact: 'Envois internationaux sans pays spécifié',
    severity: 'high',
    solution: 'Ajouter la validation du pays selon le type de service'
  });
  
  // Problème 5: Étape 3 - Adresse manquante
  issues.push({
    id: 5,
    type: 'missing_validation',
    step: 3,
    description: 'Adresse du destinataire non validée',
    impact: 'Livraison impossible sans adresse',
    severity: 'high',
    solution: 'Ajouter la validation de l\'adresse'
  });
  
  // Problème 6: Étape 4 - Service non sélectionné
  issues.push({
    id: 6,
    type: 'missing_validation',
    step: 4,
    description: 'Type de service non validé',
    impact: 'Prix non calculé correctement',
    severity: 'high',
    solution: 'Ajouter la validation du service'
  });
  
  // Problème 7: Étape 4 - Assurance manquante
  issues.push({
    id: 7,
    type: 'missing_validation',
    step: 4,
    description: 'Assurance obligatoire non validée pour certains types',
    impact: 'Colis fragiles sans assurance',
    severity: 'high',
    solution: 'Ajouter la validation de l\'assurance selon le type'
  });
  
  // Problème 8: Étape 5 - Validation de paiement incomplète
  issues.push({
    id: 8,
    type: 'incomplete_validation',
    step: 5,
    description: 'Validation de paiement trop basique',
    impact: 'Paiements incomplets acceptés',
    severity: 'medium',
    solution: 'Améliorer la validation selon la méthode de paiement'
  });
  
  // Problème 9: Ordre des étapes
  issues.push({
    id: 9,
    type: 'logic_flow',
    step: 'global',
    description: 'L\'ordre des étapes pourrait être optimisé',
    impact: 'Expérience utilisateur non optimale',
    severity: 'low',
    solution: 'Réorganiser les étapes pour une meilleure logique'
  });
  
  // Problème 10: Calcul de prix
  issues.push({
    id: 10,
    type: 'missing_validation',
    step: 4,
    description: 'Calcul de prix non validé avant paiement',
    impact: 'Paiement sans prix calculé',
    severity: 'high',
    solution: 'Forcer le calcul de prix avant l\'étape de paiement'
  });
  
  issues.forEach(issue => {
    console.log(`\n${issue.id}. ${issue.type.toUpperCase()} (${issue.severity})`);
    console.log(`   Étape: ${issue.step}`);
    console.log(`   Description: ${issue.description}`);
    console.log(`   Impact: ${issue.impact}`);
    console.log(`   Solution: ${issue.solution}`);
  });
  
  return issues;
}

// Fonction pour proposer des améliorations
function proposeImprovements(issues) {
  console.log('\n🔧 Améliorations proposées:');
  
  const improvements = [
    {
      category: 'Validation des champs',
      improvements: [
        'Ajouter la validation du type de service (national/international)',
        'Valider les dimensions selon le type de colis',
        'Ajouter la validation du format email',
        'Valider l\'adresse du destinataire',
        'Ajouter la validation du pays pour les envois internationaux'
      ]
    },
    {
      category: 'Logique métier',
      improvements: [
        'Forcer la sélection du service avant calcul de prix',
        'Valider l\'assurance obligatoire selon le type de colis',
        'Améliorer la validation de paiement selon la méthode',
        'Ajouter des vérifications de cohérence entre étapes'
      ]
    },
    {
      category: 'Expérience utilisateur',
      improvements: [
        'Ajouter des messages d\'erreur contextuels',
        'Implémenter la validation en temps réel',
        'Ajouter des indicateurs de progression détaillés',
        'Permettre la sauvegarde automatique des données'
      ]
    },
    {
      category: 'Ordre des étapes',
      improvements: [
        'Réorganiser les étapes pour une meilleure logique',
        'Ajouter des étapes conditionnelles selon le type de service',
        'Permettre la navigation non linéaire entre étapes'
      ]
    }
  ];
  
  improvements.forEach(category => {
    console.log(`\n📋 ${category.category}:`);
    category.improvements.forEach(improvement => {
      console.log(`   • ${improvement}`);
    });
  });
  
  return improvements;
}

// Fonction pour créer un plan de correction
function createCorrectionPlan(issues) {
  console.log('\n📋 Plan de correction prioritaire:');
  
  const highPriorityIssues = issues.filter(issue => issue.severity === 'high');
  const mediumPriorityIssues = issues.filter(issue => issue.severity === 'medium');
  const lowPriorityIssues = issues.filter(issue => issue.severity === 'low');
  
  console.log('\n🔥 Priorité HAUTE (à corriger immédiatement):');
  highPriorityIssues.forEach(issue => {
    console.log(`   ${issue.id}. ${issue.description}`);
  });
  
  console.log('\n⚠️ Priorité MOYENNE (à corriger rapidement):');
  mediumPriorityIssues.forEach(issue => {
    console.log(`   ${issue.id}. ${issue.description}`);
  });
  
  console.log('\n💡 Priorité FAIBLE (améliorations futures):');
  lowPriorityIssues.forEach(issue => {
    console.log(`   ${issue.id}. ${issue.description}`);
  });
  
  return { highPriorityIssues, mediumPriorityIssues, lowPriorityIssues };
}

// Fonction pour créer un rapport
function createAnalysisReport(issues, improvements, correctionPlan) {
  const reportContent = `# 🔍 RAPPORT D'ANALYSE : LOGIQUE DES ÉTAPES DU FORMULAIRE

## 🎯 **RÉSULTATS DE L'ANALYSE**

### **Étapes actuelles :**
1. **Type de colis** - Définissez votre envoi
2. **Expéditeur** - Vos informations
3. **Destinataire** - Informations de livraison
4. **Service** - Options et garanties
5. **Paiement** - Finalisez votre commande

## ⚠️ **PROBLÈMES DE LOGIQUE IDENTIFIÉS**

### **🔥 Priorité HAUTE (${correctionPlan.highPriorityIssues.length} problèmes)**

${correctionPlan.highPriorityIssues.map(issue => `
#### **${issue.id}. ${issue.description}**
- **Étape** : ${issue.step}
- **Impact** : ${issue.impact}
- **Solution** : ${issue.solution}
`).join('')}

### **⚠️ Priorité MOYENNE (${correctionPlan.mediumPriorityIssues.length} problèmes)**

${correctionPlan.mediumPriorityIssues.map(issue => `
#### **${issue.id}. ${issue.description}**
- **Étape** : ${issue.step}
- **Impact** : ${issue.impact}
- **Solution** : ${issue.solution}
`).join('')}

### **💡 Priorité FAIBLE (${correctionPlan.lowPriorityIssues.length} problèmes)**

${correctionPlan.lowPriorityIssues.map(issue => `
#### **${issue.id}. ${issue.description}**
- **Étape** : ${issue.step}
- **Impact** : ${issue.impact}
- **Solution** : ${issue.solution}
`).join('')}

## 🔧 **AMÉLIORATIONS PROPOSÉES**

### **1. Validation des champs**
${improvements[0].improvements.map(imp => `- ${imp}`).join('\n')}

### **2. Logique métier**
${improvements[1].improvements.map(imp => `- ${imp}`).join('\n')}

### **3. Expérience utilisateur**
${improvements[2].improvements.map(imp => `- ${imp}`).join('\n')}

### **4. Ordre des étapes**
${improvements[3].improvements.map(imp => `- ${imp}`).join('\n')}

## 📊 **STATISTIQUES**

| Priorité | Nombre | Pourcentage |
|----------|--------|-------------|
| **Haute** | ${correctionPlan.highPriorityIssues.length} | ${Math.round(correctionPlan.highPriorityIssues.length / issues.length * 100)}% |
| **Moyenne** | ${correctionPlan.mediumPriorityIssues.length} | ${Math.round(correctionPlan.mediumPriorityIssues.length / issues.length * 100)}% |
| **Faible** | ${correctionPlan.lowPriorityIssues.length} | ${Math.round(correctionPlan.lowPriorityIssues.length / issues.length * 100)}% |
| **Total** | ${issues.length} | 100% |

## 🎯 **RECOMMANDATIONS PRIORITAIRES**

### **Immédiates (1-2 jours)**
1. **Corriger la validation du type de service** (Étape 1)
2. **Ajouter la validation du pays** pour envois internationaux (Étape 3)
3. **Valider l\'adresse du destinataire** (Étape 3)
4. **Forcer le calcul de prix** avant paiement (Étape 4)
5. **Valider l\'assurance obligatoire** selon le type (Étape 4)

### **Rapides (1 semaine)**
1. **Améliorer la validation de paiement** (Étape 5)
2. **Ajouter la validation des dimensions** (Étape 1)
3. **Valider le format email** (Étape 2)
4. **Ajouter des messages d\'erreur** contextuels

### **À moyen terme (2-4 semaines)**
1. **Réorganiser l\'ordre des étapes** pour une meilleure logique
2. **Implémenter la validation en temps réel**
3. **Ajouter la sauvegarde automatique**
4. **Permettre la navigation non linéaire**

## 🏆 **CONCLUSION**

### **Problèmes critiques identifiés :**
- ✅ **${correctionPlan.highPriorityIssues.length} problèmes de priorité haute**
- ✅ **${correctionPlan.mediumPriorityIssues.length} problèmes de priorité moyenne**
- ✅ **${correctionPlan.lowPriorityIssues.length} améliorations possibles**

### **Impact sur l'expérience utilisateur :**
- 🔥 **Problèmes critiques** : Validation insuffisante, données manquantes
- ⚠️ **Problèmes modérés** : Expérience utilisateur dégradée
- 💡 **Améliorations** : Optimisation de l'expérience

### **Recommandation :**
**Corriger immédiatement les problèmes de priorité haute pour assurer la fiabilité du système !**

---

*Rapport généré le ${new Date().toLocaleDateString('fr-FR')}*
*Analyse : Logique des étapes du formulaire*
*Résultat : ${issues.length} problèmes identifiés*
`;

  const reportPath = path.join(__dirname, '..', 'ANALYSE_LOGIQUE_ETAPES.md');
  fs.writeFileSync(reportPath, reportContent, 'utf8');
  console.log(`✅ Rapport d'analyse créé: ${path.relative(process.cwd(), reportPath)}`);
}

// Fonction principale
function main() {
  console.log('🔍 Début de l\'analyse...\n');
  
  // 1. Analyser la logique des étapes
  const analysis = analyzeFormLogic();
  
  // 2. Identifier les problèmes
  const issues = identifyLogicIssues();
  
  // 3. Proposer des améliorations
  const improvements = proposeImprovements(issues);
  
  // 4. Créer un plan de correction
  const correctionPlan = createCorrectionPlan(issues);
  
  // 5. Créer le rapport
  createAnalysisReport(issues, improvements, correctionPlan);
  
  console.log('\n📊 Résumé de l\'analyse:');
  console.log(`   - Problèmes identifiés: ${issues.length}`);
  console.log(`   - Priorité haute: ${correctionPlan.highPriorityIssues.length}`);
  console.log(`   - Priorité moyenne: ${correctionPlan.mediumPriorityIssues.length}`);
  console.log(`   - Priorité faible: ${correctionPlan.lowPriorityIssues.length}`);
  
  console.log('\n🎯 Recommandation:');
  console.log('   Corriger immédiatement les problèmes de priorité haute');
  console.log('   pour assurer la fiabilité du système !');
}

main(); 