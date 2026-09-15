import gsap from 'gsap';
import type { HeroAnimationState } from '../types';

export const PHASES = [
  { start: 0, title: 'Temel', detail: 'Doğal büyüme yüzeyin altında başlar.' },
  { start: 0.2, title: 'Yüzeyin altında', detail: 'Saçın mimarisine daha yakından bir bakış.' },
  { start: 0.4, title: 'Başlangıç noktası', detail: 'Özenle hazırlanmış bir kök kanalı.' },
  { start: 0.6, title: 'Hassas yerleştirme', detail: 'Folliküler greft yeni yerine yerleşiyor.' },
  { start: 0.75, title: 'Yeni bir başlangıç', detail: 'Yenilenen folikülden yeni bir saç teli uzuyor.' },
  { start: 0.9, title: 'Doğal görünüm', detail: 'Özgürce uzayan saçlar. Yenilenmiş bir özgüven.' },
] as const;

export function phaseAt(progress: number) {
  return Math.max(0, PHASES.findLastIndex(phase => progress >= phase.start));
}

export function createAnimationState(): HeroAnimationState {
  return {
    progress: 0, cameraX: 2, cameraY: 1.8, cameraZ: 8.9,
    lookY: 0.55, skinOpacity: 0.97, tissueOpacity: 0.74,
    reveal: 0, target: 0, graftVisibility: 0, graftLift: 3.1,
    graftBrightness: 0, growth: 0.012, ripple: 0, particleProgress: 0,
    rotation: -0.12,
  };
}

/** Pure timeline: every substantive scene property is seekable and reversible.
 * No callbacks launch time-based placement, growth, or particle animations. */
export function createHeroTimeline(state: HeroAnimationState) {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'sine.inOut' } });
  timeline.to(state, { progress: 1, duration: 1, ease: 'none' }, 0);
  timeline.to(state, {
    cameraX: 1.7, cameraY: 2.65, cameraZ: 6.9, lookY: 0.1,
    skinOpacity: 0.43, tissueOpacity: 0.25, reveal: 0.65, duration: 0.2,
  }, 0.2);
  timeline.to(state, {
    cameraX: 0.7, cameraY: 1.15, cameraZ: 7.4, lookY: 0.15,
    skinOpacity: 0.12, tissueOpacity: 0.10, reveal: 1, target: 1,
    rotation: 0.03, duration: 0.2,
  }, 0.4);
  timeline.to(state, { graftVisibility: 1, duration: 0.03 }, 0.52);
  timeline.to(state, { graftLift: 0, duration: 0.20, ease: 'sine.inOut' }, 0.55);
  timeline.to(state, { graftBrightness: 1, duration: 0.022 }, 0.742);
  timeline.to(state, { graftBrightness: 0.22, duration: 0.09 }, 0.764);
  timeline.to(state, { ripple: 1, particleProgress: 1, duration: 0.13, ease: 'none' }, 0.75);
  timeline.to(state, { growth: 1, duration: 0.15, ease: 'power2.inOut' }, 0.75);
  timeline.to(state, {
    skinOpacity: 0.96, tissueOpacity: 0.53, target: 0,
    duration: 0.115,
  }, 0.785);
  timeline.to(state, {
    cameraX: 2.15, cameraY: 2.4, cameraZ: 9.2, lookY: 0.62,
    rotation: -0.16, reveal: 0.1, duration: 0.1,
  }, 0.9);
  return timeline;
}
