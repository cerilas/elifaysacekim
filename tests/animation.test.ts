import assert from 'node:assert/strict';
import test from 'node:test';
import { createAnimationState, createHeroTimeline, phaseAt } from '../src/components/hair-hero/animation/timeline';
import { createPlacements, createSurfaceGeometry, TARGET } from '../src/components/hair-hero/scene/geometry';

test('graft descends before growth; timeline reverses without leftover effects', () => {
  const state = createAnimationState();
  const timeline = createHeroTimeline(state);
  timeline.progress(0.5);
  const microscope = { ...state };
  assert.ok(state.skinOpacity < 0.44);
  assert.equal(state.graftVisibility, 0);
  timeline.progress(0.68);
  assert.ok(state.graftLift > 0 && state.graftLift < 3.1);
  assert.equal(state.growth, 0.012);
  timeline.progress(0.75);
  assert.equal(state.graftLift, 0);
  assert.equal(state.growth, 0.012);
  timeline.progress(0.82);
  assert.ok(state.growth > 0.1 && state.growth < 1);
  assert.ok(state.ripple > 0 && state.ripple < 1);
  timeline.progress(1);
  assert.equal(state.growth, 1);
  assert.equal(state.graftLift, 0);
  assert.equal(state.skinOpacity, 0.96);
  timeline.progress(0.5);
  for (const key of Object.keys(createAnimationState()) as (keyof typeof state)[]) {
    assert.ok(Math.abs(state[key] - microscope[key]) < 0.00001, `Reversible property: ${key}`);
  }
  timeline.progress(0);
  assert.equal(state.graftVisibility, 0);
  assert.equal(state.ripple, 0);
  assert.equal(state.graftLift, 3.1);
  timeline.kill();
});

test('direct deep-link seeks match continuous scrolling', () => {
  for (const progress of [0.1, 0.3, 0.5, 0.67, 0.75, 0.82, 0.95, 1]) {
    const first = createAnimationState(), second = createAnimationState();
    const direct = createHeroTimeline(first), stepped = createHeroTimeline(second);
    direct.progress(progress);
    for (let value = 0; value < progress; value += 0.007) stepped.progress(value);
    stepped.progress(progress);
    for (const key of Object.keys(createAnimationState()) as (keyof typeof first)[]) assert.ok(Math.abs(first[key] - second[key]) < 0.00001, `Direct seek: ${key} at ${progress}`);
    direct.kill(); stepped.kill();
  }
});

test('twenty desktop follicles and twelve mobile follicles including the graft, with no overlap at the target', () => {
  for (const mobile of [false, true]) {
    const points = createPlacements(mobile);
    assert.equal(points.length + 1, mobile ? 12 : 20);
    assert.deepEqual(points, createPlacements(mobile));
    for (const point of points) assert.ok(Math.hypot(point.x - TARGET.x, point.z - TARGET.z) >= 0.55);
  }
});

test('scalp has a real channel opening and upward surface normals', () => {
  const surface = createSurfaceGeometry(false);
  const positions = surface.getAttribute('position');
  const normals = surface.getAttribute('normal');
  for (let i = 0; i < positions.count; i++) {
    assert.ok(Math.hypot(positions.getX(i) - TARGET.x, positions.getZ(i) - TARGET.z) > 0.1149);
    assert.ok(normals.getY(i) > 0.8);
  }
  surface.dispose();
});

test('phase labels change at the requested scroll boundaries', () => {
  assert.deepEqual([0, 0.2, 0.4, 0.6, 0.75, 0.9, 1].map(phaseAt), [0, 1, 2, 3, 4, 5, 5]);
});
