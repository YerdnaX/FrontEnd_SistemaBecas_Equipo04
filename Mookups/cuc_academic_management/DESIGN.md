---
name: CUC Academic Management
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf1'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fa'
  on-surface: '#111c2c'
  on-surface-variant: '#43474f'
  inverse-surface: '#263142'
  inverse-on-surface: '#ebf1ff'
  outline: '#737780'
  outline-variant: '#c3c6d1'
  surface-tint: '#3a5f94'
  primary: '#001e40'
  on-primary: '#ffffff'
  primary-container: '#003366'
  on-primary-container: '#799dd6'
  inverse-primary: '#a7c8ff'
  secondary: '#5c5f60'
  on-secondary: '#ffffff'
  secondary-container: '#e1e3e4'
  on-secondary-container: '#626566'
  tertiary: '#450008'
  on-tertiary: '#ffffff'
  tertiary-container: '#6d0013'
  on-tertiary-container: '#ff6b6e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#1f477b'
  secondary-fixed: '#e1e3e4'
  secondary-fixed-dim: '#c5c7c8'
  on-secondary-fixed: '#191c1d'
  on-secondary-fixed-variant: '#454748'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#ffb3b1'
  on-tertiary-fixed: '#410007'
  on-tertiary-fixed-variant: '#92001c'
  background: '#f9f9ff'
  on-background: '#111c2c'
  surface-variant: '#d8e3fa'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system is engineered for the Student Scholarship Management System (SGBE) of the Colegio Universitario de Cartago. It prioritizes institutional authority, transparency, and clarity to support students through critical administrative journeys.

The aesthetic follows a **Modern Corporate** approach with a strong emphasis on **Minimalism**. The interface utilizes generous whitespace to reduce cognitive load during complex form-filling processes. The visual language is sober and structured, reflecting the reliability of a public academic institution while maintaining a contemporary, accessible feel for a digital-native student body.

## Colors
The palette is rooted in institutional tradition and functional signaling:
- **Primary (#003366):** Used for navigation, headers, and primary actions. It establishes trust and stability.
- **Secondary/Surface (#F8F9FA):** The foundation for the UI. Large expanses of this soft gray prevent eye fatigue and differentiate content blocks from the pure white background.
- **Accent/Error (#C8102E):** A sober red reserved for critical alerts, "Rejected" status indicators, and high-priority system notifications.
- **Neutral (#4A5568):** Used for secondary text and icons to ensure high contrast against light surfaces without the harshness of pure black.

## Typography
**Hanken Grotesk** is the sole typeface for this design system. It was chosen for its precise, contemporary geometry and exceptional legibility in data-dense environments. 

Headlines utilize a tighter letter spacing and heavier weights to create a strong information hierarchy. Body text is set with generous line heights (1.5 - 1.6) to ensure that lengthy scholarship requirements and academic policies remain approachable and readable. Labels use slightly increased tracking and medium weights to remain distinct even at smaller scales.

## Layout & Spacing
The layout follows a **Fixed Grid** model on desktop for administrative dashboards, centering content to maintain focus. On smaller screens, the system transitions to a fluid model with 16px safe-area margins.

A strict 8px spacing scale is used for all internal component dimensions. Large sections and card containers should utilize 32px or 48px of vertical padding to maintain the "plenty of whitespace" requirement, ensuring the UI feels airy despite being document-heavy.

## Elevation & Depth
Depth is created through **Tonal Layers** and subtle **Ambient Shadows**. 
- **Base Level (Level 0):** Pure white background (#FFFFFF).
- **Surface Level (Level 1):** Soft gray (#F8F9FA) containers used for page sections or sidebar backgrounds.
- **Elevated Level (Level 2):** White cards with a very soft, diffused shadow (Offset: 0, 4px; Blur: 12px; Color: rgba(0, 51, 102, 0.05)).
- **Interactive Level (Level 3):** Active components like modals or dropdowns use a more pronounced shadow to indicate focus and separation from the primary data layer.

## Shapes
The design system employs **Soft** roundedness. A standard 0.25rem (4px) radius is used for inputs and small buttons, while 0.5rem (8px) is applied to cards and modal containers. This subtle rounding provides a modern touch while maintaining the professional, institutional rigor expected of an academic management system.

## Components
- **Buttons:** Primary buttons are solid #003366 with white text. Secondary buttons use a #003366 outline with a transparent background. No gradients or heavy roundedness.
- **Status Badges:** Use a "Pill" shape with a low-opacity background tint and high-contrast text.
  - *Pending:* Amber/Gold
  - *Sent/In Review:* Institutional Blue
  - *Approved:* Emerald Green
  - *Rejected:* Sober Red (#C8102E)
- **Input Fields:** Minimalist with a 1px border (#E2E8F0). Focus state is a 2px #003366 border. Error states use the #C8102E accent.
- **Modern Tables:** No vertical borders. Header rows use #F8F9FA with semi-bold labels. Rows have a subtle hover effect (5% Primary color tint) for row tracking.
- **Progress Bars:** Thin (4px - 8px) with a #F8F9FA track and solid #003366 fill.
- **Cards:** White background, Level 2 elevation, 12px internal padding for information density, or 24px for dashboard summaries.
- **Iconography:** Use 24px line icons with a 1.5px stroke weight. Avoid filled icons unless used for active navigation states.