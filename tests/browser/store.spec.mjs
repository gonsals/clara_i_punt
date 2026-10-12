import { test, expect } from '@playwright/test';

test('homepage, responsive layout, navigation and empty cart', async ({ page }, info) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('El passatemps de la Clara');
  await page
    .locator('astro-island[component-export="default"]')
    .first()
    .evaluate(async (node) => {
      if (node.hasAttribute('ssr'))
        await new Promise((resolve) =>
          node.addEventListener('astro:hydrate', resolve, { once: true }),
        );
    });
  await expect(page.locator('.hero-product')).toHaveCount(3);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.locator('.collection-section').scrollIntoViewIfNeeded();
  for (const image of await page
    .locator('.collection-section .product-card-image > img:first-child')
    .all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((node) => node.complete && node.naturalWidth > 0))
      .toBe(true);
  }
  await page
    .locator('#peces-carousel')
    .evaluate((node) => node.scrollTo({ left: 0, behavior: 'instant' }));
  await expect
    .poll(() =>
      page
        .locator('.collection-section .product-card-image > img:first-child')
        .evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)),
    )
    .toBe(true);
  await page.locator('.craft-section').scrollIntoViewIfNeeded();
  await page.locator('.outfit-section').scrollIntoViewIfNeeded();
  await page.locator('.hero-heading').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `.qa/home-${info.project.name}.png`, fullPage: true });
  await page.getByRole('button', { name: /Obre la cistella/ }).click();
  await expect(page.getByRole('dialog', { name: /La teva cistella/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hi falta una mica de color.' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: /La teva cistella/ })).not.toBeVisible();
  if (info.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Obre el menú' }).click();
    await page
      .getByRole('navigation', { name: 'Menú mòbil' })
      .getByRole('link', { name: 'La col·lecció' })
      .click();
  } else
    await page
      .getByRole('navigation', { name: 'Navegació principal' })
      .getByRole('link', { name: 'La col·lecció' })
      .click();
  await expect(page).toHaveURL(/products/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ganxet per als');
  expect(errors).toEqual([]);
});

test('real catalogue, search, product gallery and persistent inquiry basket', async ({
  page,
  request,
}, info) => {
  const response = await request.get('/api/products');
  expect(response.ok()).toBe(true);
  const { products } = await response.json();
  const product = products.find((p) => p.canAdd && !p.preview);
  test.skip(!product, 'No active Airtable product available in this environment.');
  await page.goto('/products');
  const search = page.getByRole('searchbox', { name: 'Cerca una peça' });
  await search.fill('cap peça amb aquest nom 987654');
  await expect(
    page.getByRole('heading', { name: 'Encara no hem trobat aquesta peça.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Veure totes les peces' }).click();
  await expect(search).toHaveValue('');
  await search.fill(product.name);
  await page.getByRole('heading', { name: product.name, exact: true }).click();
  await expect(page).toHaveURL(`/product/${product.id}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(product.name);
  if (product.images.length > 1) {
    await page.getByRole('button', { name: 'Veure fotografia 2' }).click();
    await expect(page.locator('.gallery-main img')).toHaveAttribute('src', product.images[1].url);
  }
  await expect
    .poll(() =>
      page
        .locator('.gallery-main img')
        .evaluate((image) => image.complete && image.naturalWidth > 0),
    )
    .toBe(true);
  await page.screenshot({ path: `.qa/product-${info.project.name}.png`, fullPage: true });
  await page
    .locator('.product-detail-info')
    .getByRole('button', { name: 'Afegeix a la cistella', exact: true })
    .click();
  const drawer = page.getByRole('dialog', { name: /La teva cistella/ });
  await expect(drawer).toBeVisible();
  await expect(drawer.locator('.cart-line-name')).toHaveText(product.name);
  await drawer.getByRole('link', { name: 'Revisa les teves peces' }).click();
  await expect(page).toHaveURL('/checkout');
  await expect(page.getByRole('heading', { name: 'Les teves peces' })).toBeVisible();
  const email = page.getByRole('link', { name: 'Consulta les peces per correu' });
  await expect(email).toHaveAttribute('href', /^mailto:marcgonzaleztarrio@gmail.com/);
  await expect(page.getByText('No s’ha fet cap cobrament.', { exact: false })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Les teves peces' })).toBeVisible();
  await page.screenshot({ path: `.qa/checkout-${info.project.name}.png`, fullPage: true });
  await page.getByRole('button', { name: /Obre la cistella/ }).click();
  await page.getByRole('button', { name: `Elimina ${product.name}` }).click();
  await expect(page.getByRole('heading', { name: 'Hi falta una mica de color.' })).toBeVisible();
});

test('help, contact, privacy, real 404 and API origin protection', async ({ page, request }) => {
  for (const path of ['/la-clara', '/ajuda', '/contacte', '/privacitat']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
  const missing = await request.get('/product/nonexistent');
  expect(missing.status()).toBe(404);
  const forged = await request.post('/api/cart/validate', {
    headers: { Origin: 'https://wrong.example' },
    data: { items: [] },
  });
  expect(forged.status()).toBe(403);
  await page.goto('/contacte');
  await expect(page.getByRole('button', { name: 'Prepara el correu' })).toBeVisible();
});
