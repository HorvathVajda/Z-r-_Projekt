import { test, expect } from '@playwright/test';

test('Sikeres bejelentkezés helyes adatok megadásával', async ({ page }) => {
  // Nyisd meg az alkalmazás bejelentkezési oldalát
  await page.goto('http://localhost:5173/login');

  // Írj be érvényes e-mail címet és jelszót
  await page.fill('#email', 'teszt.elek@example.com');
  await page.fill('#password', 'Teszt1234');

  // Kattints a "Bejelentkezés" gombra
  await page.click('button.login-button span'); // Kattintás a gomb szövegére

  // Várj egy rövid ideig, hogy biztosan megtörténjen a navigálás
  await page.waitForTimeout(2000); // Várakozás 2 másodpercig (állítható szükség szerint)

  // Ellenőrizd, hogy a navigáció megtörtént és az oldal URL-je helyes
  await expect(page).toHaveURL('http://localhost:5173'); // Várható URL

  // Ellenőrizd, hogy a localStorage-ba elmentette az authData-t
  const authData = await page.evaluate(() => localStorage.getItem('authData'));
  expect(authData).not.toBeNull(); // Ellenőrizd, hogy az authData nem null
});

test('Sikertelen bejelentkezés helytelen adatok megadásával', async ({ page }) => {
  // Nyisd meg az alkalmazás bejelentkezési oldalát
  await page.goto('http://localhost:5173/login');

  // Írj be érvénytelen e-mail címet és jelszót
  await page.fill('#email', 'invalid.email@example.com');
  await page.fill('#password', 'invalidPassword123');

  // Kattints a "Bejelentkezés" gombra
  await page.click('button.login-button span');

  // Várj, hogy a hibaüzenet megjelenjen
  await expect(page.locator('.error-message')).toHaveText('A felhasználó nem található.');
});
