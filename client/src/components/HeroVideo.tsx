import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HERO_CONTENT } from '../data/mockData';

export const HeroVideo: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [heroHeight, setHeroHeight] = useState<string>('calc(100vh - 110px)');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Exact viewport height calculation to fit all screen sizes and resolutions with 0px gap
  useEffect(() => {
    const updateExactHeight = () => {
      const header = document.querySelector('header');
      const headerBottom = header ? header.getBoundingClientRect().bottom : 110;

      // On mobile screens (< 768px), check if fixed bottom nav exists
      const bottomNav = document.querySelector('nav.fixed.bottom-0');
      const bottomNavHeight =
        bottomNav && window.innerWidth < 768
          ? bottomNav.getBoundingClientRect().height
          : 0;

      // Exact pixel height from the bottom of header to the bottom of visible viewport
      const exactHeight = Math.max(340, window.innerHeight - Math.max(0, headerBottom) - bottomNavHeight);
      setHeroHeight(`${exactHeight}px`);
    };

    updateExactHeight();
    window.addEventListener('resize', updateExactHeight);
    window.addEventListener('orientationchange', updateExactHeight);

    // Observe header resize dynamically (e.g. mobile search toggle, zoom/scaling changes)
    const header = document.querySelector('header');
    let ro: ResizeObserver | null = null;
    if (header && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => updateExactHeight());
      ro.observe(header);
    }

    return () => {
      window.removeEventListener('resize', updateExactHeight);
      window.removeEventListener('orientationchange', updateExactHeight);
      if (ro) ro.disconnect();
    };
  }, []);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Ensure autoplay starts reliably
  useEffect(() => {
    if (!reducedMotion && !videoError && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback handled gracefully
      });
    }
  }, [reducedMotion, videoError]);

  return (
    <section
      style={{ height: heroHeight }}
      className="relative w-full m-0 p-0 rounded-none overflow-hidden flex items-center justify-center bg-[#13301D] select-none transition-[height] duration-75"
    >
      {/* Full-bleed background video / poster fallback */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {reducedMotion || videoError ? (
          <img
            src={HERO_CONTENT.posterDesktop}
            alt="Mewa Masala Ghar Natural Dry Fruits & Spices"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_CONTENT.posterDesktop}
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover object-center pointer-events-none"
          >
            <source
              src={HERO_CONTENT.videoDesktop}
              type="video/mp4"
            />
            <source
              src={HERO_CONTENT.videoMobile}
              type="video/mp4"
            />
          </video>
        )}

        {/* 
          Balanced Center Overlay Scrim:
          Translucent dark tint + radial & vertical gradients so centered text
          has maximum readability while the orbiting nuts & fruits shine through.
        */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.6) 100%)',
          }}
        />
      </div>

      {/* 
        Centered Hero Content Layer:
        Grand serif headline, supporting line, and primary gold CTA.
      */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col items-center justify-center text-center">
        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight drop-shadow-[0_4px_28px_rgba(0,0,0,0.8)] max-w-4xl mx-auto">
          <span>{HERO_CONTENT.headlineTop}</span>{' '}
          <span className="text-[#FAF6EC]">{HERO_CONTENT.headlineToBottom}</span>
        </h1>

        <p className="mt-3 sm:mt-4 md:mt-5 text-xs sm:text-sm md:text-base lg:text-lg text-white/95 leading-relaxed font-sans max-w-2xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] font-normal">
          {HERO_CONTENT.supportingLine}
        </p>

        <div className="mt-6 sm:mt-8 flex items-center justify-center">
          <Link
            to={HERO_CONTENT.ctaLink}
            className="group relative inline-flex items-center gap-3 pl-7 sm:pl-9 pr-3 sm:pr-3.5 py-3 sm:py-3.5 rounded-full bg-[#1F4D2E] hover:bg-[#163821] text-[#FAF6EC] border border-[#D9A441] shadow-[0_8px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_32px_rgba(217,164,65,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="font-serif text-sm sm:text-base font-semibold tracking-wide">
              {HERO_CONTENT.ctaText}
            </span>
            <span className="w-8 h-8 rounded-full bg-[#D9A441] text-[#1F4D2E] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shadow-xs">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
