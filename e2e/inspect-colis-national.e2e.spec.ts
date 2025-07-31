import { test } from '@playwright/test';
import fs from 'fs';

test('Inspecter les inputs et screenshot /colis/national', async ({ page }) => {
  await page.goto('http://localhost:9595/colis/national');
  // Attendre que la page soit chargée
  await page.waitForTimeout(3000);

  // Lister tous les inputs
  const inputs = await page.$$eval('input', els => els.map(el => ({
    name: el.getAttribute('name'),
    id: el.getAttribute('id'),
    type: el.getAttribute('type'),
    placeholder: el.getAttribute('placeholder'),
    outerHTML: el.outerHTML
  })));
  fs.writeFileSync('inputs-colis-national.json', JSON.stringify(inputs, null, 2));

  // Screenshot
  await page.screenshot({ path: 'colis-national.png', fullPage: true });
}); 