import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HERO_CONTENT } from '../data/mockData';

export const HeroVideo: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

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
    if (!reducedMotion && !videoError) {
      if (desktopVideoRef.current) {
        desktopVideoRef.current.play().catch(() => {});
      }
      if (mobileVideoRef.current) {
        mobileVideoRef.current.play().catch(() => {});
      }
    }
  }, [reducedMotion, videoError]);

  return (
    <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
      {/* 
        ========================================================================
        DESKTOP / TABLET HERO (768px and up)
        Ivory background #FAF6EC, rounded two-column layout:
        - Left (~42%): Dark green serif headline, supporting text, pill button
        - Right (~58%): Video cover with left edge gradient mask fading into ivory
        ========================================================================
      */}
      <div className="hidden md:flex relative rounded-3xl overflow-hidden bg-[#FAF6EC] min-h-[440px] lg:min-h-[500px] items-stretch">
        {/* Left Column (about 42% width) */}
        <div className="w-[43%] lg:w-[40%] xl:w-[38%] py-10 lg:py-16 pl-8 lg:pl-14 pr-4 flex flex-col justify-center z-10 select-none">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-[46px] xl:text-[52px] font-bold text-[#1F4D2E] leading-[1.12] tracking-tight mb-4">
            {HERO_CONTENT.headlineTop}
            <br />
            {HERO_CONTENT.headlineToBottom}
          </h1>

          <p className="text-xs md:text-sm lg:text-[15px] text-[#4A443B] leading-relaxed max-w-sm mb-7">
            {HERO_CONTENT.supportingLine}
          </p>

          <div>
            <Link
              to={HERO_CONTENT.ctaLink}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#1F4D2E] hover:bg-[#163821] text-white text-xs md:text-sm font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{HERO_CONTENT.ctaText}</span>
            </Link>
          </div>
        </div>

        {/* Right Column (about 58% width): Video with seamless gradient mask */}
        <div className="flex-1 relative overflow-hidden bg-[#FAF6EC]">
          {reducedMotion || videoError ? (
            <img
              src={HERO_CONTENT.posterDesktop}
              alt="Mewa Masala Ghar Natural Dry Fruits & Spices"
              className="w-full h-full object-cover object-center"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 12%, black 28%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 12%, black 28%)',
              }}
            />
          ) : (
            <video
              ref={desktopVideoRef}
              autoPlay
              muted
              loop
              playsInline
              poster={HERO_CONTENT.posterDesktop}
              className="w-full h-full object-cover object-center"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 12%, black 28%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 12%, black 28%)',
              }}
            >
              <source
                src={HERO_CONTENT.videoMobile}
                media="(max-width: 767px)"
                type="video/mp4"
              />
              <source
                src={HERO_CONTENT.videoDesktop}
                type="video/mp4"
              />
            </video>
          )}

          {/* Seamless edge blending overlay */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#FAF6EC] via-[#FAF6EC]/40 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* 
        ========================================================================
        MOBILE HERO (767px and below)
        Full-bleed background video, height ~70vh (min 460px),
        top-to-bottom dark gradient overlay, light text centered at bottom
        ========================================================================
      */}
      <div className="md:hidden relative rounded-2xl overflow-hidden min-h-[460px] h-[70vh] flex flex-col justify-end bg-[#1F4D2E] shadow-sm">
        {/* Full-bleed background video or fallback poster */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {reducedMotion || videoError ? (
            <img
              src={HERO_CONTENT.posterMobile}
              alt="Mewa Masala Ghar"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <video
              ref={mobileVideoRef}
              autoPlay
              muted
              loop
              playsInline
              poster={HERO_CONTENT.posterMobile}
              className="w-full h-full object-cover object-center"
            >
              <source
                src={HERO_CONTENT.videoMobile}
                media="(max-width: 767px)"
                type="video/mp4"
              />
              <source
                src={HERO_CONTENT.videoDesktop}
                type="video/mp4"
              />
            </video>
          )}

          {/* Top-to-bottom dark gradient overlay for crystal-clear readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
        </div>

        {/* Content pinned to bottom of mobile hero */}
        <div className="relative z-10 p-6 pb-8 text-center flex flex-col items-center">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight mb-2 drop-shadow-sm">
            {HERO_CONTENT.headlineTop} {HERO_CONTENT.headlineToBottom}
          </h1>

          <p className="text-xs text-white/90 leading-relaxed max-w-xs mb-5 drop-shadow-xs">
            {HERO_CONTENT.supportingLine}
          </p>

          <Link
            to={HERO_CONTENT.ctaLink}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#D9A441] hover:bg-[#C28E31] text-[#1F4D2E] text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <span>{HERO_CONTENT.ctaText}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
