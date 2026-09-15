import { test, expect } from '@playwright/test';
import path from 'path';

const ARTIFACT_DIR = '/Users/deniz/.gemini/antigravity-ide/brain/5c66c50d-1d67-4063-80b5-370230103bd3';

test('desktop header, care section and footer display whatsapp and phone ctas', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Verify header actions
  const headerActions = page.locator('.header-actions');
  await expect(headerActions).toBeVisible();

  const headerPhone = page.locator('.header-phone-btn');
  await expect(headerPhone).toHaveAttribute('href', 'tel:+905364916040');
  await expect(headerPhone).toContainText('0 536 491 60 40');

  const headerWa = page.locator('.header-whatsapp-btn');
  await expect(headerWa).toBeVisible();
  const headerWaImg = headerWa.locator('img');
  await expect(headerWaImg).toHaveAttribute('src', '/icons/whatsapp-icon.webp');
  await expect(headerWaImg).toHaveAttribute('alt', 'Elif Ay Saç Ekimi WhatsApp Danışma ve Ücretsiz Analiz Hattı');

  // Take screenshot of header
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'cta_desktop_header.png'),
    clip: { x: 0, y: 0, width: 1440, height: 180 }
  });

  // Verify Care section CTA
  const careCta = page.locator('.care-cta-bar');
  await careCta.scrollIntoViewIfNeeded();
  await expect(careCta).toBeVisible();
  const careWa = careCta.locator('.care-whatsapp-btn');
  await expect(careWa).toContainText('WhatsApp ile Ücretsiz Analiz Başlatın');
  const carePhone = careCta.locator('.care-phone-btn');
  await expect(carePhone).toContainText('0 536 491 60 40');

  const careBox = await careCta.boundingBox();
  if (careBox) {
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'cta_desktop_care.png'),
      clip: { x: 0, y: Math.max(0, careBox.y - 120), width: 1440, height: 380 }
    });
  }

  // Verify Footer CTA banner
  const footerBanner = page.locator('.footer-cta-banner');
  await footerBanner.scrollIntoViewIfNeeded();
  await expect(footerBanner).toBeVisible();
  const footerWa = footerBanner.locator('.footer-whatsapp-cta');
  await expect(footerWa).toBeVisible();
  const footerPhone = footerBanner.locator('.footer-phone-cta');
  await expect(footerPhone).toBeVisible();

  const footerBox = await footerBanner.boundingBox();
  if (footerBox) {
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'cta_desktop_footer.png'),
      clip: { x: 0, y: Math.max(0, footerBox.y - 40), width: 1440, height: 420 }
    });
  }
});

test('mobile sticky bar remains permanently pinned at the bottom with call and whatsapp buttons', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const stickyBar = page.locator('.mobile-sticky-bar');
  await expect(stickyBar).toBeVisible();

  const callBtn = stickyBar.locator('.sticky-btn-call');
  await expect(callBtn).toHaveAttribute('href', 'tel:+905364916040');
  await expect(callBtn).toContainText('Telefon ile Ara');

  const waBtn = stickyBar.locator('.sticky-btn-whatsapp');
  await expect(waBtn).toBeVisible();
  await expect(waBtn).toContainText("WhatsApp'tan Yaz");
  const waImg = waBtn.locator('img');
  await expect(waImg).toHaveAttribute('src', '/icons/whatsapp-icon.webp');
  await expect(waImg).toHaveAttribute('alt', 'Elif Ay Saç Ekimi WhatsApp Danışma ve Ücretsiz Analiz Hattı');

  // Screenshot at initial top load
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'cta_mobile_sticky_bar.png')
  });

  // Scroll 1500px down and verify still visible
  await page.evaluate(() => window.scrollBy(0, 1500));
  await page.waitForTimeout(300);
  await expect(stickyBar).toBeVisible();

  // Sticky bar bounding box should be near the bottom of the 812px viewport
  const box = await stickyBar.boundingBox();
  expect(box).not.toBeNull();
  if (box) {
    expect(box.y + box.height).toBeGreaterThanOrEqual(800);
  }

  // Screenshot while scrolled
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'cta_mobile_sticky_scrolled.png')
  });

  // Scroll all the way down to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await expect(stickyBar).toBeVisible();

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'cta_mobile_footer.png')
  });
});
