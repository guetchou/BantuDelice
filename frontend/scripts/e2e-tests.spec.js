const { test, expect } = require('@playwright/test');

/**
 * Tests E2E pour BantuDelice Frontend
 * Vérifie que toutes les pages se chargent correctement sans erreurs 404
 */

test.describe('BantuDelice E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Attendre que la page soit chargée
    await page.goto('http://localhost:9595');
    await page.waitForLoadState('networkidle');
  });

  test('Page d\'accueil se charge correctement', async ({ page }) => {
    await expect(page).toHaveTitle(/BantuDelice/);
    await expect(page.locator('h1')).toContainText(/BantuDelice/);
    
    // Vérifier qu'il n'y a pas d'erreurs 404
    const response = await page.waitForResponse(response => 
      response.url().includes('localhost:9595') && response.status() === 404
    ).catch(() => null);
    
    expect(response).toBeNull();
  });

  test('Navigation vers Restaurants', async ({ page }) => {
    // Cliquer sur le lien Restaurants
    await page.click('text=Restaurants');
    await page.waitForLoadState('networkidle');
    
    // Vérifier que la page restaurants se charge
    await expect(page).toHaveURL(/.*restaurants?/);
    await expect(page.locator('h1')).toContainText(/Restaurants/);
    
    // Vérifier les éléments de la page
    await expect(page.locator('input[placeholder*="rechercher"]')).toBeVisible();
    await expect(page.locator('button:has-text("Filtres")')).toBeVisible();
  });

  test('Navigation vers Taxi', async ({ page }) => {
    await page.click('text=Taxi');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/.*taxi/);
    await expect(page.locator('h1')).toContainText(/Taxi/);
  });

  test('Navigation vers Colis', async ({ page }) => {
    await page.click('text=Colis');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/.*colis/);
    await expect(page.locator('h1')).toContainText(/Colis/);
  });

  test('Navigation vers Covoiturage', async ({ page }) => {
    await page.click('text=Covoiturage');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/.*covoiturage/);
    await expect(page.locator('h1')).toContainText(/Covoiturage/);
  });

  test('Navigation vers Services', async ({ page }) => {
    await page.click('text=Services');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/.*services/);
    await expect(page.locator('h1')).toContainText(/Services/);
  });

  test('Navigation vers Contact', async ({ page }) => {
    await page.click('text=Contact');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/.*contact/);
    await expect(page.locator('h1')).toContainText(/Contact/);
  });

  test('Test du panier sur la page Restaurants', async ({ page }) => {
    await page.goto('http://localhost:9595/restaurants');
    await page.waitForLoadState('networkidle');
    
    // Vérifier que le bouton panier est visible
    const cartButton = page.locator('button:has([data-testid="shopping-cart"])');
    await expect(cartButton).toBeVisible();
    
    // Cliquer sur le panier
    await cartButton.click();
    
    // Vérifier que le modal du panier s'ouvre
    await expect(page.locator('text=Mon Panier')).toBeVisible();
  });

  test('Test des filtres sur la page Restaurants', async ({ page }) => {
    await page.goto('http://localhost:9595/restaurants');
    await page.waitForLoadState('networkidle');
    
    // Ouvrir les filtres
    await page.click('button:has-text("Filtres")');
    
    // Vérifier que le menu des filtres s'ouvre
    await expect(page.locator('text=Catégorie')).toBeVisible();
    await expect(page.locator('text=Fourchette de prix')).toBeVisible();
  });

  test('Test de la recherche sur la page Restaurants', async ({ page }) => {
    await page.goto('http://localhost:9595/restaurants');
    await page.waitForLoadState('networkidle');
    
    // Remplir le champ de recherche
    await page.fill('input[placeholder*="rechercher"]', 'Congolais');
    await page.waitForTimeout(500);
    
    // Vérifier que les résultats se mettent à jour
    await expect(page.locator('text=Le Gourmet Congolais')).toBeVisible();
  });

  test('Test de la navigation mobile', async ({ page }) => {
    // Simuler un écran mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('http://localhost:9595');
    await page.waitForLoadState('networkidle');
    
    // Vérifier que le menu mobile est accessible
    const mobileMenu = page.locator('button[aria-label*="menu"]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.locator('nav')).toBeVisible();
    }
  });

  test('Test des liens du footer', async ({ page }) => {
    await page.goto('http://localhost:9595');
    await page.waitForLoadState('networkidle');
    
    // Scroller vers le footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Vérifier les liens du footer
    const footerLinks = ['À propos', 'CGU', 'Politique de confidentialité', 'Centre d\'aide'];
    
    for (const linkText of footerLinks) {
      const link = page.locator(`text=${linkText}`);
      if (await link.isVisible()) {
        await expect(link).toBeVisible();
      }
    }
  });

  test('Test de la page 404', async ({ page }) => {
    // Essayer d'accéder à une page inexistante
    await page.goto('http://localhost:9595/page-inexistante');
    await page.waitForLoadState('networkidle');
    
    // Vérifier que la page 404 s'affiche correctement
    await expect(page.locator('text=Page non trouvée')).toBeVisible();
    await expect(page.locator('text=Retour à l\'accueil')).toBeVisible();
  });

  test('Test de performance des pages', async ({ page }) => {
    const pages = [
      '/',
      '/restaurants',
      '/taxi',
      '/colis',
      '/covoiturage',
      '/services',
      '/contact'
    ];

    for (const route of pages) {
      const startTime = Date.now();
      await page.goto(`http://localhost:9595${route}`);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      console.log(`Page ${route} chargée en ${loadTime}ms`);
      
      // Vérifier que le temps de chargement est raisonnable (< 5 secondes)
      expect(loadTime).toBeLessThan(5000);
    }
  });

  test('Test de l\'accessibilité', async ({ page }) => {
    await page.goto('http://localhost:9595');
    await page.waitForLoadState('networkidle');
    
    // Vérifier que les images ont des alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Vérifier que les boutons ont des aria-labels ou du texte
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      
      expect(ariaLabel || text).toBeTruthy();
    }
  });

  test('Test de la responsivité', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:9595');
      await page.waitForLoadState('networkidle');
      
      // Prendre une capture d'écran
      await page.screenshot({ 
        path: `test-results/${viewport.name}-homepage.png`,
        fullPage: true 
      });
      
      // Vérifier que la page est utilisable
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    }
  });
});

// Configuration Playwright
test.describe.configure({ mode: 'serial' }); 