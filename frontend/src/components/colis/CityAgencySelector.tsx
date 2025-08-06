import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CityAgencySelectorProps {
  cities: string[];
  selectedCity: string;
  selectedAgency: string;
  onCityChange: (city: string) => void;
  onAgencyChange: (agency: string) => void;
  cityLabel: string;
  agencyLabel: string;
  isRequired?: boolean;
  showDeliveryOptions?: boolean;
}

// Configuration des agences par ville
const AGENCIES_BY_CITY = {
  "Brazzaville": [
    {
      "id": "agence_brazzaville_centre",
      "name": "Agence Brazzaville Centre",
      "address": "Centre-ville, Brazzaville"
    },
    {
      "id": "agence_brazzaville_aeroport",
      "name": "Agence Brazzaville Aéroport",
      "address": "Aéroport Maya-Maya, Brazzaville"
    },
    {
      "id": "agence_brazzaville_poto_poto",
      "name": "Agence Poto-Poto",
      "address": "Quartier Poto-Poto, Brazzaville"
    },
    {
      "id": "agence_brazzaville_bacongo",
      "name": "Agence Bacongo",
      "address": "Quartier Bacongo, Brazzaville"
    }
  ],
  "Pointe-Noire": [
    {
      "id": "agence_pointe_noire_centre",
      "name": "Agence Pointe-Noire Centre",
      "address": "Centre-ville, Pointe-Noire"
    },
    {
      "id": "agence_pointe_noire_port",
      "name": "Agence Pointe-Noire Port",
      "address": "Zone portuaire, Pointe-Noire"
    },
    {
      "id": "agence_pointe_noire_aeroport",
      "name": "Agence Pointe-Noire Aéroport",
      "address": "Aéroport Agostinho-Neto, Pointe-Noire"
    },
    {
      "id": "agence_pointe_noire_loandjili",
      "name": "Agence Loandjili",
      "address": "Quartier Loandjili, Pointe-Noire"
    }
  ],
  "Dolisie": [
    {
      "id": "agence_dolisie_centre",
      "name": "Agence Dolisie Centre",
      "address": "Centre-ville, Dolisie"
    },
    {
      "id": "agence_dolisie_gare",
      "name": "Agence Dolisie Gare",
      "address": "Gare ferroviaire, Dolisie"
    }
  ],
  "Nkayi": [
    {
      "id": "agence_nkayi_centre",
      "name": "Agence Nkayi Centre",
      "address": "Centre-ville, Nkayi"
    },
    {
      "id": "agence_nkayi_marché",
      "name": "Agence Nkayi Marché",
      "address": "Marché central, Nkayi"
    }
  ],
  "Ouesso": [
    {
      "id": "agence_ouesso_centre",
      "name": "Agence Ouesso Centre",
      "address": "Centre-ville, Ouesso"
    },
    {
      "id": "agence_ouesso_aeroport",
      "name": "Agence Ouesso Aéroport",
      "address": "Aéroport local, Ouesso"
    }
  ],
  "Impfondo": [
    {
      "id": "agence_impfondo_centre",
      "name": "Agence Impfondo Centre",
      "address": "Centre-ville, Impfondo"
    },
    {
      "id": "agence_impfondo_port",
      "name": "Agence Impfondo Port",
      "address": "Port fluvial, Impfondo"
    }
  ],
  "Gamboma": [
    {
      "id": "agence_gamboma_centre",
      "name": "Agence Gamboma Centre",
      "address": "Centre-ville, Gamboma"
    }
  ],
  "Madingou": [
    {
      "id": "agence_madingou_centre",
      "name": "Agence Madingou Centre",
      "address": "Centre-ville, Madingou"
    }
  ],
  "Mossendjo": [
    {
      "id": "agence_mossendjo_centre",
      "name": "Agence Mossendjo Centre",
      "address": "Centre-ville, Mossendjo"
    }
  ],
  "Kinkala": [
    {
      "id": "agence_kinkala_centre",
      "name": "Agence Kinkala Centre",
      "address": "Centre-ville, Kinkala"
    }
  ]
};

export const CityAgencySelector: React.FC<CityAgencySelectorProps> = ({
  cities,
  selectedCity,
  selectedAgency,
  onCityChange,
  onAgencyChange,
  cityLabel,
  agencyLabel,
  isRequired = false,
  showDeliveryOptions = false
}) => {
  const getAgenciesForCity = (city: string) => {
    return AGENCIES_BY_CITY[city] || [];
  };

  const handleCityChange = (city: string) => {
    onCityChange(city);
    onAgencyChange(''); // Réinitialiser l'agence
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="city">
          {cityLabel} {isRequired && '*'}
        </Label>
        <Select value={selectedCity} onValueChange={handleCityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une ville" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCity && (
        <div>
          <Label htmlFor="agency">
            {agencyLabel} {isRequired && '*'}
          </Label>
          <Select value={selectedAgency} onValueChange={onAgencyChange}>
            <SelectTrigger>
              <SelectValue placeholder={isRequired ? "Sélectionnez une agence" : "Sélectionnez une agence (optionnel)"} />
            </SelectTrigger>
            <SelectContent>
              {getAgenciesForCity(selectedCity).map((agency) => (
                <SelectItem key={agency.id} value={agency.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{agency.name}</span>
                    <span className="text-xs text-gray-500">{agency.address}</span>
                  </div>
                </SelectItem>
              ))}
              
              {showDeliveryOptions ? (
                <>
                  <SelectItem value="livraison_domicile">
                    <div className="flex flex-col">
                      <span className="font-medium">Livraison à domicile</span>
                      <span className="text-xs text-gray-500">Livraison à l'adresse indiquée</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="point_relais">
                    <div className="flex flex-col">
                      <span className="font-medium">Point Relais</span>
                      <span className="text-xs text-gray-500">Retrait en point relais</span>
                    </div>
                  </SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="ramassage_domicile">
                    <div className="flex flex-col">
                      <span className="font-medium">Ramassage à domicile</span>
                      <span className="text-xs text-gray-500">Service de collecte à domicile</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="point_relais">
                    <div className="flex flex-col">
                      <span className="font-medium">Point Relais</span>
                      <span className="text-xs text-gray-500">Point de dépôt partenaire</span>
                    </div>
                  </SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          
          {selectedAgency && (
            <p className="text-sm text-gray-600 mt-1">
              {selectedAgency === 'ramassage_domicile' 
                ? 'Un agent viendra récupérer votre colis à l'adresse indiquée'
                : selectedAgency === 'livraison_domicile'
                ? 'Le colis sera livré à l'adresse indiquée'
                : selectedAgency === 'point_relais'
                ? showDeliveryOptions 
                  ? 'Le colis sera disponible en point relais'
                  : 'Déposez votre colis dans un point relais partenaire'
                : 'Déposez votre colis dans cette agence'
              }
            </p>
          )}
        </div>
      )}
    </div>
  );
};
