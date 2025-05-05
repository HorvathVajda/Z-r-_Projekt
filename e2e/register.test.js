import { test, expect } from '@playwright/test';

function generateRandomUser() {
  const randomId = Math.floor(Math.random() * 100000);
  return {
    name: `Test User ${randomId}`,
    email: `test${randomId}@example.com`,
    password: `Password123`,
    confirmPassword: `Password123`,
    phone: `+36301234567`,
    taxNumber: `12345678-${randomId % 100}-01` // vagy valami érvényes formátum
  };
}

test('Sikeres vállalkozói regisztráció', async ({ page }) => {
  const user = generateRandomUser();

  await page.goto('http://localhost:5173/vallalkozoRegister');
  await page.waitForSelector('form');

  await page.fill('#name', user.name);
  await page.fill('#email', user.email);
  await page.fill('#password', user.password);
  await page.fill('#confirmPassword', user.password);
  await page.fill('#phone', user.phone);
  await page.fill('#adoszam', user.taxNumber);

  await page.check('#terms');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/login', { timeout: 5000 });
  expect(page.url()).toContain('/login');
});

test('Sikeres felhasználói regisztráció', async ({ page }) => {
  const user = generateRandomUser();

  await page.goto('http://localhost:5173/register');
  await page.waitForSelector('form');

  await page.fill('#name', user.name);
  await page.fill('#email', user.email);
  await page.fill('#password', user.password);
  await page.fill('#confirmPassword', user.password);
  await page.fill('#phone', user.phone);

  await page.check('#terms');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/login', { timeout: 5000 });
  expect(page.url()).toContain('/login');
});
