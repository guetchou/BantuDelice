#!/usr/bin/env node

/**
 * Script d'optimisation des images pour BantuDelice
 * 
 * Usage:
 * npm run optimize-images
 * 
 * Dépendances requises:
 * npm install sharp imagemin imagemin-webp imagemin-mozjpeg
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '../frontend/public/images');
const HERO_IMAGE_NAME = 'hero-bg.jpg';

async function optimizeHeroImage() {
  console.log('🎨 Optimisation des images hero...');
  
  const heroImagePath = path.join(IMAGES_DIR, HERO_IMAGE_NAME);
  
  if (!fs.existsSync(heroImagePath)) {
    console.log('⚠️  Image hero-bg.jpg non trouvée. Veuillez ajouter une image 1920x1080.');
    return;
  }

  try {
    // Créer les versions optimisées
    const versions = [
      {
        name: 'hero-bg.webp',
        format: 'webp',
        quality: 80,
        width: 1920,
        height: 1080
      },
      {
        name: 'hero-bg-mobile.jpg',
        format: 'jpeg',
        quality: 85,
        width: 768,
        height: 1024
      },
      {
        name: 'hero-bg-mobile.webp',
        format: 'webp',
        quality: 80,
        width: 768,
        height: 1024
      }
    ];

    for (const version of versions) {
      const outputPath = path.join(IMAGES_DIR, version.name);
      
      console.log(`📸 Création de ${version.name}...`);
      
      let pipeline = sharp(heroImagePath)
        .resize(version.width, version.height, {
          fit: 'cover',
          position: 'center'
        });

      if (version.format === 'webp') {
        pipeline = pipeline.webp({ quality: version.quality });
      } else {
        pipeline = pipeline.jpeg({ quality: version.quality });
      }

      await pipeline.toFile(outputPath);
      
      // Afficher la taille du fichier
      const stats = fs.statSync(outputPath);
      const fileSizeInKB = Math.round(stats.size / 1024);
      console.log(`✅ ${version.name} créé (${fileSizeInKB}KB)`);
    }

    console.log('🎉 Optimisation terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation:', error);
  }
}

async function checkImageSizes() {
  console.log('📊 Vérification des tailles d\'images...');
  
  const files = fs.readdirSync(IMAGES_DIR);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file) && 
    file.includes('hero')
  );

  for (const file of imageFiles) {
    const filePath = path.join(IMAGES_DIR, file);
    const stats = fs.statSync(filePath);
    const fileSizeInKB = Math.round(stats.size / 1024);
    
    console.log(`📁 ${file}: ${fileSizeInKB}KB`);
    
    if (fileSizeInKB > 500) {
      console.log(`⚠️  ${file} est trop lourd (${fileSizeInKB}KB > 500KB)`);
    }
  }
}

async function main() {
  console.log('🚀 Démarrage de l\'optimisation des images...\n');
  
  await optimizeHeroImage();
  console.log('');
  await checkImageSizes();
  
  console.log('\n📋 Prochaines étapes:');
  console.log('1. Vérifiez que les images sont bien créées dans /frontend/public/images/');
  console.log('2. Testez le rendu sur différents appareils');
  console.log('3. Vérifiez les métriques de performance avec Lighthouse');
}

// Exécuter le script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeHeroImage, checkImageSizes }; 