import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PortraitScrollTransition } from './PortraitScrollTransition';
import { ElifAyGallerySection } from './gallery';
import RestorationJourney from './restoration/RestorationJourney';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main>
      <PortraitScrollTransition
        name="Elif Ay"
        title="Saç ekim uzmanı"
        portraitSrc="/gallery/elif-ay-clinic-standing.webp"
        portraitPosition="50% 30%"
      />
      <ElifAyGallerySection />
      <RestorationJourney />
    </main>
  </StrictMode>
);
