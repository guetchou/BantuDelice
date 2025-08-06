import React, { useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';

const AccessibilityShortcuts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toggleHighContrast, toggleReducedMotion, setFocus, isHighContrast, isReducedMotion } = useAccessibility();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Bouton principal flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full shadow-lg backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        aria-label="Raccourcis d'accessibilité"
        title="Raccourcis d'accessibilité"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </button>

      {/* Panneau des raccourcis */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl p-4 w-64 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Accessibilité</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Actions rapides */}
          <div className="space-y-2 mb-4">
            <button
              onClick={() => {
                setFocus('main-content');
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between p-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <span>Aller au contenu</span>
              <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Alt + S</kbd>
            </button>
            
            <button
              onClick={() => {
                toggleHighContrast();
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2 text-sm rounded-lg transition-colors ${
                isHighContrast 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'text-gray-700 hover:bg-orange-50'
              }`}
            >
              <span>Contraste élevé</span>
              <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Alt + H</kbd>
            </button>
            
            <button
              onClick={() => {
                toggleReducedMotion();
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2 text-sm rounded-lg transition-colors ${
                isReducedMotion 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-700 hover:bg-green-50'
              }`}
            >
              <span>Réduction mouvement</span>
              <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Alt + M</kbd>
            </button>
          </div>

          {/* Indicateurs d'état */}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>État actuel:</span>
              <div className="flex gap-1">
                {isHighContrast && (
                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                    Contraste
                  </span>
                )}
                {isReducedMotion && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    Mouvement
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityShortcuts; 