# Folia · Hair restoration hero

A complete React / TypeScript implementation of a real-time WebGL hair restoration hero. The demo uses a fictional Folia identity that you can replace. The 3D scene is procedural, with no video, downloaded models, remote environment maps, or font requests.

## Run

Use Node.js 22.12 or newer (developed with Node 24).

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. Scroll through the hero, or use the chapter buttons to jump to a stage. To build for hosting:

```sh
npm run build
npm run preview
```

Serve the resulting `dist/` directory over HTTP. Opening `index.html` as a `file://` URL is not supported by browser module loading. The source includes its dependency lockfile; the `dist/` folder is also included in the delivery archive.

## Embed

Copy `src/components/hair-hero/` into your React project and install the dependencies from this project's `package.json`. The tested combination is React / React DOM 19.2.8, Three.js 0.186.0, R3F 9.7.0, drei 10.7.8, and GSAP 3.15.0. Keep React and React DOM aligned. R3F 9.7.0 currently declares a peer range below React 19.3.

```tsx
import { HairTransplantHero } from './components/hair-hero';

export default function Home() {
  return (
    <main>
      <HairTransplantHero />
      <section>Your next section</section>
    </main>
  );
}
```

The component owns a **300svh** section and pins its **100svh** stage for **200svh of travel**. It includes the height of the pinned viewport in that 300svh total. Do not put it inside another pinned section, a transformed ancestor, an overflow-scrolling wrapper, or a fixed-height container. It uses the document's native scroll position. When external fonts, accordions, or preceding content change the page layout, call your application's `ScrollTrigger.refresh()` after that layout settles.

`HairHero` is also exported as an alias. `hair-hero.css` is imported by the component and scoped with `hh-` class names. `site.css`, the demonstration header, and the next section are optional demo presentation; they are not required to embed the component. For a framework that requires global CSS imports in a root layout, move the `hair-hero.css` import to that layout. The component has a `use client` boundary, loads the Three.js scene lazily after mounting, and accesses browser APIs in effects.

### Headline and CTA

All text and controls are HTML outside the canvas. Approximately 40% of the desktop viewport stays available for that content. Mobile moves the scene beneath the copy.

```tsx
<HairTransplantHero
  eyebrow="Your clinic's approach"
  headline={<>A new chapter.<br /><em>Rooted in you.</em></>}
  description="Your clinic's approved introductory copy."
  ctaLabel="Book a consultation"
  ctaHref="/consultation"
/>
```

For complete control over the left-hand content, supply children:

```tsx
<HairTransplantHero>
  <p className="hh-eyebrow">Your clinic</p>
  <h1>Your headline</h1>
  <p className="hh-description">Your supporting copy.</p>
  <a className="hh-cta" href="/consultation">Book a consultation</a>
</HairTransplantHero>
```

Optional props: `className`, `children`, `eyebrow`, `headline`, `description`, `ctaLabel`, `ctaHref`, and `onRenderError(error)`. Without `ctaHref`, the default CTA jumps to the channel reveal. In static mode it continues below the hero. No booking form, tracking, messaging, or backend integration is included.

## Scene structure

```text
src/components/hair-hero/
  HairHero.tsx                 HTML, accessibility, lazy scene, fallback
  hair-hero.css               Scoped desktop/mobile composition
  index.ts                    Public exports
  types.ts                    Shared scene state
  animation/
    timeline.ts               Deterministic, reversible GSAP timeline
    useScrollProgress.ts      One owned ScrollTrigger, pin and progress
    useHeroEnvironment.ts     Viewport, visibility and motion preference
  scene/
    HeroCanvas.tsx            Canvas, adaptive resolution, context lifecycle
    Scalp.tsx                 Curved skin, tissue, recipient channel, closure
    Follicle.tsx              Instanced follicle field and transplant graft
    HairStrand.tsx            Tapered curved strands, shader growth and sway
    Particles.tsx             Scroll-driven particles, target and ripple
    Lighting.tsx              Studio lights and generated environment
    CameraRig.tsx             Scroll camera plus bounded mouse offset
    geometry.ts               Seeded placements and procedural geometry
```

## Scroll sequence

