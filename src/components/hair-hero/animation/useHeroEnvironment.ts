import { useEffect, useState, type RefObject } from 'react';

export function useHeroEnvironment(stage: RefObject<HTMLDivElement | null>) {
  const [profile, setProfile] = useState({ ready: false, mobile: false, reducedMotion: false, webglSupported: false });
  const [active, setActive] = useState(true);
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    // R3F configures its renderer asynchronously. Detect missing WebGL before
    // mounting Canvas so unsupported browsers cannot produce an uncaught rejection.
    let webglSupported = false;
    try {
      const probe = document.createElement('canvas');
      const context = probe.getContext('webgl2');
      webglSupported = context !== null;
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch { webglSupported = false; }
    const update = () => setProfile({ ready: true, mobile: mobile.matches, reducedMotion: motion.matches, webglSupported });
    update();
    mobile.addEventListener('change', update);
    motion.addEventListener('change', update);
    let intersecting = true;
    const updateActivity = () => setActive(intersecting && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      updateActivity();
    }, { threshold: 0 });
    if (stage.current) observer.observe(stage.current);
    document.addEventListener('visibilitychange', updateActivity);
    return () => {
      observer.disconnect();
      mobile.removeEventListener('change', update);
      motion.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', updateActivity);
    };
  }, [stage]);
  return { ...profile, active };
}
