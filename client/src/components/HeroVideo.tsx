import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
        FULL SCREEN FIT HERO SECTION
        - Height fitted to viewport: h-[calc(100vh-130px)] min-h-[520px] max-h-[880px]
        - Centered grand typography and call-to-action
        - Balanced cinematic overlay so text is crisp and orbiting video is prominent
        ========================================================================
      */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden w-full h-[calc(100vh-130px)] min-h-[520px] max-h-[880px] flex items-center justify-center shadow-lg bg-[#1F4D2E]">
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
            Balanced Center Overlay Scrim:
            Translucent dark tint + radial & vertical gradients so centered text
            has maximum readability while the orbiting nuts & fruits shine through.
          */}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/45" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.55) 100%)',
            }}
          />
        </div>

        {/* 
          Centered Hero Content Layer:
          Grand serif headline, supporting line, and primary gold CTA.
        */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center text-center select-none">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[52px] font-bold text-white leading-tight tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] max-w-3xl mx-auto">
            <span>{HERO_CONTENT.headlineTop}</span>{' '}
            <span className="text-[#FAF6EC]">{HERO_CONTENT.headlineToBottom}</span>
          </h1>

          <p className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-base lg:text-lg text-white/95 leading-relaxed font-sans max-w-xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] font-normal">
            {HERO_CONTENT.supportingLine}
          </p>

          <div className="mt-7 sm:mt-9 flex items-center justify-center">
            <Link
              to={HERO_CONTENT.ctaLink}
              className="group relative inline-flex items-center gap-3 pl-8 pr-3 py-3 rounded-full bg-[#1F4D2E] hover:bg-[#163821] text-[#FAF6EC] border border-[#D9A441] shadow-[0_8px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_32px_rgba(217,164,65,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
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
      </div>
    </section>
  );
};
