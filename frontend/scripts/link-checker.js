#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Vérificateur de liens pour BantuDelice Frontend
 * Vérifie tous les liens internes et externes pour éviter les erreurs 404
 */

class LinkChecker {
  constructor() {
    this.baseUrl = 'http://localhost:9595';
    this.internalLinks = new Set();
    this.externalLinks = new Set();
    this.brokenLinks = [];
    this.checkedLinks = new Set();
    this.routes = [];
  }

  // Extraire les routes depuis mainRoutes.tsx
  extractRoutes() {
    try {
      const routesFile = path.join(__dirname, '../src/routes/mainRoutes.tsx');
      const content = fs.readFileSync(routesFile, 'utf8');
      
      // Extraire les routes avec regex
      const routeMatches = content.match(/path:\s*["']([^"']+)["']/g);
      if (routeMatches) {
        this.routes = routeMatches.map(match => {
          const route = match.match(/path:\s*["']([^"']+)["']/)[1];
          return route === '' ? '/' : `/${route}`;
        });
      }
      
      console.log(`📋 ${this.routes.length} routes extraites`);
      return this.routes;
    } catch (error) {
      console.error('❌ Erreur lors de l\'extraction des routes:', error.message);
      return [];
    }
  }

  // Extraire les liens depuis les fichiers React/TypeScript
  extractLinksFromFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const links = new Set();

      // Liens React Router (to="/path")
      const reactRouterMatches = content.match(/to=["']([^"']+)["']/g);
      if (reactRouterMatches) {
        reactRouterMatches.forEach(match => {
          const link = match.match(/to=["']([^"']+)["']/)[1];
          if (link && !link.startsWith('http') && !link.startsWith('mailto:')) {
            links.add(link);
          }
        });
      }

      // Liens href dans les balises <a>
      const hrefMatches = content.match(/href=["']([^"']+)["']/g);
      if (hrefMatches) {
        hrefMatches.forEach(match => {
          const link = match.match(/href=["']([^"']+)["']/)[1];
          if (link && !link.startsWith('http') && !link.startsWith('mailto:')) {
            links.add(link);
          }
        });
      }

      // Liens dans navigate()
      const navigateMatches = content.match(/navigate\(["']([^"']+)["']\)/g);
      if (navigateMatches) {
        navigateMatches.forEach(match => {
          const link = match.match(/navigate\(["']([^"']+)["']\)/)[1];
          if (link && !link.startsWith('http')) {
            links.add(link);
          }
        });
      }

