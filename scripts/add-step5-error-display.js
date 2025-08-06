#!/usr/bin/env node

import fs from 'fs';

const filePath = 'frontend/src/pages/colis/ColisExpeditionModernFixed.tsx';

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Ajouter l'affichage des erreurs dans l'étape 5
  const step5ErrorDisplay = `
                        {/* Affichage des erreurs de validation */}
                        <AnimatePresence>
                          {stepErrors[5] && stepErrors[5].length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="space-y-2"
                            >
                              {stepErrors[5].map((error, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                  <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                  <span className="text-sm text-red-700">{error}</span>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="bg-blue-50 p-4 rounded-lg">`;
  
  // Remplacer la section des informations importantes
  const infoSectionRegex = /<div className="bg-blue-50 p-4 rounded-lg">/;
  content = content.replace(infoSectionRegex, step5ErrorDisplay);
  
  // Écrire le fichier modifié
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Affichage des erreurs ajouté à l\'étape 5 !');
  console.log('🔧 Modifications:');
  console.log('   - Affichage des erreurs de validation');
  console.log('   - Animation avec AnimatePresence');
  console.log('   - Style cohérent avec les autres étapes');
  
} catch (error) {
  console.error('❌ Erreur lors de l\'ajout:', error.message);
  process.exit(1);
} 