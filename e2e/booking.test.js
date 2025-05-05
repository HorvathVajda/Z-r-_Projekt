import { test, expect } from '@playwright/test';

test('Foglalás sikeres végrehajtása', async ({ page }) => {
  await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });

  // Bejelentkezés
  await page.fill('input#email', 'as@g.c');
  await page.fill('input#password', 'Jelszo123');
  await page.click('button.login-button');
  await page.waitForNavigation({ waitUntil: 'networkidle' });

  // Kattints a menüben/linkben a foglalás oldalra
  await page.click('a[href="/foglalas"]');
  // Várj, amíg a kliens‑oldali átirányítás befejeződik
  await page.waitForSelector('.service-button');

  // További foglalási lépések
  await page.locator('.service-button').first().click();

  await page.waitForSelector('label:has-text("Szabad")');
  await page.locator('label:has-text("Szabad")').first().click();

  await page.waitForSelector('button.modal-button:not(:disabled)');
  await page.click('button.modal-button');

  const alertBox = page.locator('.alert-box');
  await expect(alertBox).toContainText('Sikeres foglalás!');
});