| Progress | Action |
| --- | --- |
| 0–20% | Macro opening with minimal drift and strand movement |
| 20–40% | Approach, downward tilt, and gradual skin transparency |
| 40–60% | Cross-sectional reveal and a softly highlighted empty channel |
| 60–75% | A graft descends precisely into the channel |
| 75–90% | Bulb brightens, tissue ripples, particles rise, and the new strand grows |
| 90–100% | Skin opacity is restored and the camera pulls back to the final composition |

GSAP animates a shared numeric state object. R3F reads it without rebuilding geometry or setting React state each frame. `scrub: true` synchronizes the timeline directly to scroll, without delayed playback. Reverse scrolling reverses placement, growth, lighting, particles, ripple, and skin closure. Only the tiny desktop drift and hair sway depend on elapsed time.

The graft grows about 2.5 **illustrative scene units**, not a measurement of real hair growth or a claim about treatment duration. The demo visibly identifies the animation as illustrative in the next section and provides a screen-reader explanation in the hero.

## Rendering and accessibility

- Desktop: 19 existing follicles plus one graft. Mobile below 768px: 11 plus one graft, lower geometry resolution, no skin transmission, and no automatic sway or parallax.
- Repeated bulbs, shafts, sheaths, and strands each use one instanced draw. Particles use one points draw. No shadows, bloom, full-screen postprocessing, large textures, or external image assets.
- The only texture is a seeded 128×128 procedural noise texture. The lighting environment is generated once at 128px on desktop or 64px on mobile.
- Pixel ratio starts at no more than 1.5 on desktop and 1.15 on mobile, capped by the device ratio. drei's performance monitor reduces it down to 0.8 when sustained rendering falls below its frame-rate threshold. It does not repeatedly raise quality and cause oscillation.
- Mouse offset is separately smoothed and clamped to X ±0.15 and Y ±0.10; it never mutates the scroll camera state.
- IntersectionObserver plus document visibility pauses rendering outside the viewport or in a hidden tab. Rendering resumes when visible.
- `prefers-reduced-motion` removes pinning and scroll animation, displays the completed scene, disables ambient movement and particles, and uses on-demand rendering. Runtime preference changes are supported.
- The HTML headline and CTA remain available before the WebGL bundle loads. A static CSS illustration remains available if loading or WebGL initialization fails; failed rendering also removes the long pinned sequence. A lost WebGL context pauses rendering, and restoration remounts the scene.
- Each hero cleans up its own ScrollTrigger, timeline, observers, pointer listeners, context listeners, and GPU resources. It never calls `ScrollTrigger.killAll()`.

60fps is the performance target, not a guarantee across devices. In a short 2.5-second local production-build sample on Apple M3 with Chromium / ANGLE Metal, the opening scene rendered approximately 106fps at a 1440×1000 viewport and DPR 1.5. It used 19 draw calls and approximately 57,600 submitted triangles per frame, including the transmission pass. This is a desktop sample, not a mobile or Safari benchmark. Profile on the clinic's target iPhone, Android, Safari, and desktop hardware before deployment, especially after adding other graphics or third-party scripts to the page.

## Verification

```sh
npm test
npx playwright install chromium
npm run test:browser
npm run build
```

The mathematical tests check scroll reversibility, direct seeks, phase boundaries, follicle spacing, and the real channel opening. Browser tests check scrolling, responsive layout, rendering suspension, reduced motion, Strict Mode mount/unmount cleanup, and the no-WebGL fallback. A separate fixture exercises lifecycle behavior without affecting the demo.

The implementation follows [GSAP ScrollTrigger's pin/scrub lifecycle](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and [R3F's rendering, resource sharing, and instancing guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

## Additional clinic sections

`src/components/clinic-sections/ClinicSections.tsx` adds two scroll-driven sections after the original philosophy section:

- `SpecialistSection`: Elif Ay introduction, scrubbed portrait reveal, image scale and staggered copy. Supply the actual photograph with `<SpecialistSection name="Elif Ay" portraitSrc="/images/elif-ay.webp" />`. No photograph was provided, so the demo currently displays an explicitly labelled neutral portrait area rather than a fabricated photo of Elif Ay.
- `TreatmentsSection`: a pinned 300svh section presenting hair, eyebrow and beard transplantation. Scroll or select a chapter to morph an instanced real-time 3D strand arrangement. Copy is Turkish. Reduced-motion mode removes pinning and supports direct selection; the renderer pauses outside the viewport.

Both sections clean up their own GSAP contexts and ScrollTriggers. Their CSS is scoped independently of the original hero.
