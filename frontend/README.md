# Onevoo — Creator Management & Short Video Platform

Landing page for onevoo.in, built with React + Vite.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

Build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
onevoo/
├── index.html              # HTML shell, loads Google Fonts (Anton, Inter, JetBrains Mono)
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx             # React root
│   ├── App.jsx               # Composes all sections in order
│   ├── index.css             # Design tokens + all component styles
│   ├── data/
│   │   └── content.js        # All copy/lists (offerings, steps, cities, contract terms)
│   └── components/
│       ├── Navbar.jsx
│       ├── Hero.jsx
│       ├── Marquee.jsx
│       ├── Perf.jsx          # Film-strip perforation divider (signature motif)
│       ├── Offerings.jsx      # Brand collabs / shoots / sponsors / photoshoots grid
│       ├── Contract.jsx       # Interactive 5yr / 7yr term selector
│       ├── Steps.jsx          # How it works
│       ├── Cities.jsx         # Local photoshoot city list
│       ├── ComingSoon.jsx     # Email capture teaser (wire up to your API)
│       └── Footer.jsx
```

## Where to plug in real data / backend

- **`src/data/content.js`** — swap placeholder offerings, steps, cities, and
  contract terms for real copy or fetch them from an API.
- **`src/components/ComingSoon.jsx`** — the `handleSubmit` function has a
  `TODO` where you'd POST the email to your waitlist endpoint.
- **`src/components/Contract.jsx`** — term data currently comes from
  `TERMS` in `content.js`; connect to a real contract-terms API or CMS when
  ready.
- **Apply as Creator button** (`#apply` anchor in `Navbar.jsx` / `Hero.jsx`) —
  currently a plain anchor link. Point it at your signup route/page once
  it exists (e.g. `/apply`), or wire in a router (React Router) if you add
  more pages beyond this landing page.

## Design notes

- Palette: near-black base (`--ink`), signal orange (`--signal`) for actions,
  violet (`--static`) for data/contract accents, warm off-white (`--paper`)
  for text.
- Type: Anton (display/headlines), Inter (body/UI), JetBrains Mono (labels,
  tags, captions).
- The dotted "perforation" divider between sections is the recurring
  signature element, referencing film/video strip sprockets.
