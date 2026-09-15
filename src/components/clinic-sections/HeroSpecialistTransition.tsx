import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface HeroSpecialistTransitionProps {
  portraitSrc?: string;
  portraitPosition?: string;
  specialistName?: string;
  children: ReactNode;
}

export function HeroSpecialistTransition({
  portraitSrc = '/elif-ay-portrait.jpg',
  portraitPosition = '50% 35%',
  specialistName = 'Elif Ay',
  children,
}: HeroSpecialistTransitionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const floaterRef = useRef<HTMLDivElement>(null);
  const textFloaterRef = useRef<HTMLDivElement>(null);
  const headingFloaterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current || !floaterRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    const floater = floaterRef.current;
    const textFloater = textFloaterRef.current;
    const headingFloater = headingFloaterRef.current;
    const heroSection = root.querySelector<HTMLElement>('.hh-root');
    const heroStage = root.querySelector<HTMLElement>('.hh-stage');
    const specialistSection = root.querySelector<HTMLElement>('.specialist-section');
    const avatarWrapper = root.querySelector<HTMLElement>('#hero-mini-profile-img-wrapper');
    const destinationPortrait = root.querySelector<HTMLElement>('.specialist-portrait');
    const destImg = destinationPortrait?.querySelector<HTMLElement>('.specialist-image, svg');
    const careSection = root.querySelector<HTMLElement>('.care-section');
    const specialistSignature = specialistSection?.querySelector<HTMLElement>('.specialist-signature');
    const careH2 = careSection?.querySelector<HTMLElement>('.care-intro h2');
    const textSource = textFloater?.querySelector<HTMLElement>('.pt-sig-source');
    const textTarget = textFloater?.querySelector<HTMLElement>('.pt-sig-target');
    const treatmentsSection = root.querySelector<HTMLElement>('.treatments-section');
    const treatmentsH2 = treatmentsSection?.querySelector<HTMLElement>('.treatments-intro h2');
    const headingSource = headingFloater?.querySelector<HTMLElement>('.pt-heading-source');
    const headingTarget = headingFloater?.querySelector<HTMLElement>('.pt-heading-target');

    if (!heroSection || !heroStage || !specialistSection || !avatarWrapper || !destinationPortrait) return;

    const avatarImg = avatarWrapper.querySelector<HTMLElement>('img');

    let first = { x: 0, y: 0, scale: 1, clip: '' };
    let last = { x: 0, y: 0, width: 0, height: 0 };

    let textFirst = { x: 0, y: 0 };
    let textLast = { x: 0, y: 0 };

    let headingFirst = { x: 0, y: 0 };
    let headingLast = { x: 0, y: 0 };

    const measure = () => {
      const rootRect = root.getBoundingClientRect();
      const stageRect = heroStage.getBoundingClientRect();
      const secRect = specialistSection.getBoundingClientRect();
      const miniRect = avatarWrapper.getBoundingClientRect();
      const portRect = destinationPortrait.getBoundingClientRect();

      const avatarWidth = miniRect.width || 56;
      const avatarHeight = miniRect.height || 56;
      const bWidth = portRect.width || 440;
      const bHeight = portRect.height || 550;
      const scale = avatarWidth / bWidth;

      // Relative coordinates invariant of scroll position:
      const avatarOffsetX = miniRect.left - rootRect.left;
      const avatarOffsetY = miniRect.top - stageRect.top;

      const pinDistance = heroSection.offsetHeight - heroStage.offsetHeight;

      const portOffsetX = portRect.left - rootRect.left;
      const portOffsetY = portRect.top - secRect.top;

      // In document space relative to root (.hero-specialist-flow):
      const aX = avatarOffsetX;
      const aY = pinDistance + avatarOffsetY;

      const bX = portOffsetX;
      const bY = heroSection.offsetHeight + portOffsetY;

      const scaledHeight = bHeight * scale;
      const yOffset = (avatarHeight - scaledHeight) / 2;
      const clipInset = (bHeight - bWidth) / 2;

      first = {
        x: aX,
        y: aY + yOffset,
        scale,
        clip: `inset(${clipInset}px 0px round ${bWidth / 2}px)`,
      };

      last = {
        x: bX,
        y: bY,
        width: bWidth,
        height: bHeight,
      };

      gsap.set(floater, { width: bWidth, height: bHeight });

      // Measure text morph coordinates
      if (careSection && specialistSignature && careH2 && textFloater) {
        const sigRect = specialistSignature.getBoundingClientRect();
        const careRect = careSection.getBoundingClientRect();
        const h2Rect = careH2.getBoundingClientRect();

        const sigOffsetX = sigRect.left - rootRect.left;
        const sigOffsetY = sigRect.top - secRect.top;

        const h2OffsetX = h2Rect.left - rootRect.left;
        const h2OffsetY = h2Rect.top - careRect.top;

        const sec2TopInRoot = heroSection.offsetHeight;
        const sec3TopInRoot = heroSection.offsetHeight + specialistSection.offsetHeight;

        textFirst = {
          x: sigOffsetX,
          y: sec2TopInRoot + sigOffsetY,
        };

        textLast = {
          x: h2OffsetX,
          y: sec3TopInRoot + h2OffsetY,
        };

        if (h2Rect.width > 0) {
          textFloater.style.width = `${h2Rect.width}px`;
        }
      }

      // Measure care-to-treatments heading morph coordinates
      if (careSection && treatmentsSection && careH2 && treatmentsH2 && headingFloater) {
        const careRect = careSection.getBoundingClientRect();
        const careH2Rect = careH2.getBoundingClientRect();
        const treatRect = treatmentsSection.getBoundingClientRect();
        const treatStage = treatmentsSection.querySelector<HTMLElement>('.treatments-stage');
        const treatStageRect = treatStage ? treatStage.getBoundingClientRect() : treatRect;
        const treatH2Rect = treatmentsH2.getBoundingClientRect();

        const careH2OffsetX = careH2Rect.left - rootRect.left;
        const careH2OffsetY = careH2Rect.top - careRect.top;

        const treatH2OffsetX = treatH2Rect.left - rootRect.left;
        const treatH2OffsetY = treatH2Rect.top - treatStageRect.top;

        const sec3TopInRoot = heroSection.offsetHeight + specialistSection.offsetHeight;
        const sec4TopInRoot = sec3TopInRoot + careSection.offsetHeight;

        headingFirst = {
          x: careH2OffsetX,
          y: sec3TopInRoot + careH2OffsetY,
        };

        headingLast = {
          x: treatH2OffsetX,
          y: sec4TopInRoot + treatH2OffsetY,
        };

        const maxHeadingWidth = Math.max(careH2Rect.width, treatH2Rect.width);
        if (maxHeadingWidth > 0) {
          headingFloater.style.width = `${maxHeadingWidth}px`;
        }
      }
    };

    measure();

    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      root.dataset.enhanced = 'true';

      const updateVisibility = (p: number) => {
        if (p <= 0.001) {
          floater.style.display = 'none';
          if (avatarImg) avatarImg.style.visibility = 'visible';
          avatarWrapper.style.background = '#b8a88f';
          destinationPortrait.style.background = 'transparent';
          if (destImg) destImg.style.visibility = 'hidden';
        } else if (p >= 0.998) {
          floater.style.display = 'none';
          if (avatarImg) avatarImg.style.visibility = 'hidden';
          avatarWrapper.style.background = 'transparent';
          destinationPortrait.style.background = '#b8a88f';
          if (destImg) destImg.style.visibility = 'visible';
        } else {
          floater.style.display = 'block';
          floater.style.visibility = 'visible';
          if (avatarImg) avatarImg.style.visibility = 'hidden';
          avatarWrapper.style.background = 'transparent';
          destinationPortrait.style.background = 'transparent';
          if (destImg) destImg.style.visibility = 'hidden';
        }
      };

      let textProgress = 0;
      let headingProgress = 0;

      const updateTextVisibility = (p: number) => {
        if (!specialistSignature || !careH2 || !textFloater) return;
        textProgress = p;
        if (p <= 0.001) {
          textFloater.style.display = 'none';
          specialistSignature.style.visibility = 'visible';
          careH2.style.visibility = 'hidden';
          careH2.style.opacity = '0';
        } else if (p >= 0.998) {
          textFloater.style.display = 'none';
          specialistSignature.style.visibility = 'hidden';
          if (headingProgress <= 0.001) {
            careH2.style.visibility = 'visible';
            careH2.style.opacity = '1';
          }
        } else {
          textFloater.style.display = 'block';
          textFloater.style.visibility = 'visible';
          specialistSignature.style.visibility = 'hidden';
          careH2.style.visibility = 'hidden';
          careH2.style.opacity = '0';
        }
      };

      const updateHeadingVisibility = (p: number) => {
        if (!careH2 || !treatmentsH2 || !headingFloater) return;
        headingProgress = p;
        if (p <= 0.001) {
          headingFloater.style.display = 'none';
          treatmentsH2.style.visibility = 'hidden';
          treatmentsH2.style.opacity = '0';
          if (textProgress >= 0.99) {
            careH2.style.visibility = 'visible';
            careH2.style.opacity = '1';
          }
        } else if (p >= 0.998) {
          headingFloater.style.display = 'none';
          careH2.style.visibility = 'hidden';
          careH2.style.opacity = '0';
          treatmentsH2.style.visibility = 'visible';
          treatmentsH2.style.opacity = '1';
        } else {
          headingFloater.style.display = 'block';
          headingFloater.style.visibility = 'visible';
          careH2.style.visibility = 'hidden';
          careH2.style.opacity = '0';
          treatmentsH2.style.visibility = 'hidden';
          treatmentsH2.style.opacity = '0';
        }
      };

      updateVisibility(0);
      updateTextVisibility(0);
      updateHeadingVisibility(0);

      const context = gsap.context(() => {
        gsap.set('.specialist-copy > *', { y: 45, opacity: 0 });
        gsap.set('.portrait-caption', { y: 16, opacity: 0 });

        // Portrait transition timeline (Hero -> Section 2)
        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: specialistSection,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
            onUpdate: (self) => updateVisibility(self.progress),
          },
        });

        timeline.fromTo(floater, {
          x: () => first.x,
          y: () => first.y,
          scale: () => first.scale,
          clipPath: () => first.clip,
        }, {
          x: () => last.x,
          y: () => last.y,
          scale: 1,
          clipPath: 'inset(0px 0px round 6px)',
          duration: 1,
          ease: 'power2.inOut',
        }, 0);

        timeline.fromTo('.hh-copy', { opacity: 1 }, { opacity: 0, duration: 0.45, ease: 'power1.in' }, 0);
        timeline.fromTo('.specialist-copy > *', { y: 45, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.045, duration: 0.2, ease: 'power2.out' }, 0.63);
        timeline.fromTo('.portrait-caption', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.12 }, 0.88);
        timeline.fromTo('.specialist-orbit', { rotation: -25, scale: 0.85, opacity: 0 }, { rotation: 12, scale: 1, opacity: 1, duration: 0.8 }, 0);

        // Text morph transition timeline (Section 2 -> Section 3)
        if (careSection && textFloater && textSource && textTarget) {
          const textTimeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: careSection,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
              invalidateOnRefresh: true,
              onRefreshInit: measure,
              onUpdate: (self) => updateTextVisibility(self.progress),
            },
          });

          textTimeline.fromTo(textFloater, {
            x: () => textFirst.x,
            y: () => textFirst.y,
          }, {
            x: () => textLast.x,
            y: () => textLast.y,
            duration: 1,
            ease: 'power1.inOut',
          }, 0);

          textTimeline.fromTo(textSource, {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
          }, {
            opacity: 0,
            scale: 1.15,
            filter: 'blur(6px)',
            duration: 0.45,
            ease: 'power1.in',
          }, 0.15);

          textTimeline.fromTo(textTarget, {
            opacity: 0,
            scale: 0.88,
            filter: 'blur(6px)',
          }, {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.45,
            ease: 'power1.out',
          }, 0.42);
        }

        // Heading morph transition timeline (Section 3 -> Section 4)
        if (careSection && treatmentsSection && headingFloater && headingSource && headingTarget && careH2 && treatmentsH2) {
          const headingTimeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: treatmentsSection,
              start: 'top 96%',
              end: 'top top',
              scrub: true,
              invalidateOnRefresh: true,
              onRefreshInit: measure,
              onUpdate: (self) => updateHeadingVisibility(self.progress),
            },
          });

          headingTimeline.fromTo(headingFloater, {
            x: () => headingFirst.x,
            y: () => headingFirst.y,
          }, {
            x: () => headingLast.x,
            y: () => headingLast.y,
            duration: 1,
            ease: 'power1.inOut',
          }, 0);

          headingTimeline.fromTo(headingSource, {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
          }, {
            opacity: 0,
            scale: 1.1,
            filter: 'blur(6px)',
            duration: 0.45,
            ease: 'power1.in',
          }, 0.15);

          headingTimeline.fromTo(headingTarget, {
            opacity: 0,
            scale: 0.9,
            filter: 'blur(6px)',
          }, {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.45,
            ease: 'power1.out',
          }, 0.42);
        }
      }, root);

      let refreshFrame = 0;
      const handleResize = () => {
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      };

      window.addEventListener('resize', handleResize);

      const ro = new ResizeObserver(handleResize);
      if (heroStage) ro.observe(heroStage);
      ro.observe(specialistSection);
      ro.observe(avatarWrapper);
      ro.observe(destinationPortrait);
      if (careSection) ro.observe(careSection);
      if (specialistSignature) ro.observe(specialistSignature);
      if (careH2) ro.observe(careH2);
      if (treatmentsSection) ro.observe(treatmentsSection);
      if (treatmentsH2) ro.observe(treatmentsH2);

      let disposed = false;
      document.fonts?.ready.then(() => {
        if (!disposed) {
          ScrollTrigger.refresh();
        }
      });

      return () => {
        disposed = true;
        window.removeEventListener('resize', handleResize);
        ro.disconnect();
        cancelAnimationFrame(refreshFrame);
        context.revert();
        delete root.dataset.enhanced;
      };
    });

    media.add('(prefers-reduced-motion: reduce)', () => {
      floater.style.display = 'none';
      if (textFloater) textFloater.style.display = 'none';
      if (specialistSignature) specialistSignature.style.visibility = 'visible';
      if (careH2) {
        careH2.style.visibility = 'visible';
        careH2.style.opacity = '1';
      }
      if (headingFloater) headingFloater.style.display = 'none';
      if (treatmentsH2) {
        treatmentsH2.style.visibility = 'visible';
        treatmentsH2.style.opacity = '1';
      }
      delete root.dataset.enhanced;
    });

    return () => media.revert();
  }, [portraitSrc, specialistName]);

  return (
    <div ref={rootRef} className="hero-specialist-flow" style={{ position: 'relative', isolation: 'isolate' }}>
      {children}
      <div ref={floaterRef} className="pt-moving-portrait" aria-hidden="true">
        {portraitSrc ? (
          <img src={portraitSrc} alt="" decoding="async" style={{ objectPosition: portraitPosition }} />
        ) : null}
      </div>
      <div ref={textFloaterRef} className="pt-moving-signature" aria-hidden="true">
        <span className="pt-sig-source">{specialistName}</span>
        <h2 className="pt-sig-target">Her detayda<br /><em>insan odağı.</em></h2>
      </div>
      <div ref={headingFloaterRef} className="pt-moving-care-heading" aria-hidden="true">
        <h2 className="pt-heading-source">Her detayda<br /><em>insan odağı.</em></h2>
        <h2 className="pt-heading-target">Kalıcı ve<br /><em>doğal sonuçlar.</em></h2>
      </div>
    </div>
  );
}
