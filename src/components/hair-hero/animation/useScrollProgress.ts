import { useEffect, useRef, useState, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createAnimationState, createHeroTimeline, phaseAt } from './timeline';

/** Owns one trigger only. Never kills other components' ScrollTriggers. */
export function useScrollProgress(
  section: RefObject<HTMLElement | null>,
  stage: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  reducedMotion: boolean,
) {
  const animation = useRef(createAnimationState());
  const trigger = useRef<ScrollTrigger | null>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!enabled || !section.current || !stage.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const root = section.current;
    Object.assign(animation.current, createAnimationState());
    const timeline = createHeroTimeline(animation.current);
    if (reducedMotion) {
      timeline.progress(1);
      setPhase(5);
      root.style.setProperty('--hero-progress', '1');
      root.dataset.progress = '1.0000';
      return () => { timeline.kill(); };
    }
    const update = () => {
      const progress = animation.current.progress;
      root.style.setProperty('--hero-progress', String(progress));
      root.dataset.progress = progress.toFixed(4);
      setPhase(previous => {
        const next = phaseAt(progress);
        return previous === next ? previous : next;
      });
    };
    timeline.eventCallback('onUpdate', update);
    trigger.current = ScrollTrigger.create({
      trigger: root,
      pin: stage.current,
      pinSpacing: false,
      start: 'top top',
      end: 'bottom bottom',
      animation: timeline,
      scrub: true,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    });
    update();
    const resize = new ResizeObserver(() => trigger.current?.refresh());
    resize.observe(root);
    return () => {
      resize.disconnect();
      trigger.current?.kill();
      trigger.current = null;
      timeline.kill();
      root.style.removeProperty('--hero-progress');
    };
  }, [enabled, reducedMotion, section, stage]);

  const seek = (progress: number) => {
    const active = trigger.current;
    if (active) window.scrollTo({ top: active.start + (active.end - active.start) * progress, behavior: 'instant' });
  };
  return { animation, phase, seek };
}
