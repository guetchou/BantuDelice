#!/usr/bin/env node

import fs from 'fs';

const filePath = 'frontend/src/pages/colis/ColisExpeditionModernFixed.tsx';

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Ajouter la validation en temps réel pour l'étape 5
  const step5Validation = `
  // Validation en temps réel pour l'étape 5
  useEffect(() => {
    if (currentStep === 5) {
      const validation = validateStepWithErrors(5);
      if (!validation.isValid) {
        setStepErrors(prev => ({ ...prev, 5: validation.errors }));
      } else {
        setStepErrors(prev => ({ ...prev, 5: [] }));
      }
    }
  }, [currentStep, formData.paymentMethod, formData.phoneNumber, formData.cashAmount]);`;
  
  // Trouver le dernier useEffect et ajouter après
  const lastUseEffectRegex = /useEffect\(\(\) => \{[\s\S]*?\}, \[currentStep, formData\.recipient\.city, formData\.recipient\.agency\]\);/;
  
  if (lastUseEffectRegex.test(content)) {
    content = content.replace(lastUseEffectRegex, (match) => {
      return match + step5Validation;
    });
  } else {
    // Si pas de useEffect trouvé, ajouter après les autres useEffect
    const useEffectsEndRegex = /useEffect\(\(\) => \{[\s\S]*?\}, \[.*?\]\);/g;
    const matches = content.match(useEffectsEndRegex);
    if (matches && matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      content = content.replace(lastMatch, lastMatch + step5Validation);
    }
  }
  
  // Écrire le fichier modifié
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Validation en temps réel ajoutée pour l\'étape 5 !');
  console.log('🔧 Modifications:');
  console.log('   - useEffect pour validation temps réel');
  console.log('   - Déclenchement sur changement des champs');
  console.log('   - Mise à jour automatique des erreurs');
  
} catch (error) {
  console.error('❌ Erreur lors de l\'ajout:', error.message);
  process.exit(1);
} 