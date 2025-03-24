import { test, expect } from '@playwright/test';

test('should login successfully with valid credentials', async ({ page }) => {
  // Nyisd meg az alkalmazás bejelentkezési oldalát
  await page.goto('http://localhost:5173/login'); // Itt használd a megfelelő URL-t

  // Írj be érvényes e-mail címet és jelszót
  await page.fill('#email', 'p@g.c');
  await page.fill('#password', 'Jelszo123');

  // Kattints a "Bejelentkezés" gombra
  await page.click('.login-button');

  // Várj, hogy a navigálás megtörténjen (pl. a főoldalra)
  await expect(page).toHaveURL('http://localhost:5173'); // A várható URL a sikeres bejelentkezés után

  // Ellenőrizd, hogy a localStorage-ba elmentette az authData-t
  const authData = await page.evaluate(() => localStorage.getItem('authData'));
  expect(authData).not.toBeNull(); // Ellenőrizd, hogy az authData nem null
});

test('should show error message for invalid credentials', async ({ page }) => {
  // Nyisd meg az alkalmazás bejelentkezési oldalát
  await page.goto('http://localhost:5173/login');

  // Írj be érvénytelen e-mail címet és jelszót
  await page.fill('#email', 'invalid.email@example.com');
  await page.fill('#password', 'invalidPassword123');

  // Kattints a "Bejelentkezés" gombra
  await page.click('.login-button');

  // Ellenőrizd, hogy a hibaüzenet megjelenik
  const errorMessage = await page.locator('.error-message');
  await expect(errorMessage).toHaveText('A felhasználó nem található.'); // Hibaüzenet szöveg ellenőrzése
});
