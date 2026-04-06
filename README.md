# Plain-O Brewing — Website

This is the website for **Plain-O Brewing Co.** — a small, simple static site
built with plain HTML, CSS, and JavaScript. "Static" means there's no server
doing anything complicated; it's just files that a browser reads and displays.

The site is hosted on **GitHub Pages**, which means every time you push a change
to GitHub, the live website updates automatically. No uploading, no servers to
manage.

---

## What's in This Project

```
plaino-brewing/
├── index.html              ← The homepage
├── pages/
│   ├── taplist.html        ← The beer menu page
│   ├── events.html         ← The events calendar page
│   ├── about.html          ← The about page
│   └── contact.html        ← Hours, address, contact info
├── css/
│   ├── style.css           ← Styles for the whole site (colors, fonts, layout)
│   └── calendar.css        ← Styles for just the Events calendar
├── js/
│   ├── events-data.js      ← THE LIST OF EVENTS (edit this to add events!)
│   ├── calendar.js         ← Builds the interactive calendar
│   └── nav.js              ← Handles the navigation bar
└── Plainobrewing_logo.png  ← The brewery logo image
```

Each HTML file is a separate page. They all load the shared CSS and JavaScript
files, which is why changing `style.css` changes the look on every page at once.

---

## How to Add or Edit Events

> **This is the most common thing you'll need to do. It's easy!**

Open the file **`js/events-data.js`** in any text editor. You'll see a list
that looks like this:

```js
const EVENTS = [
  {
    date: "2026-04-04",
    title: "Saturday Live: The Grays",
    time: "7:00 PM",
    description: "",
    tag: "live music"
  },
  ...
];
```

Each event is a little block of information inside `{ }` curly braces.

### To add a new event:

1. Copy one of the existing event blocks (from `{` to `}`).
2. Paste it inside the `EVENTS = [ ... ]` list. Make sure there's a comma `,`
   between each event block.
3. Fill in the five fields:

| Field | What to put | Example |
|---|---|---|
| `date` | The date in YYYY-MM-DD format | `"2026-07-04"` |
| `title` | Name of the event | `"Summer Tap Release"` |
| `time` | Time it starts | `"6:00 PM"` or `"All Day"` |
| `description` | A sentence or two about the event (optional, can be blank `""`) | `"Two new beers hit the taps."` |
| `tag` | Category — determines the dot color on the calendar | see below |

### Tags and their colors

The `tag` field must be **exactly** one of these (lowercase, with the space if applicable):

- `"live music"` — blue dot
- `"trivia"` — green dot
- `"special"` — red dot
- `"tasting"` — purple dot
- `"private"` — tan/gray dot

If you use a tag not on this list, the dot will just show up gray and it won't
match the legend. Stick to the list above.

### To remove an event:

Delete the entire event block (from `{` to the closing `},`) and save the file.

### To edit an event:

Find it in the list and change any of the fields. The calendar will update
automatically when you save and push.

---

## How the Calendar Works

The Events page (`pages/events.html`) shows an interactive monthly calendar
plus a list of upcoming events below it.

Here's what happens when someone visits the page:

1. The browser loads `events-data.js` first, which creates the `EVENTS` list
   in memory.
2. Then `calendar.js` runs and reads that list.
3. It builds the calendar grid (all those little day squares) by doing math
   to figure out what day of the week the month starts on, and how many days
   are in the month.
4. For any day that has events, it adds colored dots and makes that cell
   clickable.
5. Below the calendar, it renders a scrollable list of upcoming events.
6. If you click a day on the calendar, the list below filters to just show
   that day's events.
7. The `<` and `>` buttons change the displayed month. The event list below
   updates to match.

The calendar reads events from `EVENTS` live — there's no database or API.
Everything is just JavaScript doing the work in the browser.

---

## How to Deploy / Update the Site

The site is hosted on **GitHub Pages**. Deployment is automatic — you just
push your changes to GitHub and the site updates within a minute or two.

### Basic workflow

1. Make your changes (e.g. edit `events-data.js` to add a new event).
2. Open a terminal and navigate to the project folder.
3. Stage your changes:
   ```
   git add js/events-data.js
   ```
4. Commit with a short message:
   ```
   git commit -m "Add July 4th tap release event"
   ```
5. Push to GitHub:
   ```
   git push
   ```
6. Wait about 60 seconds, then visit the live site to confirm your changes
   appear.

### The CNAME file

There's a file called `CNAME` in the project root. Don't delete it. It tells
GitHub Pages what custom domain to use for the site. If you delete it, the
site may stop loading on the custom domain.

---

## Things to Watch Out For

- **Date format is strict.** Always write dates as `"YYYY-MM-DD"` with
  leading zeros (e.g. `"2026-07-04"`, not `"2026-7-4"`). The calendar
  sorts and compares dates as text strings, so the format has to be
  consistent.

- **Commas between events.** In `events-data.js`, each event block needs a
  comma after the closing `}`, except the very last one. A missing or extra
  comma will break the JavaScript and the calendar will stop working. If the
  calendar goes blank, open the browser's developer tools (F12 → Console tab)
  to see the error.

- **Tags must match exactly.** The tag you use in `events-data.js` needs to
  match the color map inside `calendar.js` character-for-character, including
  spaces and lowercase. `"Live Music"` won't work — it has to be `"live music"`.

- **Past events are automatically hidden.** The event list below the calendar
  only shows events from the current month onward. Old events stay in the
  file (so you have a history) but they won't appear on the page. You can
  clean them out periodically if you like, but you don't have to.

- **The site has no backend.** There's no login, no database, no form
  submissions stored anywhere. The contact page just shows info — it doesn't
  send emails automatically. If you want a contact form that actually works,
  that's a bigger project.

- **Google Analytics is running.** The HTML files include a Google Analytics
  tag (`G-H10JSFPHW4`). This tracks page visits. It's fine to leave it as-is.

- **Testing locally.** You can't just double-click an HTML file and have
  everything work perfectly — the browser may block some things when loading
  from a local file path. The easiest way to preview changes locally is to
  use a simple local server. If you have Python installed:
  ```
  python3 -m http.server 8000
  ```
  Then open `http://localhost:8000` in your browser.

---

## Editing Other Pages

- **Tap list** — Edit `pages/taplist.html` directly. Each beer is a block of
  HTML. Copy an existing `<div class="tap-item">` block to add a new beer.
- **About** — Edit `pages/about.html`. It's plain text inside `<p>` tags.
- **Contact/Hours** — Edit `pages/contact.html`. Update the text inside the
  `<p>` tags in each info block.
- **Homepage headline or tagline** — Edit `index.html`. The big text is inside
  `<h1>` and `<p>` tags in the hero section.

---

That's it. The site is intentionally simple — plain HTML, a couple of CSS files,
and a little JavaScript. No frameworks, no build tools, no Node.js. If you can
edit a text file, you can maintain this site.
