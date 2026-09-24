import { useRef, useState, useEffect } from 'react';
import { ReelCard, type ReelData } from './ReelCard';
import type { Language } from '../../i18n';

interface ReelsCarouselProps {
  reels: ReelData[];
  currentLang?: Language;
}

export function ReelsCarousel({ reels, currentLang = 'tr' }: ReelsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const dragDistance = useRef(0);

  // Wheel horizontal scroll
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    if (e.deltaY !== 0 && e.deltaX === 0) {
      const isAtLeft = el.scrollLeft <= 0;
      const isAtRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

      if ((e.deltaY > 0 && !isAtRight) || (e.deltaY < 0 && !isAtLeft)) {
        el.scrollLeft += e.deltaY;
      }
    }
  };

  const scrollByOffset = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const scrollToCard = (index: number) => {
    // If was dragging significantly, ignore click activate
    if (dragDistance.current > 10) return;

    const el = scrollRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    if (children[index]) {
      const childCenter = children[index].offsetLeft + children[index].offsetWidth / 2;
      const targetScrollLeft = childCenter - el.clientWidth / 2;
      el.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
    dragDistance.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.8;
    dragDistance.current = Math.abs(walk);
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Track active index based on card proximity to container center
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let rafId: number;

    const calculateActiveIndex = () => {
      const containerCenter = el.scrollLeft + el.clientWidth / 2;
      const children = Array.from(el.children) as HTMLElement[];

      let minDistance = Infinity;
      let closestIndex = 0;

      children.forEach((child, index) => {
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const distance = Math.abs(containerCenter - childCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(calculateActiveIndex);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    calculateActiveIndex();

    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [activeIndex]);

  return (
    <div className="reels-carousel-wrapper">
      {/* Navigation Buttons (Desktop) */}
      <button
        type="button"
        onClick={() => scrollByOffset(-320)}
        className="reels-nav-btn reels-nav-btn--prev"
        aria-label="Önceki video"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => scrollByOffset(320)}
        className="reels-nav-btn reels-nav-btn--next"
        aria-label="Sonraki video"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Reel Cards Container */}
      <div
        ref={scrollRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`reels-scroll-container ${isDragging ? 'is-dragging' : ''}`}
      >
        {reels.map((reel, index) => (
          <ReelCard
            key={reel.id}
            reel={reel}
            isActive={index === activeIndex}
            onActivate={() => scrollToCard(index)}
            currentLang={currentLang}
          />
        ))}
      </div>
    </div>
  );
}
