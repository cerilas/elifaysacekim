# Follicle — standalone scroll-driven section

A working React / React Three Fiber / Three.js / GSAP section with seven scroll chapters, procedural scalp and graft geometry, instanced hair, a cylindrical punch, scroll-driven graft transfer, angled implantation, and staggered hair growth. No purchased assets or video.

## Run

Requires Node 20.19+ or 22.12+.

```sh
npm ci
npm run dev
npm run build
npm test
npx playwright install chromium
npx playwright test
```

## Integrate

Copy `src/HairTransplantSection.jsx`, `src/Scene.jsx`, `src/story.js`, and `src/style.css` into your React application. Install the dependencies listed in package.json (React and React DOM are usually already installed).

```jsx
import HairTransplantSection from './HairTransplantSection';

<HairTransplantSection analysisHref="/hair-analysis" />
// Or provide your consultation modal callback:
<HairTransplantSection onAnalysisRequest={() => setAnalysisOpen(true)} />
```

The default CTA is intentionally inert until an href or callback is provided. The demo's Follicle wordmark and eyebrow live inside the section and can be replaced directly. No other website sections are included. In an SSR application, mount this component on the client (e.g. a Next.js dynamic import with `ssr: false`). Avoid putting the pinned section inside a transformed ancestor.

## Animation and rendering

- One 0–1 scroll value drives scene state, camera, text, light, particles, and progress indicators.
- GSAP scrub 0.65; four viewports of pinned travel plus one viewport of content gives approximately 500vh total.
- Geometry is calculated deterministically from progress; reverse scrolling retraces the same path.
- 620 instanced hairs on desktop, 240 on narrow or low-capability devices; additional reduction after sustained slow active frames.
- Canvas loads near the viewport. Rendering is demand-based and stops after scroll scrubbing settles.
- Capped DPR, no shadow maps, no postprocessing, no external 3D textures. Ground depth uses an inexpensive soft CSS shadow.
- Reduced-motion preference removes pinning and camera travel, opens on the final still, and allows explicit chapter selection.
- WebGL error boundary/fallback keeps the explanatory chapters available.
- Styles are scoped to `.ht-section`; only the demo HTML resets body margin. DM Sans is requested from Google Fonts, with system fallbacks. Self-host it or remove the import for deployments with strict external-resource policies.

## Validation and limitations

Unit tests cover the timeline, reversibility, stage continuity, and a placement angle of approximately 38 degrees relative to the surface. Playwright covers all seven chapters, reverse scrolling, resize to 390×844, horizontal overflow, CTA visibility, runtime console errors, and reduced-motion chapter navigation. Desktop and mobile screenshots were visually reviewed.

This is a conceptual procedural medical visualization: the scalp is a curved tissue patch rather than a scanned human head; the macro view uses a translucent cutaway. It is not anatomical or clinical training material. The timeline compresses transfer and growth for explanation and does not claim a clinical growth schedule. A surgeon should review the medical copy and visuals before publication.

60 FPS on real iPhones and Android flagships has not been measured. Validate on the actual deployment's device/browser matrix. Three.js is a substantial deferred download (~234 KB gzipped for the scene bundle); retain lazy loading. The production build may report a bundle-size advisory, not an error.

Technical references: [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and [React Three Fiber performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance).
