
import { PricingRates } from './types';

// Tarifs de base (en FCFA)
export const PRICING_RATES: PricingRates = {
  BASE_RATES: {
    standard: 500,
    comfort: 800,
    premium: 1200,
    van: 1500
  },
  DISTANCE_RATES: {
    standard: 100, // par km
    comfort: 150,
    premium: 200,
    van: 250
  },
  TIME_RATES: {
    standard: 50, // par minute
    comfort: 75,
    premium: 100,
    van: 125
  },
  // Tarifs pour les services spéciaux
  SPECIAL_RATES: {
    airport_fee: 1000,
    extra_waiting_time: 25, // par minute au-delà du temps d'attente standard
    extra_baggage: 500,
    premium_service: 1500,
    recurring_client_discount: 0.05, // 5% de réduction
    round_trip_discount: 0.10, // 10% de réduction
    express_lane_fee: 2000,
    long_distance_surcharge: 0.08, // 8% de supplément pour les longues distances (>25km)
    child_seat_fee: 800,
    pet_transport_fee: 1200,
    wheelchair_access_fee: 0, // Gratuit - service social
    vip_service_fee: 3500,
    destination_surcharge: {
      'Aéroport Maya-Maya': 1500,
      'Centre ville': 0,
      'Zone industrielle': 800,
      'Quartier de Bacongo': 500,
      'Quartier de Poto-Poto': 500
    }
  }
};

// Codes promo valides pour le système de test
export const VALID_PROMO_CODES: { [key: string]: number } = {
  'BIENVENUE': 15,
  'WEEKEND': 10,
  'FIDELE': 20,
  'AIRPORT': 25,
  'PREMIUM': 15,
  'FAMILY': 12,
  'SPECIAL': 30,
  'BUSINESS': 18,
  'EXPRESS': 10,
  'NIGHT': 15,
  'TOURISTIQUE': 20
};
