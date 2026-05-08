---
name: Am-fe
colors:
  surface: "#f8f9fb"
  surface-dim: "#d9dadc"
  surface-bright: "#f8f9fb"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f3f4f6"
  surface-container: "#edeef0"
  surface-container-high: "#e7e8ea"
  surface-container-highest: "#e1e2e4"
  on-surface: "#191c1e"
  on-surface-variant: "#5c3f41"
  inverse-surface: "#2e3132"
  inverse-on-surface: "#f0f1f3"
  outline: "#906f70"
  outline-variant: "#e5bdbe"
  surface-tint: "#be0038"
  primary: "#ff385c"
  on-primary: "#ffffff"
  primary-container: "#e21e4a"
  on-primary-container: "#fffbff"
  inverse-primary: "#ffb2b6"
  secondary: "#575e70"
  on-secondary: "#ffffff"
  secondary-container: "#d9dff5"
  on-secondary-container: "#5c6274"
  tertiary: "#555c6a"
  on-tertiary: "#ffffff"
  tertiary-container: "#6e7583"
  on-tertiary-container: "#fefcff"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#ffdada"
  primary-fixed-dim: "#ffb2b6"
  on-primary-fixed: "#40000d"
  on-primary-fixed-variant: "#920029"
  secondary-fixed: "#dce2f7"
  secondary-fixed-dim: "#c0c6db"
  on-secondary-fixed: "#141b2b"
  on-secondary-fixed-variant: "#404758"
  tertiary-fixed: "#dce2f3"
  tertiary-fixed-dim: "#c0c7d6"
  on-tertiary-fixed: "#151c27"
  on-tertiary-fixed-variant: "#404754"
  background: "#f8f9fb"
  on-background: "#191c1e"
  surface-variant: "#e1e2e4"
typography:
  h1:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: "800"
    lineHeight: "1.2"
    letterSpacing: -0.02em
  h2:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: "700"
    lineHeight: "1.2"
    letterSpacing: -0.01em
  h3:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: "700"
    lineHeight: "1.3"
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: "400"
    lineHeight: "1.6"
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: "400"
    lineHeight: "1.6"
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: "500"
    lineHeight: "1.5"
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: "700"
    lineHeight: "1"
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1440px
  gutter: 24px
  margin-page: 48px
  section-gap: 80px
---

## Brand & Style

This design system is built for **Am-fe**, a premium real estate and property analytics platform. The brand personality is authoritative yet accessible, positioning itself as a high-end tool for professionals who value precision and clarity.

The visual style is **Minimalism with a High-End Editorial Edge**. It leverages expansive white space to reduce cognitive load and allow high-quality property imagery and complex data to breathe. The aesthetic relies on structural integrity—using light gray borders for containment rather than heavy shadows—resulting in a UI that feels architectural, modern, and exceptionally clean.

## Colors

The palette is dominated by a stark, clinical white base to maximize the "Elite" feel.

- **Primary (#ff385c):** A vibrant, energetic accent used sparingly for calls-to-action, status indicators, and critical highlights. It provides a sharp contrast against the neutral backdrop.
- **Secondary (#111827):** A deep charcoal used for primary text and high-level navigation to ensure grounded readability.
- **Neutral/Border (#f3f4f6):** The structural backbone of the design system. It is used for all dividers, card strokes, and subtle surface backgrounds to create soft separation without adding visual weight.

## Typography

The typography is powered exclusively by **Manrope**, chosen for its geometric precision and modern terminal cuts.

- **Headlines:** Use tighter letter spacing and heavier weights (Bold/ExtraBold) to create a sense of importance and "Elite" branding.
- **Body:** Standardized at 16px for optimal legibility, utilizing a generous line-height (1.6) to support the minimalist aesthetic.
- **Labels:** Small-scale metadata uses uppercase styling with increased letter spacing to differentiate data points from narrative text.

## Layout & Spacing

The design system utilizes a **Fixed Grid** model for desktop views, centered within a 1440px container to maintain control over line lengths and white space.

- **The 8px Rhythm:** All spacing (padding, margins, gaps) must be a multiple of 8px.
- **Whitespace as a Feature:** Vertical gaps between major sections are intentionally large (80px+) to prevent the interface from feeling "crowded" with data.
- **Grid:** A 12-column system with 24px gutters is the standard for dashboard layouts and property listings.

## Elevation & Depth

This design system eschews traditional heavy shadows in favor of **Low-Contrast Outlines**.

- **Flat Hierarchy:** Depth is primarily communicated through color layering (using #f3f4f6 backgrounds for "lower" levels and pure #ffffff for "raised" interactive cards).
- **Ghost Borders:** Elements are defined by 1px solid borders in #f3f4f6.
- **Subtle Interaction:** On hover, a card may transition from a 1px #f3f4f6 border to a very soft, diffused ambient shadow (0px 10px 20px rgba(0,0,0,0.04)) to indicate interactivity without breaking the clean, flat aesthetic.

## Shapes

The shape language is **Rounded (Level 2)**. This balance avoids the clinical coldness of sharp corners while maintaining more professional discipline than fully pill-shaped "playful" systems.

- **Buttons & Inputs:** 0.5rem (8px) corner radius.
- **Property Cards:** 1rem (16px) corner radius to soften large imagery.
- **Selection Indicators:** Use a subtle 4px radius for internal elements like checkbox markers.

## Components

- **Buttons:** Primary buttons use a solid #ff385c fill with white text. Secondary buttons use a white fill with a #f3f4f6 border and #111827 text.
- **Input Fields:** Minimalist containers with a 1px #f3f4f6 border. On focus, the border shifts to #111827 (not the primary color) to maintain a sophisticated feel.
- **Cards:** White background, 1px #f3f4f6 border, and 16px border-radius. Padding should be generous (typically 24px or 32px).
- **Chips/Badges:** Small, 4px rounded components. Status badges use a 10% opacity tint of the status color (e.g., 10% #ff385c) with full-saturation text for high readability.
- **Property Metrics:** A custom component displaying price and square footage should use the "Label-Caps" typography style for headers and "H3" for the values.
- **Data Tables:** Row-based with 1px #f3f4f6 bottom borders only. No vertical lines. High cell padding (16px vertical) to ensure the "clean and modern" vibe.
