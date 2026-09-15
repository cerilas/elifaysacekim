import { test, expect, type Page } from '@playwright/test';

async function waitForScene(page: Page) {
  await expect(page.locator('.hh-root')).toHaveAttribute('data-render-state', 'ready', { timeout: 45000 });
}

async function countDraws(page: Page) {
  await page.addInitScript(() => {
    window.heroDrawCalls = 0;
    for (const prototype of [WebGLRenderingContext.prototype, WebGL2RenderingContext.prototype]) {
      for (const name of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
        const original = (prototype as unknown as Record<string, Function>)[name];
        if (typeof original !== 'function') continue;
        (prototype as unknown as Record<string, Function>)[name] = function (...args: unknown[]) {
          window.heroDrawCalls++;
          return original.apply(this, args);
        };
      }
    }
  });
}

test('all scroll stages reverse and stay synchronized, with no browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await waitForScene(page);
  for (const [progress, phase] of [[0, 0], [.3, 1], [.5, 2], [.67, 3], [.82, 4], [.99, 5], [.5, 2], [0, 0]]) {
    await page.evaluate(progress => {
      const hero = document.querySelector<HTMLElement>('.hh-root');
      const travel = (hero ? hero.offsetHeight - window.innerHeight : window.innerHeight * 2);
      window.scrollTo(0, travel * progress);
    }, progress);
    await expect(page.locator('.hh-root')).toHaveAttribute('data-phase', String(phase));
    await expect.poll(async () => Number(await page.locator('.hh-root').getAttribute('data-progress'))).toBeCloseTo(progress, 2);
  }
  await page.getByRole('button', { name: 'Explore the process' }).click();
  await expect(page.locator('.hh-root')).toHaveAttribute('data-phase', '2');
  expect(errors).toEqual([]);
});

test('the GPU stops drawing off screen and resumes on return', async ({ page }) => {
  await countDraws(page);
  await page.goto('/'); await waitForScene(page);
  await page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>('.hh-root');
    window.scrollTo(0, (hero ? hero.offsetHeight : window.innerHeight * 3) + 10);
  });
  await expect(page.locator('.hh-root')).toHaveAttribute('data-render-active', 'false');
  await page.waitForTimeout(300);
  const stopped = await page.evaluate(() => window.heroDrawCalls);
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => window.heroDrawCalls)).toBe(stopped);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator('.hh-root')).toHaveAttribute('data-render-active', 'true');
  await expect.poll(() => page.evaluate(() => window.heroDrawCalls)).toBeGreaterThan(stopped);
});

test('mobile fits 320px and reduced motion renders once without pinning', async ({ page }) => {
  await countDraws(page);
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/'); await waitForScene(page);
  await expect(page.locator('.hh-root')).toHaveAttribute('data-progress', '1.0000');
  expect(await page.locator('.pin-spacer').count()).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await page.waitForTimeout(500);
  const stopped = await page.evaluate(() => window.heroDrawCalls);
  await page.mouse.move(310, 30);
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => window.heroDrawCalls)).toBe(stopped);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.pin-spacer')).toHaveCount(2);
});

test('unmount and media changes clean up only the owned ScrollTrigger', async ({ page }) => {
  await page.goto('/tests/fixture.html'); await waitForScene(page);
  await expect.poll(() => page.evaluate(() => window.fixture.triggerCount())).toBe(2);
  await page.getByRole('button', { name: 'Toggle hero' }).click();
  await expect.poll(() => page.evaluate(() => window.fixture.triggerCount())).toBe(1);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await page.getByRole('button', { name: 'Toggle hero' }).click(); await waitForScene(page);
  await expect.poll(() => page.evaluate(() => window.fixture.triggerCount())).toBe(2);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.evaluate(() => window.fixture.triggerCount())).toBe(1);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(() => page.evaluate(() => window.fixture.triggerCount())).toBe(2);
  await expect(page.locator('.pin-spacer')).toHaveCount(1);
});

test('WebGL failure leaves usable HTML and a static fallback', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, name: string, ...args: unknown[]) {
      if (name.startsWith('webgl')) return null;
      return original.apply(this, [name, ...args] as Parameters<typeof original>);
    } as typeof original;
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.hh-root')).toHaveAttribute('data-render-state', 'fallback');
  await expect(page.locator('.hh-root')).toHaveClass(/hh-reduced/);
  expect(await page.locator('.hh-root').evaluate(element => element.parentElement?.classList.contains('pin-spacer'))).toBe(false);
  expect(errors).toEqual([]);
});


test('new clinic sections show Elif Ay and reversible treatment chapters', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/'); await waitForScene(page);
  await expect(page.locator('.specialist-copy h3')).toHaveText('Elif Ay');
  for (const index of [0, 1, 2, 1, 0]) {
    await page.locator('#treatments').evaluate((element, index) => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY + window.innerHeight * index), index);
    await expect(page.locator('.treatment-tabs button').nth(index)).toHaveAttribute('aria-pressed', 'true');
  }
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.treatment-tabs button').nth(2).click();
  await expect(page.locator('.treatment-tabs button').nth(2)).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  expect(errors).toEqual([]);
});
