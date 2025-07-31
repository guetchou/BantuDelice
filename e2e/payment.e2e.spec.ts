import { test, expect } from '@playwright/test';

test('Paiement MTN mock E2E', async ({ page }) => {
  // 1. Accéder à la page de paiement
  await page.goto('http://localhost:9595/colis/national');

  // 2. Remplir le formulaire (adapte les selectors selon ton HTML)
  await page.fill('input[name="sender_name"]', 'Test User');
  await page.fill('input[name="sender_phone"]', '0600000000');
  await page.fill('input[name="sender_address"]', 'Test Address');
  await page.fill('input[name="sender_city"]', 'Brazzaville');
  await page.fill('input[name="recipient_name"]', 'Destinataire');
  await page.fill('input[name="recipient_phone"]', '0600000001');
  await page.fill('input[name="recipient_address"]', 'Adresse Destinataire');
  await page.fill('input[name="recipient_city"]', 'Pointe-Noire');
  await page.selectOption('select[name="package_type"]', 'SMALL_PACKAGE');
  await page.fill('input[name="package_description"]', 'Test colis MTN');
  await page.fill('input[name="weight_kg"]', '1');
  await page.fill('input[name="length_cm"]', '10');
  await page.fill('input[name="width_cm"]', '10');
  await page.fill('input[name="height_cm"]', '10');
  await page.selectOption('select[name="delivery_speed"]', 'STANDARD');
  await page.check('input[name="requires_signature"]');
  await page.uncheck('input[name="is_fragile"]');
  await page.uncheck('input[name="is_insured"]');
  await page.selectOption('select[name="partner"]', 'congo_express');
  await page.selectOption('select[name="paymentMethod"]', 'mtn');

  // 3. Soumettre le formulaire
  await page.click('button[type="submit"]');

  // 4. Vérifier le message de confirmation ou le statut attendu
  await expect(page.locator('text=Vérification du paiement en cours')).toBeVisible({ timeout: 10000 });
  // Optionnel : attendre la confirmation finale
  // await expect(page.locator('text=Paiement confirmé')).toBeVisible({ timeout: 20000 });
}); 