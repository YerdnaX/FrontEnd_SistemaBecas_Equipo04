/**
 * Sistema cromático SGBE - CUC.
 * Paleta base: azul #427AB5, azul profundo #406AAF, amarillo #F7DD7D y crema #FFE8BE.
 * Los tonos intermedios son mezclas de estos cuatro colores y se reservan para
 * separar niveles de superficie sin introducir matices ajenos a la identidad.
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
        background: '#14283D',
        'on-background': '#FFE8BE',

        surface: '#203E5C',
        'surface-dim': '#14283D',
        'surface-bright': '#427AB5',
        'surface-container-lowest': '#14283D',
        'surface-container-low': '#19324B',
        'surface-container': '#203E5C',
        'surface-container-high': '#294D72',
        'surface-container-highest': '#315D8C',

        'on-surface': '#FFE8BE',
        'on-surface-variant': '#D7DCE0',
        outline: '#9CC3E8',
        'outline-variant': '#78A7D5',

        primary: '#FFE8BE',
        'on-primary': '#172A3D',
        'primary-container': '#F7DD7D',
        'on-primary-container': '#172A3D',

        secondary: '#427AB5',
        'on-secondary': '#FFF3DC',
        'secondary-container': '#315D8C',
        'on-secondary-container': '#FFE8BE',

        tertiary: '#FFE8BE',
        'on-tertiary': '#172A3D',
        'tertiary-container': '#2B527A',
        'on-tertiary-container': '#FFE8BE',

        error: '#9D3E48',
        'on-error': '#FFF0DF',
        'error-container': '#512D38',
        'on-error-container': '#FFD9D8',

        exito: '#D8EDC4',
        'exito-container': '#365B49',
        'on-exito-container': '#E8F6DD',

        advertencia: '#F7DD7D',
        'advertencia-container': '#5A4D27',
        'on-advertencia-container': '#FFF1BF',

        'categoria-academica': '#B9D8F4',
        'categoria-academica-container': '#294D72',
        'categoria-financiera': '#D8EDC4',
        'categoria-financiera-container': '#365B49',
        'categoria-convocatoria': '#FFE8BE',
        'categoria-convocatoria-container': '#2B527A',
        'categoria-evento': '#F7DD7D',
        'categoria-evento-container': '#5A4D27',
        'categoria-urgente': '#FFD9D8',
        'categoria-urgente-container': '#512D38',
        'categoria-general': '#D7DCE0',
        'categoria-general-container': '#3B4D5E',
        'convocatoria-destacada': '#F7DD7D',
        'convocatoria-destacada-container': '#514824'
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
        'elevation-l1': '0 1px 2px rgba(20,40,61,0.55)',
        'elevation-l2': '0 8px 24px -8px rgba(20,40,61,0.72)',
        'elevation-l3': '0 20px 48px -12px rgba(20,40,61,0.84)',
        'focus-ring': '0 0 0 3px rgba(247,221,125,0.42)'
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
