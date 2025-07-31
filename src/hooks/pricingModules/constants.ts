
// Tarifs de base par type de véhicule (en FCFA)
export const BASE_PRICES = {
  standard: 500,
  comfort: 800,
  premium: 1200,
  van: 1500
};

// Tarifs par kilomètre (en FCFA)
export const PRICE_PER_KM = {
  standard: 150,
  comfort: 200,
  premium: 300,
  van: 350
};

// Tarifs par minute (en FCFA)
export const PRICE_PER_MINUTE = {
  standard: 10,
  comfort: 15,
  premium: 25,
  van: 30
};

// Multiplicateurs selon l'heure
export const TIME_MULTIPLIERS = {
  // 00h-05h (nuit)
  night: 1.2,
  // 05h-07h et 19h-22h (heures de pointe)
  peak: 1.15,
  // 07h-19h (journée standard)
  standard: 1.0,
  // 22h-00h (heures creuses)
  offPeak: 0.9
};

// Multiplicateurs selon la demande
export const DEMAND_LEVELS = {
  veryLow: 0.8,
  low: 0.9,
  normal: 1.0,
  high: 1.2,
  veryHigh: 1.5
};

// Multiplicateurs selon le trafic
export const TRAFFIC_LEVELS = {
  light: 1.0,
  moderate: 1.1,
  heavy: 1.25,
  severe: 1.4
};

// Réductions pour les courses partagées
export const SHARED_RIDE_DISCOUNT = 0.25; // 25% de réduction

// Codes promotionnels valides
export const VALID_PROMO_CODES: Record<string, number> = {
  'BIENVENUE': 0.2, // 20% de réduction
  'WEEKEND': 0.15, // 15% de réduction
  'FIDELE': 0.1, // 10% de réduction
  'BUSINESS': 0.25 // 25% de réduction
};

// Réduction par niveau de fidélité
export const LOYALTY_DISCOUNTS = {
  0: 0, // Niveau 0 - Pas de réduction
  1: 0.05, // Niveau 1 - 5% de réduction
  2: 0.1, // Niveau 2 - 10% de réduction
  3: 0.15 // Niveau 3 - 15% de réduction
};

// Devise par défaut
export const DEFAULT_CURRENCY = 'FCFA';

// Zones de la ville et leurs coefficients
export const CITY_ZONES = {
  center: 1.0,
  north: 0.9,
  south: 0.95,
  east: 0.9,
  west: 0.95,
  airport: 1.2
};
