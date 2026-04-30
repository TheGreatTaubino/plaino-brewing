# Plain-O Brewing Co. — Website Handover

**Live site:** https://plainobrewing.com  
**Repository:** https://github.com/TheGreatTaubino/plaino-brewing  
**Hosting:** GitHub Pages (auto-deploys on push to `main`)

---

## What This Is

A static brochure website for Plain-O Brewing Co., a brewery in Plano, TX. No frameworks, no build step, no backend — just HTML, CSS, and vanilla JavaScript served directly from GitHub Pages.

---

## File Structure

```
plaino-brewing/
├── index.html              Homepage (hero, realistic tap rack, start links)
├── favicon.svg / .png      Site icon
├── CNAME                   Custom domain config (do not delete)
├── css/
│   ├── style.css           All global styles, design tokens, shared header, homepage taps
│   └── calendar.css        Styles for the events calendar only
├── js/
│   ├── nav.js              Sticky header + hamburger menu
│   ├── events-data.js      ← Edit this to add/update events
│   └── calendar.js         Calendar rendering logic (no editing needed)
├── pages/
│   ├── taplist.html        Beer menu (8 colors)
│   ├── events.html         Interactive calendar page
│   ├── about.html          Brewery story
│   └── contact.html        Address, hours, contact form
└── assets/logo/            Logo variants (PNG)
```

---

## Running Locally

> Do not open HTML files directly in a browser — JavaScript modules won't load over `file://`.

```bash
cd plaino-brewing
python3 -m http.server 8000
# then open http://localhost:8000
```

If port `8000` is busy, use another port, for example:

```bash
python3 -m http.server 4173
# then open http://localhost:4173
```

---

## Deploying Changes

1. Make your edits
2. Commit and push to `main`:
   ```bash
   git add .
   git commit -m "describe your change"
   git push
   ```
3. GitHub Pages auto-deploys in ~1 minute. No build step needed.

---

## Common Tasks

### Add or edit an event

Open `js/events-data.js`. Add an entry to the array:

```js
{
  date: "2026-05-17",        // YYYY-MM-DD format required
  title: "Live Music Night",
  time: "7:00 PM",
  description: "Local band TBA",
  tag: "live music"          // see tags below
}
```

**Valid tags:** `live music`, `trivia`, `special`, `tasting`, `private`

Past events can stay in the array — the calendar auto-hides them.

---

### Update the tap list

Open `pages/taplist.html`. Each beer is a card in the grid. Find the beer by color name and update the ABV, description, or availability in the HTML directly.

---

### Update hours, address, or contact info

Open `pages/contact.html` and edit the text inline. The homepage currently links visitors into the contact page rather than duplicating full hours/address content.

---

### Update the shared header

The top navigation/header is repeated in every HTML file. It currently uses:

- `.header-inner`
- `.logo-group`
- `.logo-mark-sm`
- `.logo-text`
- `.logo-tagline-sm`
- `.header-stripe`

The homepage uses root-relative paths (`favicon.svg`, `pages/taplist.html`). Subpages use parent-relative paths (`../favicon.svg`, `../index.html`). Keep that difference when copying header markup.

The rainbow stripe colors are inline `<span>` backgrounds in each page header:

```html
<span style="background:#3b5fa0;"></span>
<span style="background:#4a8c5c;"></span>
<span style="background:#c0392b;"></span>
<span style="background:#e8c84a;"></span>
<span style="background:#e87b2a;"></span>
<span style="background:#8b5e9e;"></span>
<span style="background:#b0a090;"></span>
<span style="background:#1a1a1a;"></span>
```

---

### Update homepage tap art

The homepage tap rack is pure HTML/CSS:

- Markup lives in `index.html` under `.tap-rack`
- Sizing and tap rendering live in `css/style.css` under `HOMEPAGE — CONSISTENCY PASS`
- Each tap gets its color from inline `--tap-color`
- Visible names are intentionally removed from the handles; `aria-label` preserves accessible labels
- The hero logo uses `favicon.svg` because the PNG mark showed an unwanted background edge

---

### Change site-wide colors or fonts

All design tokens live at the top of `css/style.css`:

```css
:root {
  --bg: #2e2e2e;
  --surface: #383838;
  --text: #e8e6e0;
  --muted: #848484;
  --border: #424242;
}
```

Changing a variable here updates it everywhere.

---

## Analytics

Google Analytics is wired up with tracking ID `G-H10JSFPHW4`. The script tag appears in the `<head>` of each HTML page. No additional setup needed.

---

## Domain

The `CNAME` file contains `plainobrewing.com`. The DNS records at the domain registrar point to GitHub Pages. **Do not delete or modify the CNAME file** — it will break the custom domain.

---

## Known Limitations

| Issue | Detail |
|-------|--------|
| Contact form is decorative | The form on `contact.html` uses a `mailto:` action and doesn't submit to any backend. Clicking Send opens the user's email client. |
| No CMS | All content is edited in raw HTML/JS. Non-technical editors will need help. |
| Events are manual | There's no integration with Eventbrite, Google Calendar, etc. Events must be added to `events-data.js` by hand. |
| No redirects config | GitHub Pages doesn't support server-side redirects natively. 404s go to GitHub's default page unless a custom `404.html` is added. |

---

## Key Decisions (and Why)

- **No framework** — Keeps the project accessible to anyone comfortable with HTML. No npm, no build tools, nothing to break.
- **Color-named beers** — Core brand identity. The color system is threaded through the CSS, taplist, and calendar event dots.
- **Shared rainbow header** — Every page should use the top-left mark, stacked wordmark/tagline, and full-width rainbow stripe for consistency with the live theme.
- **CSS-only homepage taps** — The homepage tap rack avoids image-generation/assets and can be adjusted directly in CSS. Keep it responsive with `clamp()` values so the handles do not bunch on narrower layouts.
- **Client-side calendar** — Events are stored in a JS array and rendered in-browser. Simple, fast, no server needed.
- **GitHub Pages** — Free hosting, automatic deploys on push, custom domain support via CNAME.

---

## Latest Local Work

Latest commit on `main`:

```bash
62f1ac1 Refine homepage taps and shared header
```

What changed in that commit:

- Reworked the homepage hero to keep the existing site format while using more realistic CSS beer taps.
- Removed visible names from the tap handles while keeping accessible labels.
- Swapped the homepage hero mark to `favicon.svg` to avoid the PNG background mismatch.
- Added fluid sizing to the tap rack/handles so the hero stacks more cleanly.
- Restored the rainbow stripe and top-left logo/tagline header across `index.html` and all pages under `pages/`.

Validation run after the changes:

```bash
git diff --check
node local HTML reference check: 58 checked, 0 missing
curl -I http://127.0.0.1:4173/index.html
curl -I http://127.0.0.1:4173/pages/taplist.html
curl -I http://127.0.0.1:4173/pages/events.html
curl -I http://127.0.0.1:4173/pages/about.html
curl -I http://127.0.0.1:4173/pages/contact.html
```

All checked pages returned `200 OK` from the local static server.

Current git note: `HANDOVER.md` itself is untracked unless the next agent/user stages and commits it.

---

## Handover Checklist

- [ ] Confirm access to the GitHub repo (`TheGreatTaubino/plaino-brewing`)
- [ ] Confirm access to the domain registrar (wherever `plainobrewing.com` DNS is managed)
- [ ] Confirm access to Google Analytics (`G-H10JSFPHW4`)
- [ ] Test a local run (`python3 -m http.server 8000`)
- [ ] Do a test commit + push and verify GitHub Pages deploys correctly
