import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HERO_CONTENT } from '../data/mockData';

export const HeroVideo: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
      {/* 
        ========================================================================
        WHOLE HERO SECTION VIDEO BANNER
        The video plays across the entire width and height of the hero banner.
        - Desktop: Left-aligned content with a deep dark gradient scrim for readability,
                   leaving the orbiting dry fruits video clear and prominent.
        - Mobile: Centered content with bottom-to-top gradient overlay.
        ========================================================================
      */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[480px] sm:min-h-[520px] lg:min-h-[580px] flex items-center shadow-lg bg-[#1F4D2E]">
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
              className="w-full h-full object-cover object-center"
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
            Desktop Overlay Scrim:
            Rich dark gradient from left to right so text is crystal clear on the left,
            while the orbiting nuts & fruits on the right are vivid and bright.
          */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 via-45% to-black/20" />
          
          {/* Subtle top & bottom shadow gradient */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* 
            Mobile Overlay Scrim:
            Bottom-to-top gradient for centered content at the bottom.
          */}
          <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />
        </div>

        {/* 
          Hero Content Layer:
          - Desktop: Left aligned, generous padding, max-w-xl.
          - Mobile: Centered, bottom anchored.
        */}
        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 py-12 lg:py-20 flex flex-col justify-end md:justify-center items-center md:items-start text-center md:text-left h-full min-h-[480px] sm:min-h-[520px] lg:min-h-[580px]">
          <div className="max-w-xl select-none">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-[1.12] tracking-tight drop-shadow-md">
              {HERO_CONTENT.headlineTop}
              <br className="hidden md:block" />
              {' '}
              <span className="text-[#F6ECE8]">{HERO_CONTENT.headlineToBottom}</span>
            </h1>

            <p className="mt-4 text-xs sm:text-sm md:text-base lg:text-[17px] text-white/90 leading-relaxed font-sans max-w-lg drop-shadow-sm">
              {HERO_CONTENT.supportingLine}
            </p>

            <div className="mt-7 sm:mt-8">
              <Link
                to={HERO_CONTENT.ctaLink}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#D9A441] hover:bg-[#c28e31] text-[#1F4D2E] text-sm md:text-base font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{HERO_CONTENT.ctaText}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
