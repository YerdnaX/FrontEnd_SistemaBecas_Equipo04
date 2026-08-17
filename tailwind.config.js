/**
 * Design tokens SGBE - CUC (identidad 2026).
 * Paleta base: #2F2FE4 (primary) · #162E93 (secondary) · #1A1953 (surface) · #080616 (background).
 * Los NOMBRES de los tokens se mantienen respecto a la versión anterior a propósito: todas las
 * pantallas ya consumen estas clases (bg-primary-container, text-on-surface-variant, etc.), así que
 * repintar la app es, en su mayoría, cambiar los VALORES aquí — no editar cada archivo.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    borderRadius: {
      none: '0',
      sm: '0.375rem',
      DEFAULT: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.5rem',
      full: '9999px'
    },
    extend: {
      colors: {
        background: '#080616',
        'on-background': '#f1f1fb',

        surface: '#1a1953',
        'surface-dim': '#100e30',
        'surface-bright': '#2e2b7a',
        'surface-container-lowest': '#0c0a24',
        'surface-container-low': '#120f38',
        'surface-container': '#1a1953',
        'surface-container-high': '#232064',
        'surface-container-highest': '#2c2874',

        'on-surface': '#e9e9f8',
        'on-surface-variant': '#a6a8cc',
        outline: '#4a4790',
        'outline-variant': '#2a2760',

        primary: '#4f4fff',
        'on-primary': '#ffffff',
        'primary-container': '#2f2fe4',
        'on-primary-container': '#ffffff',

        secondary: '#162e93',
        'on-secondary': '#ffffff',
        'secondary-container': '#22337a',
        'on-secondary-container': '#c7d0f5',

        tertiary: '#7c5cfc',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#2a2064',
        'on-tertiary-container': '#d9ccff',

        error: '#ef4444',
        'on-error': '#ffffff',
        'error-container': '#3a1520',
        'on-error-container': '#fca5a5',

        exito: '#22c55e',
        'exito-container': '#12301f',
        'on-exito-container': '#86efac',

        advertencia: '#f59e0b',
        'advertencia-container': '#332510',
        'on-advertencia-container': '#fcd34d',

        'categoria-academica': '#5b8def',
        'categoria-academica-container': '#16223f',
        'categoria-financiera': '#2dd4bf',
        'categoria-financiera-container': '#0f2e2c',
        'categoria-convocatoria': '#b48cf5',
        'categoria-convocatoria-container': '#241c3d',
        'categoria-evento': '#fb923c',
        'categoria-evento-container': '#3a2410',
        'categoria-urgente': '#fb7185',
        'categoria-urgente-container': '#3a1622',
        'categoria-general': '#9aa3c7',
        'categoria-general-container': '#20233a',
        'convocatoria-destacada': '#facc15',
        'convocatoria-destacada-container': '#332b0a'
      },
      fontFamily: {
        sans: ['Hanken Grotesk', 'sans-serif']
      },
      fontSize: {
        display: ['2.75rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'headline-lg': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'headline-md': ['1.5rem', { lineHeight: '1.3' }],
        'headline-sm': ['1.25rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body-md': ['1rem', { lineHeight: '1.5' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'label-md': ['0.875rem', { lineHeight: '1', letterSpacing: '0.01em' }],
        'label-sm': ['0.75rem', { lineHeight: '1' }],
        button: ['0.875rem', { lineHeight: '1', letterSpacing: '0.02em' }]
      },
      maxWidth: {
        'container-max': '80rem'
      },
      boxShadow: {
        'elevation-l1': '0 1px 2px rgba(0,0,0,0.5)',
        'elevation-l2': '0 8px 24px -8px rgba(0,0,0,0.55)',
        'elevation-l3': '0 20px 48px -12px rgba(0,0,0,0.65)',
        'focus-ring': '0 0 0 3px rgba(79,79,255,0.45)'
      },
      transitionDuration: {
        DEFAULT: '160ms'
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(.4,0,.2,1)'
      }
    }
  },
  plugins: []
};