      return Array.from(links);
    } catch (error) {
      return [];
    }
  }

  // Scanner récursivement tous les fichiers
  scanFiles(dir = path.join(__dirname, '../src')) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        this.scanFiles(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
        const links = this.extractLinksFromFile(filePath);
        links.forEach(link => {
          if (link.startsWith('/')) {
            this.internalLinks.add(link);
          } else if (link.startsWith('http')) {
            this.externalLinks.add(link);
          }
        });
      }
    });
  }

  // Vérifier si le serveur fonctionne
  async checkServer() {
    try {
      const response = await fetch(this.baseUrl);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Vérifier un lien interne
  async checkInternalLink(link) {
    if (this.checkedLinks.has(link)) return;
    this.checkedLinks.add(link);

    try {
      const url = `${this.baseUrl}${link}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        this.brokenLinks.push({
          url,
          status: response.status,
          type: 'internal'
        });
        console.log(`❌ Lien cassé: ${url} (${response.status})`);
      } else {
        console.log(`✅ Lien OK: ${url}`);
      }
    } catch (error) {
      this.brokenLinks.push({
        url: `${this.baseUrl}${link}`,
        status: 'ERROR',
        type: 'internal',
        error: error.message
      });
      console.log(`❌ Erreur: ${this.baseUrl}${link} - ${error.message}`);
    }
  }

  // Vérifier un lien externe
  async checkExternalLink(link) {
    if (this.checkedLinks.has(link)) return;
    this.checkedLinks.add(link);

    try {
      const response = await fetch(link);
      
      if (!response.ok) {
        this.brokenLinks.push({
          url: link,
          status: response.status,
          type: 'external'
        });
        console.log(`❌ Lien externe cassé: ${link} (${response.status})`);
      } else {
        console.log(`✅ Lien externe OK: ${link}`);
      }
    } catch (error) {
      this.brokenLinks.push({
        url: link,
        status: 'ERROR',
        type: 'external',
        error: error.message
      });
      console.log(`❌ Erreur externe: ${link} - ${error.message}`);
    }
  }

  // Vérifier toutes les routes
  async checkRoutes() {
    console.log('\n🔍 Vérification des routes...');
    
    for (const route of this.routes) {
      await this.checkInternalLink(route);
      // Pause pour éviter de surcharger le serveur
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Vérifier tous les liens internes
  async checkInternalLinks() {
    console.log('\n🔍 Vérification des liens internes...');
    
    for (const link of this.internalLinks) {
      await this.checkInternalLink(link);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Vérifier tous les liens externes
  async checkExternalLinks() {
    console.log('\n🔍 Vérification des liens externes...');
    
    for (const link of this.externalLinks) {
      await this.checkExternalLink(link);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Générer le rapport
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalRoutes: this.routes.length,
        totalInternalLinks: this.internalLinks.size,
        totalExternalLinks: this.externalLinks.size,
        brokenLinks: this.brokenLinks.length,
        checkedLinks: this.checkedLinks.size
      },
      routes: this.routes,
      internalLinks: Array.from(this.internalLinks),
      externalLinks: Array.from(this.externalLinks),
      brokenLinks: this.brokenLinks
    };

    const reportPath = path.join(__dirname, '../link-check-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📊 RAPPORT DE VÉRIFICATION DES LIENS');
    console.log('=====================================');
    console.log(`📋 Routes totales: ${report.summary.totalRoutes}`);
    console.log(`🔗 Liens internes: ${report.summary.totalInternalLinks}`);
    console.log(`🌐 Liens externes: ${report.summary.totalExternalLinks}`);
    console.log(`✅ Liens vérifiés: ${report.summary.checkedLinks}`);
    console.log(`❌ Liens cassés: ${report.summary.brokenLinks}`);
    
    if (this.brokenLinks.length > 0) {
      console.log('\n🚨 LIENS CASSÉS DÉTECTÉS:');
      this.brokenLinks.forEach(link => {
        console.log(`  - ${link.url} (${link.status})`);
      });
    } else {
      console.log('\n✅ Aucun lien cassé détecté !');
    }
    
    console.log(`\n📄 Rapport complet sauvegardé: ${reportPath}`);
    return report;
  }

  // Méthode principale
  async run() {
    console.log('🔍 Vérificateur de liens BantuDelice');
    console.log('=====================================');
    
    // Vérifier si le serveur fonctionne
    console.log('🔌 Vérification du serveur...');
    const serverOk = await this.checkServer();
    if (!serverOk) {
      console.error('❌ Serveur non accessible. Assurez-vous que le serveur de développement fonctionne sur http://localhost:9595');
      process.exit(1);
    }
    console.log('✅ Serveur accessible');
    
    // Extraire les routes
    console.log('\n📋 Extraction des routes...');
    this.extractRoutes();
    
    // Scanner les fichiers
    console.log('\n📁 Scan des fichiers...');
    this.scanFiles();
    console.log(`📄 ${this.internalLinks.size} liens internes trouvés`);
    console.log(`🌐 ${this.externalLinks.size} liens externes trouvés`);
    
    // Vérifier les routes
    await this.checkRoutes();
    
    // Vérifier les liens internes
    await this.checkInternalLinks();
    
    // Vérifier les liens externes
    await this.checkExternalLinks();
    
    // Générer le rapport
    this.generateReport();
  }
}

// Exécuter le vérificateur
const checker = new LinkChecker();
checker.run().catch(console.error); 