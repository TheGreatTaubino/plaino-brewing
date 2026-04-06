/**
 * Plain-O Brewing — Events Data
 *
 * This file is the single source of truth for all events on the website.
 * When you want to add, edit, or remove an event, this is the ONLY file
 * you need to touch. The calendar page reads this list automatically.
 *
 * HOW TO ADD AN EVENT:
 *   1. Copy one of the objects below (everything between { and }).
 *   2. Paste it inside the EVENTS array (don't forget a comma between items).
 *   3. Fill in the date, title, time, description, and tag.
 *   4. Save the file and push to GitHub — done!
 *
 * FIELD RULES:
 *   date        — Must be in "YYYY-MM-DD" format (year-month-day).
 *                 Example: "2026-07-04" for July 4th, 2026.
 *   title       — The name shown on the calendar and event list.
 *   time        — Human-readable time like "7:00 PM". Use "All Day" if there's
 *                 no specific start time.
 *   description — A short sentence or two about the event. Can be "" (empty
 *                 string) if you have nothing to say yet.
 *   tag         — Picks the color dot on the calendar. Must be EXACTLY one of:
 *                   "live music"  — blue
 *                   "trivia"      — green
 *                   "special"     — red
 *                   "tasting"     — purple
 *                   "private"     — tan/gray
 *                 Using a tag not in this list will just show a gray dot.
 */

const EVENTS = [
  {
    date: "2026-03-07",
    title: "Saturday Live: The Blank Slates",
    time: "7:00 PM",
    description: "Local acoustic duo playing originals and covers. No cover charge.",
    tag: "live music"
  },
  {
    date: "2026-03-11",
    title: "Trivia Night",
    time: "7:30 PM",
    description: "Weekly pub trivia. Teams up to 6. Winner gets a round on us.",
    tag: "trivia"
  },
  {
    date: "2026-03-14",
    title: "Pi Day Tap Release: Circle",
    time: "3:14 PM",
    description: "Limited release. Round can, round flavor. Ask about it.",
    tag: "special"
  },
  {
    date: "2026-03-18",
    title: "Trivia Night",
    time: "7:30 PM",
    description: "Weekly pub trivia. Teams up to 6. Winner gets a round on us.",
    tag: "trivia"
  },
  {
    date: "2026-03-21",
    title: "Saturday Live: Plain Jane",
    time: "8:00 PM",
    description: "Indie folk, plain and simple.",
    tag: "live music"
  },
  {
    date: "2026-03-25",
    title: "Trivia Night",
    time: "7:30 PM",
    description: "Weekly pub trivia. Teams up to 6. Winner gets a round on us.",
    tag: "trivia"
  },
  {
    date: "2026-03-28",
    title: "Color Tasting Flight",
    time: "6:00 PM",
    description: "Guided tasting of all 8 beers on tap. $18/person. Limited spots.",
    tag: "tasting"
  },
  {
    date: "2026-04-04",
    title: "Saturday Live: The Grays",
    time: "7:00 PM",
    description: "",
    tag: "live music"
  },
  {
    date: "2026-04-11",
    title: "Spring Tap Release",
    time: "12:00 PM",
    description: "Two new seasonal colors hitting the taps. First pours free.",
    tag: "special"
  }
];
