import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Reels Gallery: Data, Assets and Component Structure', () => {
  const rootDir = process.cwd();
  const reelsJsonPath = path.join(rootDir, 'src/data/reels.json');
  assert.ok(fs.existsSync(reelsJsonPath), 'src/data/reels.json must exist');

  const reels = JSON.parse(fs.readFileSync(reelsJsonPath, 'utf8'));
  assert.ok(Array.isArray(reels) && reels.length >= 6, 'Should have at least 6 reels');

  for (const reel of reels) {
    assert.ok(reel.id, 'Each reel must have an id');
    assert.ok(reel.videoUrl, 'Each reel must have a videoUrl');
    assert.strictEqual(reel.profileName, 'elifay.hairdentcoordination', 'Profile name should match Elif Ay account');
    assert.ok(reel.instagramUrl.includes('elifay.hairdentcoordination'), 'Instagram URL should link to Elif Ay');
    assert.ok(reel.descriptions.tr, 'Turkish description should exist');
    assert.ok(reel.descriptions.en, 'English description should exist');

    // Verify video asset exists in public
    const videoFilePath = path.join(rootDir, 'public', reel.videoUrl.replace(/^\//, ''));
    assert.ok(fs.existsSync(videoFilePath), `Video file must exist on disk: ${videoFilePath}`);
  }

  // Component files
  const componentPath = path.join(rootDir, 'src/components/reels-gallery/ReelsGallerySection.tsx');
  const carouselPath = path.join(rootDir, 'src/components/reels-gallery/ReelsCarousel.tsx');
  const cardPath = path.join(rootDir, 'src/components/reels-gallery/ReelCard.tsx');
  const cssPath = path.join(rootDir, 'src/components/reels-gallery/reels.css');

  assert.ok(fs.existsSync(componentPath), 'ReelsGallerySection.tsx must exist');
  assert.ok(fs.existsSync(carouselPath), 'ReelsCarousel.tsx must exist');
  assert.ok(fs.existsSync(cardPath), 'ReelCard.tsx must exist');
  assert.ok(fs.existsSync(cssPath), 'reels.css must exist');
});
