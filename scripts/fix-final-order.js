#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const filePath = 'frontend/src/pages/colis/ColisExpeditionModernFixed.tsx';

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Supprimer la définition actuelle de handleCityChange
  const handleCityChangePattern = /\/\/ Fonction pour réinitialiser l'agence quand la ville change\s+const handleCityChange = \(city: string, isSender: boolean = true\) => \{[\s\S]*?\};/;
  content = content.replace(handleCityChangePattern, '');
  
  // 2. Ajouter handleCityChange après updateNestedField
  const updateNestedFieldPattern = /const updateNestedField = \(parent: string, field: string, value: unknown\) => \{[\s\S]*?\};/;
  const updateNestedFieldReplacement = `const updateNestedField = (parent: string, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent as keyof ExpeditionData], [field]: value }
    }));
  };

  // Fonction pour réinitialiser l'agence quand la ville change
  const handleCityChange = (city: string, isSender: boolean = true) => {
    if (isSender) {
      updateNestedField('sender', 'city', city);
      updateNestedField('sender', 'agency', ''); // Réinitialiser l'agence
    } else {
      updateNestedField('recipient', 'city', city);
      updateNestedField('recipient', 'agency', ''); // Réinitialiser l'agence
    }
  };`;
  
  content = content.replace(updateNestedFieldPattern, updateNestedFieldReplacement);
  
  // 3. Corriger l'expression régulière pour le téléphone
  const phoneRegexPattern = /const validatePhoneNumber = \(phone: string\): boolean => \{[\s\S]*?return \/.*\/\.test\(cleanPhone\);/;
  const phoneRegexReplacement = `const validatePhoneNumber = (phone: string): boolean => {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\\s/g, '');
    return /^(\\+242|242)?[0-9]{9}$/.test(cleanPhone);
  }`;
  
  content = content.replace(phoneRegexPattern, phoneRegexReplacement);
  
  // 4. Écrire le fichier corrigé
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Ordre des fonctions corrigé avec succès !');
  console.log('✅ Expression régulière du téléphone corrigée !');
  
} catch (error) {
  console.error('❌ Erreur lors de la correction:', error.message);
  process.exit(1);
} 