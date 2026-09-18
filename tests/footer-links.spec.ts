import { test, expect } from '@playwright/test';
import path from 'path';

const ARTIFACT_DIR = '/Users/deniz/.gemini/antigravity-ide/brain/5c66c50d-1d67-4063-80b5-370230103bd3';

test('footer faq links are connected to real articles and navigate to dedicated URL', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Scroll down to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);

  // Check footer FAQ link for Gaziantep best hair transplant center
  const faqLink = page.locator('.seo-block').filter({ hasText: /SIK(ÇA)? SORULAN SORULAR/i }).locator('a', { hasText: 'Gaziantep en iyi saç ekim merkezi nasıl seçilir?' });
  await expect(faqLink).toBeVisible();
  await expect(faqLink).toHaveAttribute('href', '/bilgi-bankasi/gaziantep-en-iyi-sac-ekim-merkezi-nasil-secilir');

  // Click the FAQ link
  await faqLink.click();
  await page.waitForTimeout(600);

  // Verify URL and dedicated article page
  expect(page.url()).toContain('/bilgi-bankasi/gaziantep-en-iyi-sac-ekim-merkezi-nasil-secilir');
  await expect(page.locator('h1.article-main-title')).toContainText('Gaziantep En İyi Saç Ekim Merkezi Nasıl Seçilir?');
  await expect(page.locator('.article-breadcrumbs')).toContainText('Sıkça Sorulan Sorular');
  await expect(page.locator('.article-author-chip')).toContainText('Saç Ekim Koordinatörü');
});

test('footer regional links open corresponding city guides on dedicated URL', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Scroll down to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);

  // Check footer regional link for Istanbul Saç Ekimi
  const istLink = page.locator('.seo-block').filter({ hasText: 'HİZMET BÖLGELERİMİZ' }).locator('a', { hasText: 'İstanbul Saç Ekimi' });
  await expect(istLink).toBeVisible();
  await expect(istLink).toHaveAttribute('href', '/bilgi-bankasi/istanbul-sac-ekimi');

  // Click the regional link
  await istLink.click();
  await page.waitForTimeout(600);

  // Verify dedicated article page is shown
  expect(page.url()).toContain('/bilgi-bankasi/istanbul-sac-ekimi');
  await expect(page.locator('h1.article-main-title')).toContainText('İstanbul Saç Ekimi: Doğal Ön Çizgi ve Gold FUE Uzmanlığı');
  await expect(page.locator('.article-breadcrumbs')).toContainText('Bölgesel Rehberler');
});

test('legacy hash URL navigates to dedicated article page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#article-gaziantep-sac-ekimi');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(600);

  expect(page.url()).toContain('/bilgi-bankasi/gaziantep-sac-ekimi');
  await expect(page.locator('h1.article-main-title')).toContainText('Gaziantep Saç Ekimi');
});
