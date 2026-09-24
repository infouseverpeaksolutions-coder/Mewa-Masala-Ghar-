/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          primary: 'var(--theme-primary, #2F5D3A)',
          primaryHover: 'var(--theme-primary-hover, #1F4D2E)',
          accent: 'var(--theme-accent, #D9A441)',
          accentHover: 'var(--theme-accent-hover, #C28E31)',
          bg: 'var(--theme-bg, #FAF6EC)',
          text: 'var(--theme-text, #2B2B2B)',
          card: 'var(--theme-card, #FFFFFF)',
          border: 'var(--theme-border, #E7E0D0)',
          badgeBg: 'var(--theme-badge-bg, #EAF2EC)',
          badgeText: 'var(--theme-badge-text, #2F5D3A)',
          tint: 'var(--theme-tint, #EAF2EC)',
        },
        brand: {
          forest: '#2F5D3A',
          forestDark: '#1F4D2E',
          forestDeep: '#183B23',
          gold: '#D9A441',
          goldHover: '#C28E31',
          goldLight: '#F5E6C8',
          goldCream: '#F7EBD2',
          ivory: '#FAF6EC',
          charcoal: '#2B2B2B',
          sand: '#E7E0D0',
          skyBlue: '#5DB4D6',
          skyBlueTint: '#E6F4FA',
          babyPeach: '#F4A261',
          rose: '#E0808C',
          roseTint: '#FCE9EC',
          careSand: '#C7926B',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(47, 93, 58, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        card: '0 10px 25px -5px rgba(31, 77, 46, 0.07), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
        glow: '0 0 25px -5px rgba(217, 164, 65, 0.25)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',    // 16px
        '3xl': '1.5rem',  // 24px
        'full': '9999px',
      },
      maxWidth: {
        'content': '100%',
        '7xl': '100%',
      },
    },
  },
  plugins: [],
};
