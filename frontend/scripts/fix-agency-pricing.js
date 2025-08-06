#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Correction des problèmes d'agences et de tarification...');

// Configuration des agences par ville
const AGENCIES_BY_CITY = {
  "Brazzaville": [
    "agence_brazzaville_centre",
    "agence_brazzaville_aeroport",
    "agence_brazzaville_bacongo",
    "agence_brazzaville_poto_poto",
    "agence_brazzaville_moungali"
  ],
  "Pointe-Noire": [
    "agence_pointe_noire_centre",
    "agence_pointe_noire_port",
    "agence_pointe_noire_aeroport",
    "agence_pointe_noire_loandjili"
  ],
  "Dolisie": [
    "agence_dolisie_centre",
    "agence_dolisie_gare"
  ],
  "Nkayi": [
    "agence_nkayi_centre"
  ],
  "Ouesso": [
    "agence_ouesso_centre"
  ],
  "Impfondo": [
    "agence_impfondo_centre"
  ],
  "Gamboma": [
    "agence_gamboma_centre"
  ],
  "Madingou": [
    "agence_madingou_centre"
  ],
  "Mossendjo": [
    "agence_mossendjo_centre"
  ],
  "Kinkala": [
    "agence_kinkala_centre"
  ]
};

// Fonction pour corriger la sélection d'agences
function fixAgencySelection() {
  const expeditionFile = path.join(__dirname, '..', 'src/pages/colis/ColisExpeditionModernFixed.tsx');
  let content = fs.readFileSync(expeditionFile, 'utf8');
  
  // Créer la liste complète des agences
  const allAgencies = [];
  Object.entries(AGENCIES_BY_CITY).forEach(([city, agencies]) => {
    agencies.forEach(agency => {
      const label = agency.replace(/_/g, ' ').replace(/agence /, 'Agence ').replace(/\b\w/g, l => l.toUpperCase());
      allAgencies.push({ value: agency, label });
    });
  });
  
  // Ajouter les options spéciales
  allAgencies.push(
    { value: 'ramassage_domicile', label: 'Ramassage à domicile' },
    { value: 'point_relais', label: 'Point Relais' }
  );
  
  // Générer le nouveau contenu SelectContent
  const newSelectContent = `
                            <SelectContent>
                              {cities.map((city) => (
                                <React.Fragment key={city}>
                                  <SelectItem value="" disabled className="font-semibold text-gray-600">
                                    --- ${city} ---
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
                            </SelectContent>`;
  
  // Remplacer l'ancien SelectContent
  const oldSelectContentRegex = /<SelectContent>[sS]*?</SelectContent>/;
  content = content.replace(oldSelectContentRegex, newSelectContent);
  
  // Ajouter la fonction helper
  const helperFunction = `
  // Fonction helper pour obtenir les agences par ville
  const getAgenciesForCity = (city: string) => {
    const agenciesByCity = {"Brazzaville":["agence_brazzaville_centre","agence_brazzaville_aeroport","agence_brazzaville_bacongo","agence_brazzaville_poto_poto","agence_brazzaville_moungali"],"Pointe-Noire":["agence_pointe_noire_centre","agence_pointe_noire_port","agence_pointe_noire_aeroport","agence_pointe_noire_loandjili"],"Dolisie":["agence_dolisie_centre","agence_dolisie_gare"],"Nkayi":["agence_nkayi_centre"],"Ouesso":["agence_ouesso_centre"],"Impfondo":["agence_impfondo_centre"],"Gamboma":["agence_gamboma_centre"],"Madingou":["agence_madingou_centre"],"Mossendjo":["agence_mossendjo_centre"],"Kinkala":["agence_kinkala_centre"]};
    const agencies = agenciesByCity[city] || [];
    return agencies.map(agency => ({
      value: agency,
      label: agency.replace(/_/g, ' ').replace(/agence /, 'Agence ').replace(/\b\w/g, l => l.toUpperCase())
    }));
  };`;
  
  // Insérer la fonction helper
  const insertAfter = 'const ColisExpeditionModernFixed: React.FC = () => {';
  const insertIndex = content.indexOf(insertAfter) + insertAfter.length;
  content = content.slice(0, insertIndex) + '\n' + helperFunction + content.slice(insertIndex);
  
  fs.writeFileSync(expeditionFile, content, 'utf8');
  console.log('✅ Sélection d'agences corrigée');
}

// Fonction pour corriger la politique de tarification
function fixPricingPolicy() {
  const tarifServiceFile = path.join(__dirname, '..', 'src/services/tarifService.ts');
  let content = fs.readFileSync(tarifServiceFile, 'utf8');
  
  // Ajouter les villes manquantes dans les zones
  const pricingPolicy = {
  "urbain": {
    "name": "Zone Urbaine",
    "baseRate": 1500,
    "fuelSurcharge": 0.05,
    "insuranceIncluded": 25000,
    "cities": [
      "Brazzaville",
      "Pointe-Noire"
    ]
  },
  "axe-principal": {
    "name": "Axe Principal",
    "baseRate": 5000,
    "fuelSurcharge": 0.08,
    "insuranceIncluded": 50000,
    "cities": [
      "Brazzaville",
      "Pointe-Noire"
    ]
  },
  "secondaire": {
    "name": "Villes Secondaires",
    "baseRate": 3500,
    "fuelSurcharge": 0.1,
    "insuranceIncluded": 40000,
    "cities": [
      "Dolisie",
      "Nkayi",
      "Gamboma",
      "Madingou",
      "Mossendjo",
      "Kinkala"
    ]
  },
  "enclave": {
    "name": "Zones Enclavées",
    "baseRate": 4500,
    "fuelSurcharge": 0.15,
    "insuranceIncluded": 35000,
    "cities": [
      "Ouesso",
      "Impfondo"
    ]
  }
};
  
  // Mettre à jour les zones avec toutes les villes
  Object.entries(pricingPolicy).forEach(([zoneId, policy]) => {
    const zoneRegex = new RegExp(`(id: '${zoneId}',[\s\S]*?cities:\s*\[)[^\]]*(\])`, 'g');
    const citiesString = policy.cities.map(city => `'${city}'`).join(', ');
    content = content.replace(zoneRegex, `$1${citiesString}$2`);
  });
  
  fs.writeFileSync(tarifServiceFile, content, 'utf8');
  console.log('✅ Politique de tarification corrigée');
}

// Fonction pour ajouter la validation ville-agence
function addCityAgencyValidation() {
  const expeditionFile = path.join(__dirname, '..', 'src/pages/colis/ColisExpeditionModernFixed.tsx');
  let content = fs.readFileSync(expeditionFile, 'utf8');
  
  // Ajouter la validation
  const validationFunction = `
  // Validation ville-agence
  const validateCityAgency = (city: string, agency: string) => {
    const agenciesByCity = {"Brazzaville":["agence_brazzaville_centre","agence_brazzaville_aeroport","agence_brazzaville_bacongo","agence_brazzaville_poto_poto","agence_brazzaville_moungali"],"Pointe-Noire":["agence_pointe_noire_centre","agence_pointe_noire_port","agence_pointe_noire_aeroport","agence_pointe_noire_loandjili"],"Dolisie":["agence_dolisie_centre","agence_dolisie_gare"],"Nkayi":["agence_nkayi_centre"],"Ouesso":["agence_ouesso_centre"],"Impfondo":["agence_impfondo_centre"],"Gamboma":["agence_gamboma_centre"],"Madingou":["agence_madingou_centre"],"Mossendjo":["agence_mossendjo_centre"],"Kinkala":["agence_kinkala_centre"]};
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
  }, [formData.sender.city]);`;
  
  // Insérer la validation
  const insertAfter = 'const getAgenciesForCity = (city: string) => {';
  const insertIndex = content.indexOf(insertAfter) + insertAfter.length;
  const endOfFunction = content.indexOf('};', insertIndex) + 2;
  content = content.slice(0, endOfFunction) + '\n' + validationFunction + content.slice(endOfFunction);
  
  fs.writeFileSync(expeditionFile, content, 'utf8');
  console.log('✅ Validation ville-agence ajoutée');
}

// Exécuter les corrections
fixAgencySelection();
fixPricingPolicy();
addCityAgencyValidation();

console.log('\n✅ Corrections appliquées !');
console.log('\n📋 Prochaines étapes:');
console.log('1. Tester la sélection d'agences par ville');
console.log('2. Vérifier la cohérence tarifaire');
console.log('3. Valider la logique ville-agence');
