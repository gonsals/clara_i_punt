import { test, expect } from '@playwright/test';

test('Figma motion, carousel controls and reduced-motion preference', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-product')).toHaveCount(3);
  await expect(page.locator('.site-header')).toHaveCSS('background-color', 'rgb(0, 124, 198)');
  await expect(page.locator('.site-footer')).toHaveCSS('background-color', 'rgb(125, 47, 93)');
  await expect(page.locator('.marquee-sky .marquee-track')).toHaveCSS(
    'animation-direction',
    'normal',
  );
  await expect(page.locator('.marquee-mauve .marquee-track')).toHaveCSS(
    'animation-direction',
    'reverse',
  );
  const ribbon = page.locator('.marquee-sky .marquee-track');
  await page.locator('.marquee-sky').hover();
  await expect(ribbon).toHaveCSS('animation-play-state', 'running');
  const before = await ribbon.evaluate((node) => getComputedStyle(node).transform);
  await expect
    .poll(() => ribbon.evaluate((node) => getComputedStyle(node).transform))
    .not.toBe(before);
  await page.getByRole('button', { name: 'Pausa el moviment' }).click();
  await expect(ribbon).toHaveCSS('animation-play-state', 'paused');
  const paused = await ribbon.evaluate((node) => getComputedStyle(node).transform);
  await page.locator('.collection-section').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Peces següents', exact: true }).click();
  await expect
    .poll(() => page.locator('#peces-carousel').evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(200);
  await expect(ribbon).toHaveCSS('transform', paused);
  await page.getByRole('button', { name: 'Peces anteriors', exact: true }).click();
  await expect
    .poll(() => page.locator('#peces-carousel').evaluate((node) => node.scrollLeft))
    .toBeLessThan(2);
  await page.getByRole('button', { name: 'Reprèn el moviment' }).click();
  await expect(ribbon).toHaveCSS('animation-play-state', 'running');
  await page.evaluate(() => sessionStorage.removeItem('clara-motion-paused'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(ribbon).toHaveCSS('animation-name', 'none');
  await page.getByRole('button', { name: 'Reprèn el moviment' }).click();
  await expect(ribbon).toHaveCSS('animation-name', 'brand-marquee');
  await expect(ribbon).toHaveCSS('animation-play-state', 'running');
  const resumed = await ribbon.evaluate((node) => getComputedStyle(node).transform);
  await expect
    .poll(() => ribbon.evaluate((node) => getComputedStyle(node).transform))
    .not.toBe(resumed);
});

test('sample catalogue is visible but cannot be purchased', async ({ page, request }) => {
  const response = await request.get('/api/products');
  const { products } = await response.json();
  const samples = products.filter((product) => product.id.startsWith('mostra-'));
  expect(samples).toHaveLength(3);
  expect(samples.every((product) => product.preview && !product.canAdd && !product.available)).toBe(
    true,
  );
  await page.goto(`/product/${samples[0].id}`);
  await expect(page.getByText('Preu orientatiu · peça de mostra')).toBeVisible();
  await expect(
    page
      .locator('.product-detail-info')
      .getByRole('button', { name: 'Afegeix a la cistella', exact: true }),
  ).toHaveCount(0);
  const attempt = await request.post('/api/cart/validate', {
    headers: { Origin: 'http://127.0.0.1:4321' },
    data: { items: [{ id: samples[0].id, quantity: 1 }] },
  });
  expect(attempt.status()).toBe(400);
});

test('family story, announcements and category navigation', async ({ page }, info) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Missatge següent', exact: true }).click();
  await expect(page.locator('.announcement > span')).toHaveText(
    'Produït artesanalment a Puigcerdà',
  );
  if (info.project.name === 'mobile')
    await page.getByRole('button', { name: 'Obre el menú' }).click();
  const nav = page.getByRole('navigation', {
    name: info.project.name === 'mobile' ? 'Menú mòbil' : 'Navegació principal',
  });
  await nav.locator('summary').click();
  await nav.getByRole('link', { name: 'Complements', exact: true }).click();
  await expect(page).toHaveURL(/categoria=Complements/);
  await expect(page.getByRole('heading', { name: 'Necesser Flor', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bossa Cerdanya', exact: true })).toHaveCount(0);
  await page.goto('/la-clara');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'La Clara és la nostra iaia.',
  );
  await expect(page.locator('.grandma-photo img')).toHaveAttribute('alt', /provisional/);
  await expect(page.locator('.prose .button')).toHaveCSS('color', 'rgb(255, 255, 255)');
  await page.locator('.grandma-photo').scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page.locator('.grandma-photo img').evaluate((node) => node.complete && node.naturalWidth > 0),
    )
    .toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.screenshot({ path: `.qa/story-${info.project.name}.png`, fullPage: true });
  await page.goto('/products');
  for (const image of await page.locator('.product-card-image > img:first-child').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((node) => node.complete && node.naturalWidth > 0))
      .toBe(true);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.screenshot({ path: `.qa/catalog-${info.project.name}.png`, fullPage: true });
});

test('layouts fit small phones, tablets and Figma desktop width', async ({ page }) => {
  for (const width of [320, 768, 1512]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/products', '/la-clara', '/contacte']) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${route} at ${width}px`,
      ).toBe(true);
    }
  }
});
