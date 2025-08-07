import { test, expect } from '@playwright/test';

test('creating a forum', async ({ page }) => {
  
  const forumTitle = `Teste Forum ${crypto.randomUUID()}`;

  await page.goto('http://localhost:3000/forum');

  await page.locator('.add-forum-btn').click();

  await page.getByPlaceholder('Digite o título do fórum').fill(forumTitle);
  await page.getByPlaceholder('Digite a descrição do fórum').fill('Teste');
  
  await page.selectOption('select[name="movieId"]', { index: 1 });
  
  await page.getByRole('button', { name: 'Criar Fórum' }).click();

  await expect(page.locator('a.forum-title-link').filter({ hasText: forumTitle })).toBeVisible();
});

test('Fail to create a forum without a title', async ({ page }) => {
  await page.goto('http://localhost:3000/forum');

  const dialogPromise = page.waitForEvent('dialog');
  
  await page.locator('.add-forum-btn').click();
  await page.getByPlaceholder('Digite a descrição do fórum').fill('Teste');
  await page.selectOption('select[name="movieId"]', { index: 1 });
  await page.getByRole('button', { name: 'Criar Fórum' }).click();

  const dialog = await dialogPromise;
  expect(dialog.type()).toBe('alert');
  expect(dialog.message()).toBe('O título do forum é obrigatório');
  await dialog.accept();
});

test('Fail to create a forum without a username', async ({ page }) => {
  sessionStorage.clear()

  await page.addInitScript(() => {
    sessionStorage.removeItem('username');
  });

  await page.goto('http://localhost:3000/forum');

  const dialogPromise = page.waitForEvent('dialog');

  await page.locator('.add-forum-btn').click();
  await page.getByPlaceholder('Digite o título do fórum').fill('Teste');
  await page.getByPlaceholder('Digite a descrição do fórum').fill('Teste');
  await page.selectOption('select[name="movieId"]', { index: 1 });
  await page.getByRole('button', { name: 'Criar Fórum' }).click();

  const dialog = await dialogPromise;
  expect(dialog.type()).toBe('alert');
  expect(dialog.message()).toBe('O usuário é um campo obrigatório');
  await dialog.accept();
});

test('Fail to create a forum without a movie', async ({ page }) => {
  await page.goto('http://localhost:3000/forum');

  const dialogPromise = page.waitForEvent('dialog');
    
  await page.locator('.add-forum-btn').click();
  await page.getByPlaceholder('Digite o título do fórum').fill('Teste');
  await page.getByPlaceholder('Digite a descrição do fórum').fill('Teste');
  await page.getByRole('button', { name: 'Criar Fórum' }).click();

  const dialog = await dialogPromise;
  expect(dialog.type()).toBe('alert');
  expect(dialog.message()).toBe('O usuário é um campo obrigatório');
  await dialog.accept();
});