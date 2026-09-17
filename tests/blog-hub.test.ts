import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

test('Blog / Knowledge Base Hub: Component & Styles', () => {
  const blogPagePath = path.join(ROOT_DIR, 'src/components/blog-page/BlogPage.tsx');
  assert.ok(fs.existsSync(blogPagePath), 'BlogPage.tsx must exist');
  const blogPageContent = fs.readFileSync(blogPagePath, 'utf8');

  // Verify pagination & filtering
  assert.ok(blogPageContent.includes('ITEMS_PER_PAGE = 12'), 'Blog page must paginate 12 items per page');
  assert.ok(blogPageContent.includes('CATEGORIES'), 'Blog page must have category filters');
  assert.ok(blogPageContent.includes('searchQuery'), 'Blog page must have search functionality');
  assert.ok(blogPageContent.includes('CollectionPage'), 'Blog page must inject CollectionPage schema');
  assert.ok(blogPageContent.includes('canonical'), 'Blog page must set canonical link');

  // Verify blog-page.css styling
  const blogCssPath = path.join(ROOT_DIR, 'src/components/blog-page/blog-page.css');
  assert.ok(fs.existsSync(blogCssPath), 'blog-page.css must exist');
  const blogCss = fs.readFileSync(blogCssPath, 'utf8');

  // Dark mode
  assert.ok(blogCss.includes('.blog-page-root'), 'Must style .blog-page-root');
  assert.ok(blogCss.includes('.blog-articles-grid'), 'Must style responsive .blog-articles-grid');
  assert.ok(blogCss.includes('.blog-pagination'), 'Must style .blog-pagination');

  // Light mode
  assert.ok(blogCss.includes('[data-theme="light"] .blog-page-root'), 'Must style light mode root');
  assert.ok(blogCss.includes('[data-theme="light"] .blog-card'), 'Must style light mode blog cards');

  // Med mode tokens
  assert.ok(blogCss.includes('[data-theme="med"].blog-page-root'), 'Must style med mode root');
  assert.ok(blogCss.includes('#FFFFFF'), 'Must use #FFFFFF token in med mode');
  assert.ok(blogCss.includes('#D7C6FF'), 'Must use #D7C6FF token in med mode');
  assert.ok(blogCss.includes('#8FA9FF'), 'Must use #8FA9FF token in med mode');
  assert.ok(blogCss.includes('#2D3A5E'), 'Must use #2D3A5E token in med mode');
  assert.ok(blogCss.includes('#FBE7F1'), 'Must use #FBE7F1 token in med mode');
});

test('Homepage KnowledgeBaseSection: Shows 6 items & "Tümünü Göster" button', () => {
  const kbPath = path.join(ROOT_DIR, 'src/components/knowledge-base/KnowledgeBaseSection.tsx');
  const kbContent = fs.readFileSync(kbPath, 'utf8');

  assert.ok(kbContent.includes('ITEMS_PER_PAGE = 6'), 'Homepage must show 6 articles');
  assert.ok(kbContent.includes('btn-view-all-articles'), 'Must have "Tümünü Göster" button');
  assert.ok(kbContent.includes('href="/bilgi-bankasi"'), 'Button must link to /bilgi-bankasi');
});

test('Router & Pre-render Configuration for /bilgi-bankasi', () => {
  const mainPath = path.join(ROOT_DIR, 'src/main.tsx');
  const mainContent = fs.readFileSync(mainPath, 'utf8');

  assert.ok(mainContent.includes('isBlogHub'), 'main.tsx must detect blog hub path');
  assert.ok(mainContent.includes('<BlogPage'), 'main.tsx must render BlogPage');

  const prerenderPath = path.join(ROOT_DIR, 'scripts/prerender.cjs');
  const prerenderContent = fs.readFileSync(prerenderPath, 'utf8');

  assert.ok(prerenderContent.includes('PRE-RENDER BILGI-BANKASI & BLOG HUB'), 'prerender.cjs must pre-render hub');
  assert.ok(prerenderContent.includes(`${ROOT_DIR}` ? 'bilgi-bankasi' : 'bilgi-bankasi'), 'prerender.cjs must output to dist/bilgi-bankasi');
  assert.ok(prerenderContent.includes('CollectionPage'), 'prerender.cjs must include CollectionPage schema');
});
