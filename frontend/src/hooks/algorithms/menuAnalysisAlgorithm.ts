
/**
 * Menu analysis algorithm entry point
 * This file re-exports functionality from more specialized modules
 */

import { MenuItem } from '@/types/menu';
import { MenuAnalysisResult, MenuAnalysisOptions } from './menuAnalysis/types';
import analyzer from './menuAnalysis/analyzer';

export type { MenuAnalysisResult, MenuAnalysisOptions };

/**
 * Analyse un menu et génère des statistiques et des suggestions
 * @param items Éléments du menu à analyser
 * @returns Résultat de l'analyse avec statistiques et suggestions
 */
export const analyzeMenu = analyzer.analyzeMenu;
