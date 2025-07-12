
/**
 * Main recommendation algorithm entry point
 * This file re-exports functionality from more specialized modules
 */

import { MenuItem } from '@/types/menu';
import recommendationEngine from './recommendationEngine';
import personalizedRecommendations from './personalizedRecommendations';

export const {
  calculateSimilarityScore,
  findRelatedItems
} = recommendationEngine;

/**
 * Recommande des plats similaires à un plat sélectionné
 * @param items Tous les éléments du menu disponibles
 * @param selectedItem L'élément sélectionné pour lequel chercher des similaires
 * @param count Nombre de recommandations à retourner
 * @returns Liste d'éléments de menu recommandés
 */
export const recommendRelatedItems = findRelatedItems;

/**
 * Génère des recommandations personnalisées basées sur l'historique d'un utilisateur
 * @param items Tous les éléments du menu disponibles
 * @param orderHistory Historique des commandes de l'utilisateur
 * @param count Nombre de recommandations à retourner
 */
export const generatePersonalizedRecommendations = personalizedRecommendations.generatePersonalizedRecommendations;
