#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Correction des validations des étapes...');

function fixValidations() {
  const expeditionFile = path.join(__dirname, '..', 'src/pages/colis/ColisExpeditionModernFixed.tsx');
  let content = fs.readFileSync(expeditionFile, 'utf8');
  
  console.log('📋 Application des corrections...');
  
  // 1. Ajouter les fonctions de validation
  const validationFunctions = `
  // Fonctions de validation
  const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone) return false;
    const phoneRegex = /^(\+242|242)?[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\\s/g, ''));
  };

  const validateDimensions = (dimensions: { length: string; width: string; height: string }): boolean => {
    if (!dimensions) return false;
    const { length, width, height } = dimensions;
    return !!(length && width && height && 
              parseFloat(length) > 0 && parseFloat(width) > 0 && parseFloat(height) > 0);
  };`;

  // Insérer après les imports
  const importEndIndex = content.lastIndexOf('import');
  const importEndLine = content.indexOf('\n', content.indexOf(';', importEndIndex)) + 1;
  content = content.slice(0, importEndLine) + validationFunctions + '\n' + content.slice(importEndLine);
  
  // 2. Remplacer la fonction validateStep
  const newValidateStep = `
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.serviceType && !!formData.weight && !!formData.packageType && 
               (formData.packageType === 'document' || validateDimensions(formData.dimensions));
      case 2:
        return !!formData.sender.name && !!formData.sender.phone && 
               !!formData.sender.city && !!formData.sender.agency &&
               validateEmail(formData.sender.email);
      case 3:
        return !!formData.recipient.name && !!formData.recipient.phone && 
               !!formData.recipient.city && !!formData.recipient.address &&
               (formData.serviceType === 'national' || !!formData.recipient.country);
      case 4:
        const requiredFields = getRequiredFieldsForPackageType(formData.packageType);
        if (requiredFields.includes('specialInstructions') && !formData.specialInstructions) {
          return false;
        }
        if (!formData.service) {
          return false;
        }
        if ((formData.packageType === 'fragile' || formData.packageType === 'electronics') && !formData.insurance) {
          return false;
        }
        if (!priceCalculation || !priceCalculation.total) {
          return false;
        }
        return true;
      case 5:
        if (!formData.paymentMethod) {
          return false;
        }
        if (formData.paymentMethod === 'cash') {
          return !!formData.cashAmount && parseFloat(formData.cashAmount) > 0;
        } else {
          return !!formData.phoneNumber && validatePhoneNumber(formData.phoneNumber);
        }
      default:
        return false;
    }
  };`;

  // Remplacer l'ancienne fonction
  const oldValidateStepRegex = /const validateStep = \(step: number\): boolean => \{[\s\S]*?\};/;
  content = content.replace(oldValidateStepRegex, newValidateStep);
  
  // 3. Ajouter l'état pour les erreurs
  const errorState = `
  const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({});`;
  
  // Insérer après les autres états
  const stateIndex = content.indexOf('const [currentStep, setCurrentStep]');
  const stateEndLine = content.indexOf('\n', content.indexOf(';', stateIndex)) + 1;
  content = content.slice(0, stateEndLine) + errorState + '\n' + content.slice(stateEndLine);
  
  // 4. Ajouter la fonction de validation avec messages d'erreur
  const validationWithErrors = `
  const validateStepWithErrors = (step: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    switch (step) {
      case 1:
        if (!formData.serviceType) errors.push('Veuillez sélectionner le type de service (national/international)');
        if (!formData.weight) errors.push('Le poids est obligatoire');
        if (!formData.packageType) errors.push('Le type de colis est obligatoire');
        if (formData.packageType !== 'document' && !validateDimensions(formData.dimensions)) {
          errors.push('Les dimensions sont obligatoires pour ce type de colis');
        }
        break;
        
      case 2:
        if (!formData.sender.name) errors.push('Le nom de l\'expéditeur est obligatoire');
        if (!formData.sender.phone) errors.push('Le téléphone de l\'expéditeur est obligatoire');
        if (!formData.sender.city) errors.push('La ville de l\'expéditeur est obligatoire');
        if (!formData.sender.agency) errors.push('L\'agence d\'envoi est obligatoire');
        if (!validateEmail(formData.sender.email)) errors.push('L\'email de l\'expéditeur n\'est pas valide');
        break;
        
      case 3:
        if (!formData.recipient.name) errors.push('Le nom du destinataire est obligatoire');
        if (!formData.recipient.phone) errors.push('Le téléphone du destinataire est obligatoire');
        if (!formData.recipient.city) errors.push('La ville du destinataire est obligatoire');
        if (!formData.recipient.address) errors.push('L\'adresse du destinataire est obligatoire');
        if (formData.serviceType === 'international' && !formData.recipient.country) {
          errors.push('Le pays est obligatoire pour les envois internationaux');
        }
        break;
        
      case 4:
        if (!formData.service) errors.push('Veuillez sélectionner un service');
        if ((formData.packageType === 'fragile' || formData.packageType === 'electronics') && !formData.insurance) {
          errors.push('L\'assurance est obligatoire pour les colis fragiles et électroniques');
        }
        if (!priceCalculation || !priceCalculation.total) {
          errors.push('Le calcul de prix est obligatoire avant de continuer');
        }
        break;
        
      case 5:
        if (!formData.paymentMethod) errors.push('Veuillez sélectionner une méthode de paiement');
        if (formData.paymentMethod === 'cash') {
          if (!formData.cashAmount || parseFloat(formData.cashAmount) <= 0) {
            errors.push('Le montant en espèces doit être supérieur à 0');
          }
        } else {
          if (!validatePhoneNumber(formData.phoneNumber)) {
            errors.push('Le numéro de téléphone n\'est pas valide');
          }
        }
        break;
    }
    
    return { isValid: errors.length === 0, errors };
  };`;

  // Insérer après validateStep
  const validateStepIndex = content.indexOf('const validateStep = (step: number): boolean => {');
  const validateStepEnd = content.indexOf('};', validateStepIndex) + 2;
  content = content.slice(0, validateStepEnd) + '\n' + validationWithErrors + content.slice(validateStepEnd);
  
  // 5. Modifier handleNext
  const newHandleNext = `
  const handleNext = () => {
    const validation = validateStepWithErrors(currentStep);
    setStepErrors(prev => ({ ...prev, [currentStep]: validation.errors }));
    
    if (validation.isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setStepErrors(prev => ({ ...prev, [currentStep]: [] }));
    }
  };`;

  const oldHandleNextRegex = /const handleNext = \(\) => \{[\s\S]*?\};/;
  content = content.replace(oldHandleNextRegex, newHandleNext);
  
  // 6. Ajouter useEffect pour validation en temps réel
  const realTimeValidation = `
  // Validation en temps réel
  useEffect(() => {
    if (currentStep > 0) {
      const validation = validateStepWithErrors(currentStep);
      setStepErrors(prev => ({ ...prev, [currentStep]: validation.errors }));
    }
  }, [formData, currentStep]);`;

  // Insérer après les autres useEffect
  const useEffectIndex = content.lastIndexOf('useEffect');
  const useEffectEndLine = content.indexOf('\n', content.indexOf('}, [', useEffectIndex)) + 1;
  content = content.slice(0, useEffectEndLine) + realTimeValidation + '\n' + content.slice(useEffectEndLine);
  
  // 7. Ajouter le composant d'affichage des erreurs
  const errorDisplayComponent = `
  // Composant d'affichage des erreurs
  const StepErrors: React.FC<{ step: number }> = ({ step }) => {
    const errors = stepErrors[step] || [];
    
    if (errors.length === 0) return null;
    
    return (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-700 mb-2">
          <AlertCircle className="h-4 w-4" />
          <span className="font-medium">Erreurs à corriger :</span>
        </div>
        <ul className="text-sm text-red-600 space-y-1">
          {errors.map((error, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>{error}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };`;

  // Insérer avant le return
  const returnIndex = content.indexOf('return (');
  content = content.slice(0, returnIndex) + errorDisplayComponent + '\n\n  ' + content.slice(returnIndex);
  
  // Sauvegarder
  fs.writeFileSync(expeditionFile, content, 'utf8');
  console.log('✅ Validations corrigées avec succès !');
  
  return true;
}

// Fonction principale
function main() {
  console.log('🔧 Début des corrections...\n');
  
  try {
    fixValidations();
    
    console.log('\n🎉 Corrections appliquées avec succès !');
    console.log('\n📊 Résumé des corrections:');
    console.log('   ✅ Validation du type de service (Étape 1)');
    console.log('   ✅ Validation des dimensions (Étape 1)');
    console.log('   ✅ Validation email (Étape 2)');
    console.log('   ✅ Validation adresse (Étape 3)');
    console.log('   ✅ Validation pays international (Étape 3)');
    console.log('   ✅ Validation service (Étape 4)');
    console.log('   ✅ Validation assurance (Étape 4)');
    console.log('   ✅ Validation calcul prix (Étape 4)');
    console.log('   ✅ Validation paiement améliorée (Étape 5)');
    console.log('   ✅ Messages d\'erreur contextuels');
    console.log('   ✅ Validation en temps réel');
    
    console.log('\n🎯 Le système est maintenant robuste et cohérent !');
    
  } catch (error) {
    console.error('❌ Erreur lors des corrections:', error);
    process.exit(1);
  }
}

main(); 