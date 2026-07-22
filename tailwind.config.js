/** Tokens tomados de Mookups/cuc_academic_management/DESIGN.md (sistema de diseno SGBE - CUC). */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: '#f9f9ff',
        'surface-dim': '#cfdaf1',
        'surface-bright': '#f9f9ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f0f3ff',
        'surface-container': '#e7eeff',
        'surface-container-high': '#dee8ff',
        'surface-container-highest': '#d8e3fa',
        'on-surface': '#111c2c',
        'on-surface-variant': '#43474f',
        outline: '#737780',
        'outline-variant': '#c3c6d1',
        primary: '#001e40',
        'on-primary': '#ffffff',
        'primary-container': '#003366',
        'on-primary-container': '#d5e3ff',
        secondary: '#5c5f60',
        'on-secondary': '#ffffff',
        'secondary-container': '#e1e3e4',
        'on-secondary-container': '#626566',
        tertiary: '#450008',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#6d0013',
        'on-tertiary-container': '#ffdad8',
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        exito: '#1e7d32',
        'exito-container': '#dcf5df',
        advertencia: '#8a5300',
        'advertencia-container': '#ffe6b3',
        background: '#f9f9ff',
        'on-background': '#111c2c'
      },
      fontFamily: {
        sans: ['Hanken Grotesk', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem'
      },
      boxShadow: {
        'elevation-l2': '0 4px 12px rgba(0, 51, 102, 0.05)'
      }
    }
  },
  plugins: []
};
