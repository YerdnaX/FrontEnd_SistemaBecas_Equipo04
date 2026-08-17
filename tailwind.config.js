/**
 * Sistema cromático SGBE - CUC.
 * Paleta base: carbón vegetal #181C14, grafito #3C3D37, salvia #697565 y marfil #ECDFCC.
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
        background: '#181C14',
        'on-background': '#ECDFCC',

        surface: '#3C3D37',
        'surface-dim': '#181C14',
        'surface-bright': '#596054',
        'surface-container-lowest': '#181C14',
        'surface-container-low': '#22271F',
        'surface-container': '#2C302A',
        'surface-container-high': '#3C3D37',
        'surface-container-highest': '#4A4D46',

        'on-surface': '#ECDFCC',
        'on-surface-variant': '#C8C1B3',
        outline: '#8B9588',
        'outline-variant': '#697565',

        primary: '#F7ECDD',
        'on-primary': '#181C14',
        'primary-container': '#ECDFCC',
        'on-primary-container': '#181C14',

        secondary: '#9BA692',
        'on-secondary': '#181C14',
        'secondary-container': '#3C3D37',
        'on-secondary-container': '#ECDFCC',

        tertiary: '#D2C9B9',
        'on-tertiary': '#181C14',
        'tertiary-container': '#465044',
        'on-tertiary-container': '#ECDFCC',

        error: '#E2BFAF',
        'on-error': '#181C14',
        'error-container': '#493A34',
        'on-error-container': '#F0D2C3',

        exito: '#BFCBB7',
        'exito-container': '#344236',
        'on-exito-container': '#DCE6D5',

        advertencia: '#E0CDAF',
        'advertencia-container': '#4A4233',
        'on-advertencia-container': '#F0DFC4',

        'categoria-academica': '#D5D8C9',
        'categoria-academica-container': '#384038',
        'categoria-financiera': '#BFCBB7',
        'categoria-financiera-container': '#344236',
        'categoria-convocatoria': '#D9CEC0',
        'categoria-convocatoria-container': '#46413B',
        'categoria-evento': '#E0CDAF',
        'categoria-evento-container': '#4A4233',
        'categoria-urgente': '#E2BFAF',
        'categoria-urgente-container': '#493A34',
        'categoria-general': '#C8C1B3',
        'categoria-general-container': '#3C3D37',
        'convocatoria-destacada': '#ECDFCC',
        'convocatoria-destacada-container': '#465044'
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
        'elevation-l1': '0 1px 2px rgba(24,28,20,0.55)',
        'elevation-l2': '0 8px 24px -8px rgba(24,28,20,0.72)',
        'elevation-l3': '0 20px 48px -12px rgba(24,28,20,0.84)',
        'focus-ring': '0 0 0 3px rgba(236,223,204,0.4)'
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
