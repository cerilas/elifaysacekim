import { test, expect } from '@playwright/test';
import path from 'path';

const ARTIFACT_DIR = '/Users/deniz/.gemini/antigravity-ide/brain/5c66c50d-1d67-4063-80b5-370230103bd3';

test.describe('SEO Dedicated Article URLs & Navigation', () => {
  test('direct navigation to /bilgi-bankasi/:slug renders dedicated article page with full SEO metadata', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bilgi-bankasi/istanbul-sac-ekimi');
    await page.waitForLoadState('networkidle');

    // 1. Verify Page Title and Meta Tags
    await expect(page).toHaveTitle(/İstanbul Saç Ekimi.*Elif Ay/);

    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /İstanbul saç ekimi/);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://elifaysacekim.com/bilgi-bankasi/istanbul-sac-ekimi');

    // 2. Verify Schema.org JSON-LD
    const jsonLd = await page.locator('script[type="application/ld+json"]').last().textContent();
    expect(jsonLd).toContain('https://schema.org');
    expect(jsonLd).toContain('Article');
    expect(jsonLd).toContain('BreadcrumbList');
    expect(jsonLd).toContain('Elif Ay');

    // 3. Verify Article Page Visual Structure
    const articleTitle = page.locator('h1.article-main-title');
    await expect(articleTitle).toBeVisible();
    await expect(articleTitle).toHaveText('İstanbul Saç Ekimi: Doğal Ön Çizgi ve Gold FUE Uzmanlığı');

    // 4. Verify Breadcrumbs
    const breadcrumbs = page.locator('.article-breadcrumbs');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs).toContainText('Ana Sayfa');
    await expect(breadcrumbs).toContainText('Bilgi Bankası');
    await expect(breadcrumbs).toContainText('Bölgesel Rehberler');

    // 5. Verify Author Bio (Elif Ay)
    const authorBadge = page.locator('.article-author-chip');
    await expect(authorBadge).toBeVisible();
    await expect(authorBadge).toContainText('Saç Ekim Koordinatörü ve Danışmanı Elif Ay');

    // 6. Verify Content & Inline WhatsApp CTA
    const richContent = page.locator('.article-rich-content');
    await expect(richContent).toBeVisible();

    const inlineCta = page.locator('.article-inline-cta');
    await expect(inlineCta).toBeVisible();
    await expect(inlineCta.locator('.article-cta-btn-wa')).toHaveAttribute('href', /wa\.me\/905364916040/);

    // 7. Verify Related Articles Section
    const relatedSection = page.locator('.article-related-section');
    await expect(relatedSection).toBeVisible();
    const relatedCards = relatedSection.locator('.article-related-card');
    expect(await relatedCards.count()).toBeGreaterThanOrEqual(1);

    // Take desktop screenshot of top
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'article_page_desktop.png'),
      fullPage: false
    });

    // Scroll to inline CTA and related articles
    await inlineCta.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'article_page_cta_and_related.png')
    });
  });

  test('mobile viewport renders responsive article layout and sticky bar', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/bilgi-bankasi/istanbul-sac-ekimi');
    await page.waitForLoadState('networkidle');

    const articleTitle = page.locator('h1.article-main-title');
    await expect(articleTitle).toBeVisible();

    // Mobile sticky CTA bar should be visible
    const mobileStickyBar = page.locator('.mobile-cta-bar');
    await expect(mobileStickyBar).toBeVisible();
    await expect(mobileStickyBar.locator('.mobile-cta-wa')).toHaveAttribute('href', /wa\.me\/905364916040/);

    // Take mobile screenshot
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'article_page_mobile.png')
    });
  });

  test('clicking article card from KnowledgeBaseSection on homepage navigates to /bilgi-bankasi/:slug', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/#knowledge-base');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Find the first article link card in knowledge base
    const firstArticleCard = page.locator('a.article-card').first();
    await expect(firstArticleCard).toBeVisible();
    const href = await firstArticleCard.getAttribute('href');
    expect(href).toMatch(/^\/bilgi-bankasi\/.+/);

    // Click to navigate
    await firstArticleCard.click();
    await page.waitForTimeout(300);

    // URL should have changed to /bilgi-bankasi/...
    expect(page.url()).toContain('/bilgi-bankasi/');
    await expect(page.locator('article.article-container')).toBeVisible();

    // Now click brand logo to return home
    const brandLink = page.locator('.article-brand-link');
    await expect(brandLink).toBeVisible();
    await brandLink.click();
    await page.waitForTimeout(300);

    // URL should be back to /
    expect(new URL(page.url()).pathname).toBe('/');
    await expect(page.locator('.site-header')).toBeVisible();
  });

  test('footer links navigate directly to /bilgi-bankasi/:slug and scroll to top', async ({ page }) => {
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
    await page.waitForTimeout(400);

    // Verify URL and ArticlePage display
    expect(page.url()).toContain('/bilgi-bankasi/istanbul-sac-ekimi');
    await expect(page.locator('h1.article-main-title')).toHaveText('İstanbul Saç Ekimi: Doğal Ön Çizgi ve Gold FUE Uzmanlığı');

    // Check scroll position is near top
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });

  test('legacy hash URL (#article-slug) smoothly redirects to /bilgi-bankasi/slug', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/#article-gaziantep-sac-ekimi');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // URL should have replaced hash with clean pathname
    expect(page.url()).toContain('/bilgi-bankasi/gaziantep-sac-ekimi');
    await expect(page.locator('h1.article-main-title')).toContainText('Gaziantep Saç Ekimi');
  });
});
