# CLAUDE.md — Plain-O Brewing Website

## Project Overview

Plain-O Brewing is a **fully static website** for a brewery in Plano, TX. It uses vanilla HTML, CSS, and JavaScript with no build tools, no package manager, and no server-side code. It is hosted on GitHub Pages and deploys automatically on every push to `main`.

Live site: `plainobrewing.com` (configured via `CNAME`)

---

## Repository Structure

```
plaino-brewing/
├── index.html            # Homepage (tap wall + pint glasses hero)
├── favicon.png / .svg    # Site favicon/logo
├── CNAME                 # GitHub Pages custom domain
├── css/
│   ├── style.css         # Global styles, variables, nav, all page layouts
│   └── calendar.css      # Calendar-specific styles (events page)
├── js/
│   ├── nav.js            # Sticky nav, active link highlighting, hamburger menu
│   ├── events-data.js    # All events — primary file for non-dev edits
│   └── calendar.js       # Interactive calendar rendering and navigation
├── pages/
│   ├── about.html        # About the brewery
│   ├── contact.html      # Hours, location, contact form
│   ├── events.html       # Events calendar page
│   └── taplist.html      # Current beer menu
└── assets/
    └── logo/             # Brand logo variants (bar, horizontal, stacked, mark)
```

---

## Tech Stack

| Layer | Details |
|-------|---------|
| Markup | Vanilla HTML5 (semantic: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) |
| Styling | Vanilla CSS3 — custom properties, Grid, Flexbox, media queries |
| Scripting | Vanilla JavaScript ES6+ — no transpiler, no bundler |
| Fonts | Google Fonts — Inter (400, 500, 700) |
| Analytics | Google Analytics G-H10JSFPHW4 |
| Hosting | GitHub Pages (auto-deploy on push to `main`) |

**No frameworks, no npm, no build step.** The site runs directly in a browser from the files as-written.

---

## Local Development

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

No install step needed. There are no dependencies to resolve.

---

## Key Conventions

### CSS

- All design tokens live as CSS custom properties in `css/style.css`:
  ```css
  --bg: #2e2e2e          /* page background */
  --surface: #383838     /* card/hover surface */
  --text: #e8e6e0        /* primary text */
  --muted: #848484       /* secondary/label text */
  --border: #424242      /* dividers */
  --font: 'Inter', sans-serif
  ```
- Class names are prefixed by feature: `.cal-*` (calendar), `.tap-*` (beer taps), `.pint-*` (pint glasses), `.event-*`
- Single responsive breakpoint at `720px` (mobile vs. desktop)
- Inline CSS custom properties (`--beer-color`, `--tap-color`) are used for per-element dynamic colors in HTML

### JavaScript

- Functions: camelCase (`renderCalendar`, `groupByDate`, `highlightDay`)
- IDs: kebab-case (`#cal-grid`, `#nav-toggle`, `#cal-prev`)
- `calendar.js` is wrapped in an IIFE to avoid polluting the global namespace
- `events-data.js` exposes a single global `const EVENTS` array — this is intentional for simplicity

### HTML

- Each page has its own `<head>` block with full CSS/JS includes (no shared layout system)
- Navigation is duplicated across pages (no templating engine)
- Contact form uses `mailto:` action — no backend form handling

---

## Adding / Editing Events

Events are defined in **`js/events-data.js`** — the only file that needs editing for routine calendar updates:

```javascript
const EVENTS = [
  {
    date: "2026-04-04",      // YYYY-MM-DD — strict format, no other format works
    title: "Saturday Live: The Grays",
    time: "7:00 PM",
    description: "",         // Optional — empty string is fine
    tag: "live music"        // Must match exactly one of the valid tags below
  },
];
```

**Valid tags and their colors:**

| Tag | Color |
|-----|-------|
| `"live music"` | Blue `#3b5fa0` |
| `"trivia"` | Green `#4a8c5c` |
| `"special"` | Red `#c0392b` |
| `"tasting"` | Purple `#8b5e9e` |
| `"private"` | Tan `#b0a090` |

**Rules:**
- Date format must be `YYYY-MM-DD` exactly
- `tag` must match one of the five values above, including casing and spaces
- Watch comma placement when adding/removing the last entry in the array

---

## Updating the Tap List

Beer entries are hardcoded HTML in **`pages/taplist.html`**. Each tap is a `<div class="tap-card">` with inline styles for color and ABV fill percentage. When adding a new beer, copy an existing card and update: name, style, ABV (number and `--abv-fill` percentage), description, and `--tap-color` / `--beer-color`.

The color palette used for beers maps to the 8 tap handles on the homepage:

| Color | Hex |
|-------|-----|
| Blue | `#3b5fa0` |
| Green | `#4a8c5c` |
| Red | `#c0392b` |
| Yellow | `#e8c84a` |
| Orange | `#e87b2a` |
| Purple | `#8b5e9e` |
| Tan | `#b0a090` |
| Black | `#484848` |

---

## Deployment

Push to `main` → GitHub Pages auto-deploys within ~60 seconds. No build commands, CI pipelines, or manual steps required.

There are no CI workflows (`.github/workflows/` does not exist).

---

## Testing

There are no automated tests, linters, or type checkers. Manually test by running the local server and checking:

1. All five pages load without errors (Console should be clean)
2. Navigation active states update correctly on each page
3. Calendar renders current month and events appear as colored dots
4. Hamburger menu works on mobile viewport
5. Taplist renders beer cards with correct colors and ABV bars

---

## Accessibility Baseline

- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- Include `aria-label` / `aria-expanded` on interactive elements (see nav toggle)
- Maintain heading hierarchy (`h1` → `h2` → `h3`, no skips)
- All images need `alt` attributes

---

## Do Not

- Add npm, a bundler, or a framework — the intentional choice is zero dependencies
- Add backend code — the site is and should remain fully static
- Create `.env` files with secrets — there is no server to read them
- Modify the `.gitignore` pattern for `.env*` — it's there as a safety net
- Use date formats other than `YYYY-MM-DD` in `events-data.js`
