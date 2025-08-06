#!/usr/bin/env node

import fs from 'fs';

const filePath = 'frontend/src/pages/colis/ColisExpeditionModernFixed.tsx';

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Corriger la validation de l'étape 5 dans validateStep
  const newValidateStep5 = `      case 5:
        if (!formData.paymentMethod) {
          return false;
        }
        if (formData.paymentMethod === 'cash') {
          return !!formData.cashAmount && parseFloat(formData.cashAmount) > 0;
        } else {
          return !!formData.phoneNumber && validatePhoneNumber(formData.phoneNumber);
        }`;
  
  // Remplacer la validation de l'étape 5
  const validateStep5Regex = /case 5:\s*if \(!formData\.paymentMethod\) \{[\s\S]*?return false;\s*\}\s*if \(formData\.paymentMethod === 'cash'\) \{[\s\S]*?return !!formData\.cashAmount && parseFloat\(formData\.cashAmount\) > 0;\s*\} else \{[\s\S]*?return !!formData\.phoneNumber && validatePhoneNumber\(formData\.phoneNumber\);\s*\}/;
  
  content = content.replace(validateStep5Regex, newValidateStep5);
  
  // Corriger aussi la validation dans validateStepWithErrors
  const newValidateStepWithErrors5 = `      case 5:
        if (!formData.paymentMethod) {
          errors.push("Veuillez sélectionner une méthode de paiement");
        }
        if (formData.paymentMethod === 'cash') {
          if (!formData.cashAmount || parseFloat(formData.cashAmount) <= 0) {
            errors.push("Le montant en espèces doit être supérieur à 0");
          }
        } else {
          if (!formData.phoneNumber) {
            errors.push("Le numéro de téléphone est obligatoire pour le paiement mobile");
          } else if (!validatePhoneNumber(formData.phoneNumber)) {
            errors.push("Le numéro de téléphone n'est pas valide");
          }
        }
        break;`;
  
  // Remplacer la validation dans validateStepWithErrors
  const validateStepWithErrors5Regex = /case 5:\s*if \(!formData\.paymentMethod\) errors\.push\("Veuillez sélectionner une méthode de paiement"\);[\s\S]*?if \(formData\.paymentMethod === 'cash'\) \{[\s\S]*?errors\.push\("Le montant en espèces doit être supérieur à 0"\);[\s\S]*?\} else \{[\s\S]*?errors\.push\("Le numéro de téléphone n'est pas valide"\);[\s\S]*?\}\s*break;/;
  
  content = content.replace(validateStepWithErrors5Regex, newValidateStepWithErrors5);
  
  // Écrire le fichier modifié
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Validation de l\'étape 5 corrigée !');
  console.log('🔧 Modifications:');
  console.log('   - Validation phoneNumber pour paiement mobile');
  console.log('   - Messages d\'erreur améliorés');
  console.log('   - Logique de validation complète');
  
} catch (error) {
  console.error('❌ Erreur lors de la correction:', error.message);
  process.exit(1);
} 