import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Booking Module: Component, Subpage and API integration files exist and are valid', () => {
  const bookingDir = path.resolve(process.cwd(), 'src/components/booking');
  assert.ok(fs.existsSync(bookingDir), 'src/components/booking directory must exist');

  const bookingViewPath = path.join(bookingDir, 'BookingView.tsx');
  const bookingPagePath = path.join(bookingDir, 'BookingPage.tsx');
  const bookingCssPath = path.join(bookingDir, 'booking.css');

  assert.ok(fs.existsSync(bookingViewPath), 'BookingView.tsx must exist');
  assert.ok(fs.existsSync(bookingPagePath), 'BookingPage.tsx must exist');
  assert.ok(fs.existsSync(bookingCssPath), 'booking.css must exist');

  const bookingViewContent = fs.readFileSync(bookingViewPath, 'utf8');
  assert.ok(bookingViewContent.includes('clinic=elifay'), 'BookingView must request slots/appointments for clinic elifay');
  assert.ok(bookingViewContent.includes('APPOINTMENT_TYPES'), 'BookingView must include appointment types');
  assert.ok(bookingViewContent.includes('activeTab === "requests"'), 'BookingView must include requests tracker view');
  assert.ok(bookingViewContent.includes('activeTab === "manage"'), 'BookingView must include manage/lookup view');

  const mainContent = fs.readFileSync(path.resolve(process.cwd(), 'src/main.tsx'), 'utf8');
  assert.ok(mainContent.includes('BookingPage'), 'main.tsx must import and render BookingPage');
  assert.ok(mainContent.includes('/randevu'), 'main.tsx must route /randevu to BookingPage');

  const viteConfigContent = fs.readFileSync(path.resolve(process.cwd(), 'vite.config.ts'), 'utf8');
  assert.ok(viteConfigContent.includes('/api'), 'vite.config.ts must proxy /api to Next.js server');
});
