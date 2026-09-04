# Onevoo — UI / UX & CSS Architecture Documentation

Comprehensive technical design system and UI/UX architecture reference for the **Onevoo Creator Management & Short Video Platform** frontend.

---

## Table of Contents
1. [Design Philosophy & Aesthetic Direction](#1-design-philosophy--aesthetic-direction)
2. [Design Tokens & CSS Variables](#2-design-tokens--css-variables)
3. [Typography System](#3-typography-system)
4. [Color System & Themes (Dark & Light)](#4-color-system--themes-dark--light)
5. [Core Visual Motifs & Glassmorphism](#5-core-visual-motifs--glassmorphism)
6. [Motion & Animation System](#6-motion--animation-system)
7. [Component Architecture & UI Breakdown](#7-component-architecture--ui-breakdown)
   - [7.1 Interactive Colorful Logo Component](#71-interactive-colorful-logo-component)
   - [7.2 Navbar & Mobile Drawer](#72-navbar--mobile-drawer)
   - [7.3 Hero Section, Creator Portrait & Stats Bar](#73-hero-section-creator-portrait--stats-bar)
   - [7.4 Platform Offerings & Gigs Showcase](#74-platform-offerings--gigs-showcase)
   - [7.5 The Onevoo Flow (Solo vs Managed & Doodles)](#75-the-onevoo-flow-solo-vs-managed--doodles)
   - [7.6 Creator Stories (Hits & Campaigns)](#76-creator-stories-hits--campaigns)
   - [7.7 Trusted By Brands & Studios Logo Cloud](#77-trusted-by-brands--studios-logo-cloud)
   - [7.8 Contract Terms & Legal Blueprint](#78-contract-terms--legal-blueprint)
   - [7.9 Creator Payouts Dashboard & Milestones](#79-creator-payouts-dashboard--milestones)
   - [7.10 Reels Dropzone & Collaboration Signal](#710-reels-dropzone--collaboration-signal)
   - [7.11 Opportunities & Gigs Marketplace](#711-opportunities--gigs-marketplace)
   - [7.12 Authentication & Verified Route Gates](#712-authentication--verified-route-gates)
   - [7.13 Booking Funnel & Confirmation](#713-booking-funnel--confirmation)
   - [7.14 Coming Soon Modal & Waitlist Banner](#714-coming-soon-modal--waitlist-banner)
   - [7.15 Footer & Signature Doodle](#715-footer--signature-doodle)
8. [Responsive Design & Breakpoints](#8-responsive-design--breakpoints)
9. [Accessibility & Usability Best Practices](#9-accessibility--usability-best-practices)
10. [File Structure & Maintenance Guide](#10-file-structure--maintenance-guide)

---

## 1. Design Philosophy & Aesthetic Direction

The Onevoo interface blends **Neo-Brutalist editorial typography** with **Cyberpunk Glassmorphism** and film-inspired micro-interactions:
- **High Visual Impact:** Bold uppercase headings paired with ultra-crisp monospaced metadata and smooth body typography.
- **Atmospheric Depth:** Multi-layered radial gradients, ambient dot meshes, and floating Gaussian blur light blobs generate immersive spatial depth.
- **Film Industry Symbolism:** The signature perforated film-strip sprockets (`Perf.jsx`) visually establish the video and cinema identity across section breaks.
- **Tactile Feedback:** Springy micro-interactions, gradient borders on hover, glowing backdrop shadows, and multi-directional slide-out drawers.

---

## 2. Design Tokens & CSS Variables

Tokens are declared on `:root` and adaptively overridden under `[data-theme="light"]`.

```css
:root {
  /* --- Typography Families --- */
  --font-display: 'Anton', sans-serif;
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* --- Premium Dark Theme (Default) --- */
  --ink: #06060c;
  --ink-deep: #09090b;              /* Absolute charcoal black */
  --ink-surface: #121215;           /* Elevated layout container */
  --paper: #f8fafc;
  --paper-soft: #f4f6fb;            /* Soft linen white */
  --mute: #9499b1;
  --text-muted: #8e919a;            /* Silver-gray secondary description */
  --line: rgba(255, 255, 255, 0.08);
  --line-strong: rgba(124, 92, 255, 0.35);

  /* --- Interactive Highlight Accents --- */
  --accent-gold: #e2b842;           /* Refined champagne gold */
  --accent-purple: #7c3aed;         /* Deep studio violet */
  --accent-cyan: #06b6d4;           /* Active real-time cyan */
  --accent-green: #10b981;          /* Emerald active status */

  /* Brand/Accent Colors - Premium Vibrant Palette */
  --c-red: #ff3b5c;
  --c-green: #00eed1;
  --c-orange: #ff8c00;
  --c-purple: #8b5cf6;
  --c-pink: #ec4899;
  --c-yellow: #ffb800;
  --c-cyan: #06b6d4;
  --c-emerald: #10b981;

  /* --- Satin-Smoothed Glassmorphism Properties --- */
  --satin-bg: rgba(10, 10, 12, 0.45);
  --satin-border: rgba(255, 255, 255, 0.05);
  --satin-border-hover: rgba(255, 255, 255, 0.15);
  --satin-blur: 28px;               /* Deepened backdrop-blur for luxury feel */
  --satin-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.6);
  --satin-glow: 0 0 40px rgba(124, 58, 237, 0.12); /* Ambient aura glow */

  /* Premium Glassmorphism & Shadow Tokens */
  --glass-bg: rgba(16, 16, 28, 0.65);
  --glass-border: 1px solid rgba(255, 255, 255, 0.09);
  --glass-border-hover: 1px solid rgba(139, 92, 246, 0.45);
  --glass-blur: blur(20px);
  --glass-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.09);
  --glow-shadow: 0 0 35px -5px rgba(139, 92, 246, 0.35);

  /* --- Tactile Retro Grid Line --- */
  --grid-line: rgba(255, 255, 255, 0.03);

  /* --- Hardware-Accelerated Physics (Smooth UI) --- */
  --transition-smooth: all 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 3. Typography System

The typography hierarchy pairs three Google Fonts loaded via `index.html`:

| Role | Font Family | Weights | CSS Class / Selector | Usage Context |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Headlines** | `Anton` | 400 | `h1, h2, h3, .disp, .logo` | Massive section headers, hero banners, statement metrics, logo lettering |
| **Body & UI** | `Inter` | 400, 500, 600, 700, 800 | `body, p, button, input` | Navigation links, descriptions, form inputs, button labels |
| **Technical / Monospace** | `JetBrains Mono` | 500 | `.mono, .mono-metadata, .badge, .tag` | Payout figures, timestamps, contract clauses, city chips, ticker tags |

### Typography Guidelines
- **Display Headings (`h1`, `h2`, `h3`):** `text-transform: uppercase; letter-spacing: -0.01em; line-height: 0.92;`
- **Hero Outlined Emphasis (`h1 em, h2 em`):** `-webkit-text-stroke: 1px var(--accent-gold); color: transparent; text-shadow: 0 0 20px rgba(226, 184, 66, 0.1);` with interactive gold expansion on hover.
- **Retro Monospace Metadata (`.mono-metadata`):** `font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent-gold); border-left: 2px solid var(--accent-gold); padding-left: 10px;`

---

## 4. Color System & Themes (Dark & Light)

### Theme Switching Engine
Theme state is managed globally by `ThemeContext.jsx` and injected onto the `<html>` or `<body>` element as `data-theme="light"` or `data-theme="dark"`.

### Light Mode Adaptation (`[data-theme="light"]`)
- **Background:** Crisp off-white (`#f4f6fb`) enhanced with soft lavender and turquoise radial ambient glows.
- **Card Surfaces:** High-opacity frosted white glass (`rgba(255, 255, 255, 0.85)`).
- **Text:** Dark slate `#0f172a` for primary copy and `#475569` / `#64748b` for secondary descriptions.
- **Borders & Contrasts:** Inverted subtle borders (`rgba(15, 23, 42, 0.08)`) with purple glow accents maintained on interactive focus.

---

## 5. Core Visual Motifs & Glassmorphism

### 1. Ambient Dynamic Glow Background (`.glow-blobs`)
Four asynchronous floating blur blobs combined with a subtle dot raster:
- `.blob-1`: Violet/Pink orb (Top-left)
- `.blob-2`: Mint/Cyan orb (Bottom-right)
- `.blob-3`: Purple pulse orb (Center)
- `.blob-4`: Warm Amber orb (Bottom-left)
- `.ambient-mesh`: 36px × 36px radial dot grid with center-to-edge elliptical mask.

### 2. Film Perforation Dividers (`.perf-divider` / `Perf.jsx`)
Visual boundary between landing sections resembling 35mm film sprockets. Rendered as a row of geometric punch-holes bordered by fine hairline guides.

### 3. Multi-Colored Interactive Logo (`.logo`)
Every letter of **O-N-E-V-O-O** has its own unique vibrant accent color class:
- `.l-w` (O): `var(--c-red)`
- `.l-o1` (N): `var(--c-green)`
- `.l-n` (E): `var(--paper)`
- `.l-e` (V): `var(--c-orange)`
- `.l-v` (O): `var(--c-purple)`
- `.l-o2` (O): `var(--c-yellow)`
- `.l-o3` (!): `var(--c-pink)`
Hovering triggers an organic wave bounce (`transform: translateY(-4px) scale(1.08)` and `drop-shadow`).

---

## 6. Motion & Animation System

### Keyframe Animations

| Animation Name | Duration / Easing | Description |
| :--- | :--- | :--- |
| `@keyframes float-blob-1` | `20s infinite ease-in-out` | Fluid scaling and diagonal drift for atmospheric top-left blob |
| `@keyframes float-blob-2` | `24s infinite ease-in-out` | Counter-directional movement for turquoise bottom-right blob |
| `@keyframes float-blob-3` | `18s infinite ease-in-out` | Center pulsing violet expansion |
| `@keyframes marquee` | `28s linear infinite` | Seamless horizontal ticker scroll |
| `@keyframes pulse-ring` | `2s cubic-bezier(0.4, 0, 0.6, 1) infinite` | Radar wave pulse for live active status indicators |
| `@keyframes spin` | `0.8s linear infinite` | Circular page loader spinner |

### Interactive Transitions
- **Hover Transitions:** `transition: var(--transition-smooth)` (using `cubic-bezier(0.16, 1, 0.3, 1)`).
- **Drawer Open / Close:** Sliding transitions along the X-axis (`right: -100%` to `right: 0`).
- **Card Hover Elevation:** Subtle `translateY(-6px)` accompanied by expansion of `--glass-border-hover` and `--glow-shadow`.

---

## 7. Component Architecture & UI Breakdown

```
src/
├── components/
│   ├── Navbar.jsx               # Fixed blur navigation + Mobile drawer + Theme switch
│   ├── Hero.jsx                 # Impact display headline, floating live widgets, CTAs
│   ├── Marquee.jsx              # Infinite scrolling niche & category ticker
│   ├── CreatorStories.jsx       # Verified testimonial cards with metrics & badges
│   ├── Offerings.jsx            # 4 core platform pillars + interactive dropzone
│   ├── BeforeAfter.jsx          # Solo Creator vs Onevoo Managed comparison matrix
│   ├── ContractTerms.jsx        # 5-Year vs 7-Year interactive terms blueprint
│   ├── ComingSoon.jsx           # Waitlist registration banner with instant validation
│   ├── ComingSoonModal.jsx      # Modal popup for gated early-access features
│   ├── OpportunitiesPage.jsx    # Filterable creator gigs marketplace
│   ├── GigCard.jsx              # Gig item card with budget badge, location & niche tags
│   ├── GigCardSkeleton.jsx      # Shimmer loading skeleton for marketplace gigs
│   ├── GigDetailsDrawer.jsx     # Slide-over drawer with gig brief & application form
│   ├── BookingPage.jsx          # Multi-step creator onboarding demo booking
│   ├── BookingConfirmation.jsx  # Booking success page with appointment details
│   ├── AuthPage.jsx             # Supabase Authentication portal (Login / Register)
│   ├── VerifiedRoute.jsx        # Route guard requiring verified profile status
│   ├── Perf.jsx                 # Sprocket perforation divider
│   ├── BackToTopButton.jsx      # Sticky scroll-to-top floating control
│   ├── Footer.jsx               # Multi-column footer with live status & links
│   └── NotFoundPage.jsx         # 404 Error page with animated return CTA
```

### 7.1 Navbar & Mobile Drawer
- **Desktop:** Sticky top bar with `backdrop-filter: blur(20px)`, active underline tracking, theme switch button, and "Apply as Creator" CTA.
- **Mobile (`<900px`):** Three-line animated hamburger icon morphing into an "X" on toggle, triggering a slide-in right drawer overlay (`.drawer`).

### 7.2 Hero Section & Floating Stats
- **Headline Architecture:** Triple-line stacked Anton titles with stroked ghost fonts (`<em>`).
- **Live Widgets (`.floating-card`):**
  - Instant payout ticker card (`₹2.4L+ Average Monthly Deal Flow`).
  - Active shoot call badge with pulsing green live dot.
  - Collab match gauge with progress indicators.

### 7.3 Infinite Marquee
- Two tandem flex tracks scrolling in lockstep at 28s intervals with CSS `will-change: transform`.
- Monospace keywords separated by neon geometric dividers (`◆`, `●`, `✦`).

### 7.4 Perforation Strip (Perf Divider)
- Reusable structural component (`<Perf />`) consisting of square punch holes (`.perf-hole`) that reinforce the short video/film production brand motif.

### 7.5 Platform Offerings & Reels Dropzone
- **Grid Layout:** 4-column responsive grid covering:
  1. *Brand Collabs* (Sponsored content & commercial deals)
  2. *Shoot Calls* (On-location productions & casting)
  3. *Brand Sponsorships* (Long-term retainer partnerships)
  4. *Local Photoshoots* (Multi-city studio sessions)
- **Interactive Dropzone (`.upload-dropzone`):** Visual upload area demonstrating quick reel submission workflow.

### 7.6 Solo vs. Managed Comparison (Before/After)
- Side-by-side comparison layout juxtaposing the chaotic pain points of solo creators (invoicing delays, non-binding contracts, ghosting) against Onevoo's managed infrastructure (legal protection, guaranteed payouts, dedicated shoot crews).

### 7.7 Contract Terms & Legal Blueprint
- Interactive tab switcher allowing creators to inspect **5-Year vs. 7-Year Growth Agreements**.
- Comprehensive breakdown of revenue splits, intellectual property rights retention, dispute resolution policies, and non-exclusivity clauses.

### 7.8 Opportunities & Gigs Marketplace
- **Search & Filtering:** Real-time search query input, niche category filters (Fashion, Tech, Fitness, Food, Gaming), and compensation range sorting.
- **Drawer Detail View (`GigDetailsDrawer.jsx`):** Smooth right-sliding drawer presenting deliverable requirements, brand mood boards, submission guidelines, and in-app application form.
- **Skeleton States (`GigCardSkeleton.jsx`):** Shimmer skeleton animations preventing layout shifts during data fetch.

### 7.9 Authentication & Verified Route Gates
- Clean glassmorphic auth cards with dual-mode Login / Registration tabs.
- Integrated with Supabase Auth (`supabase.js`).
- Protected route wrapper (`VerifiedRoute.jsx`) validating creator credentials prior to marketplace access.

### 7.10 Booking Funnel & Confirmation
- Step-by-step demo appointment scheduler with date, time, channel selection, and follower metrics collection.
- Route transition to `BookingConfirmation.jsx` displaying appointment summary and calendar integration tips.

### 7.11 Coming Soon Modal & Waitlist Banner
- Lead-capture form with email input, loading states, success notifications, and instant feedback.

### 7.12 Footer & Auxiliary Navigation
- Multi-column glass footer containing platform links, legal terms (`/terms`), privacy policy (`/privacy`), social icons with hover glow, and a real-time operational status pill (`● All Systems Operational`).

---

## 8. Responsive Design & Breakpoints

The responsive architecture relies on fluid clamping (`clamp()`), CSS Grid, and mobile-first media queries:

| Breakpoint Range | Target Devices | Layout Adaptations |
| :--- | :--- | :--- |
| **`> 1200px`** | Large Desktops | Full 4-column grids, maximum container width `1200px`, full floating hero widgets |
| **`900px – 1199px`** | Small Laptops / Tablets | 2-column feature grids, condensed navigation links |
| **`640px – 899px`** | Tablets / Large Phones | Full navbar collapses into slide-out drawer, stacked before/after cards |
| **`< 640px`** | Mobile Phones | Single-column stacks, auto-fit card grids (`minmax(280px, 1fr)`), simplified hero widgets, touch-friendly 44px tap targets |

---

## 9. Accessibility & Usability Best Practices

- **Contrast Ratios:** Text colors (`--paper` on `--ink` in Dark Mode, and `--paper` on `--ink` in Light Mode) exceed WCAG AAA standards for readability.
- **Screen Reader Support:** Screen reader only text uses `.visually-hidden` class for proper accessibility.
- **Focus Rings:** Custom focus styles (`outline: 2px solid var(--c-purple); outline-offset: 2px;`) ensure clear keyboard navigation.
- **Motion Reduction:** Ambient blob animations and smooth transitions operate at low CPU overhead with GPU acceleration (`transform`, `opacity`, `will-change`).
- **Interactive Affordances:** Active states, hover lifts, cursor pointers, and clear disabled states across all buttons and inputs.

---

## 10. File Structure & Maintenance Guide

- **Design System Overrides:** Modify root tokens in [`src/index.css`](file:///c:/Users/Utsab%20Sinha/Downloads/onevoo-main/onevoo-main/frontend/src/index.css#L1-L46).
- **Copy & Static Data:** Update landing page copy, contract terms, cities, and feature lists in [`src/data/content.js`](file:///c:/Users/Utsab%20Sinha/Downloads/onevoo-main/onevoo-main/frontend/src/data/content.js).
- **Backend & Auth Configuration:** Configure Supabase endpoint & public keys in `.env` (referencing [`.env.example`](file:///c:/Users/Utsab%20Sinha/Downloads/onevoo-main/onevoo-main/frontend/.env.example)).
- **Adding New Routes:** Register new views in [`src/App.jsx`](file:///c:/Users/Utsab%20Sinha/Downloads/onevoo-main/onevoo-main/frontend/src/App.jsx) wrapped in `React.lazy` and `Suspense`.
