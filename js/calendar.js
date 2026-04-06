/**
 * Plain-O Brewing — Calendar & Events List
 *
 * This script powers the interactive calendar on the Events page.
 * It reads the EVENTS array from events-data.js (loaded first in the HTML),
 * builds a month grid, shows colored dots on days that have events, and
 * renders a scrollable list of upcoming events below the calendar.
 *
 * The whole thing is wrapped in an IIFE (Immediately Invoked Function Expression)
 * — that's the (() => { ... })() pattern at the top and bottom. This keeps all
 * the variables private so they don't accidentally collide with anything else
 * on the page. Think of it as a bubble that runs once and disappears.
 */

(() => {

  /**
   * TAG_COLORS maps each event category to a hex color.
   * These same colors are used in the calendar dots, the legend, and the
   * event list. If you add a new tag to events-data.js, add it here too
   * so it gets its own color instead of defaulting to gray.
   */
  const TAG_COLORS = {
    "live music": "#3b5fa0",
    "trivia":     "#4a8c5c",
    "special":    "#c0392b",
    "tasting":    "#8b5e9e",
    "private":    "#b0a090"
  };

  /**
   * `current` tracks which month is currently displayed.
   * We start it at today's date, then immediately snap it to the 1st of the
   * month (setDate(1)). That way we always have a clean "first of month" anchor
   * to do date math with, regardless of what day of the month it actually is.
   */
  let current = new Date();
  current.setDate(1);

  /**
   * toKey(date) — turns a JavaScript Date object into a "YYYY-MM-DD" string.
   *
   * JavaScript's toISOString() gives us something like "2026-04-05T12:00:00.000Z".
   * slice(0, 10) chops it down to just the first 10 characters: "2026-04-05".
   * We use this format everywhere so dates can be compared as plain strings.
   *
   * @param {Date} date - any JavaScript Date object
   * @returns {string} e.g. "2026-04-05"
   */
  function toKey(date) {
    return date.toISOString().slice(0, 10);
  }

  /**
   * groupByDate(events) — reorganizes the flat EVENTS array into a lookup table.
   *
   * The EVENTS array is a list like [{date:"2026-04-05", ...}, ...].
   * This function returns an object where each key is a date string and each
   * value is an array of events on that date. Example result:
   *
   *   {
   *     "2026-04-04": [ { title: "Saturday Live: The Grays", ... } ],
   *     "2026-04-11": [ { title: "Spring Tap Release", ... } ]
   *   }
   *
   * This makes it fast to check "does April 5th have any events?" — you just
   * look up byDate["2026-04-05"] instead of scanning the whole array every time.
   *
   * reduce() is a loop that starts with an empty object (acc = {}) and
   * adds each event to the right bucket. If a bucket doesn't exist yet it
   * creates it as an empty array first, then pushes the event in.
   *
   * @param {Array} events - the raw EVENTS array
   * @returns {Object} date string → array of event objects
   */
  function groupByDate(events) {
    return events.reduce((acc, e) => {
      (acc[e.date] = acc[e.date] || []).push(e);
      return acc;
    }, {});
  }

  /**
   * renderCalendar() — draws the entire calendar grid for the current month.
   *
   * Steps it takes:
   *   1. Figures out what year/month `current` points to.
   *   2. Gets today's date as a string so we can highlight it.
   *   3. Groups events by date for fast lookup.
   *   4. Updates the month/year label at the top (e.g. "April 2026").
   *   5. Clears the grid and rebuilds it from scratch:
   *        a. Day-of-week headers (Sun, Mon, Tue...)
   *        b. Empty placeholder cells for days before the 1st
   *        c. One cell per day in the month
   *   6. On days that have events, adds colored dots and makes the cell clickable.
   *   7. Calls renderUpcoming() to also refresh the event list below.
   */
  function renderCalendar() {
    const year  = current.getFullYear();
    const month = current.getMonth(); // 0 = January, 11 = December
    const today = toKey(new Date());  // today's date as "YYYY-MM-DD"
    const byDate = groupByDate(EVENTS);

    // Update the text label that shows the current month and year
    document.getElementById('cal-month-label').textContent =
      current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Grab the grid container and wipe it clean before rebuilding
    const grid = document.getElementById('cal-grid');
    grid.innerHTML = '';

    /**
     * getDay() on the first day of the month tells us what column to start on.
     * 0 = Sunday, 6 = Saturday. We need this many empty cells at the start
     * so the numbers line up under the right day-of-week headers.
     */
    const firstDay = new Date(year, month, 1).getDay();

    /**
     * new Date(year, month + 1, 0) is a trick: "day 0" of next month
     * is the same as the last day of the current month. .getDate() gives
     * us that number, so daysInMonth ends up as 28, 29, 30, or 31.
     */
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add day-of-week header row (Sun through Sat)
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
      const el = document.createElement('div');
      el.className = 'cal-dow';
      el.textContent = d;
      grid.appendChild(el);
    });

    /**
     * Add blank placeholder cells for the days before the 1st.
     * For example, if April 1st is a Wednesday (getDay() = 3), we need
     * 3 empty cells before we start putting numbers in.
     */
    for (let i = 0; i < firstDay; i++) {
      grid.appendChild(Object.assign(document.createElement('div'), { className: 'cal-cell cal-empty' }));
    }

    /**
     * Now add one cell for every actual day in the month.
     * d counts from 1 to daysInMonth (e.g. 1 to 30 for April).
     */
    for (let d = 1; d <= daysInMonth; d++) {
      /**
       * Build the date string for this cell in "YYYY-MM-DD" format.
       * padStart(2,'0') makes sure single-digit months/days get a leading zero
       * (e.g. "4" becomes "04") so all date strings look the same length.
       */
      const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

      const cell = document.createElement('div');

      // Highlight today's date with a special CSS class
      cell.className = 'cal-cell' + (dateStr === today ? ' cal-today' : '');

      // Mark the cell if there are events on this day (changes cursor, hover color)
      if (byDate[dateStr]) cell.classList.add('cal-has-events');

      // The day number shown inside the cell
      const num = document.createElement('span');
      num.className = 'cal-day-num';
      num.textContent = d;
      cell.appendChild(num);

      // If this day has events, add colored dots and a click handler
      if (byDate[dateStr]) {
        const dots = document.createElement('div');
        dots.className = 'cal-dots';

        /**
         * Show up to 3 dots (one per event). slice(0,3) makes sure we never
         * try to show more than 3 even if there are many events on one day.
         * Each dot's color comes from TAG_COLORS; unknown tags get gray (#888).
         */
        byDate[dateStr].slice(0, 3).forEach(e => {
          const dot = document.createElement('span');
          dot.className = 'cal-dot';
          dot.style.background = TAG_COLORS[e.tag] || '#888';
          dots.appendChild(dot);
        });

        cell.appendChild(dots);

        // Clicking a day with events filters the event list to just that day
        cell.addEventListener('click', () => highlightDay(dateStr));
      }

      grid.appendChild(cell);
    }

    // Refresh the event list below the calendar (unfiltered — show the full month)
    renderUpcoming();
  }

  /**
   * highlightDay(dateStr) — highlights a clicked calendar cell and filters
   * the event list to show only that day's events.
   *
   * It first removes the 'cal-selected' highlight from ALL cells, then finds
   * the cell that matches the clicked date and adds it back to just that one.
   * Then it calls renderUpcoming with the date so the list filters down.
   *
   * Note: because cells don't store their date string directly, we have to
   * rebuild the date string from the day number and the current month/year.
   *
   * @param {string} dateStr - the clicked date in "YYYY-MM-DD" format
   */
  function highlightDay(dateStr) {
    // Remove any previously selected highlight
    document.querySelectorAll('.cal-cell').forEach(c => c.classList.remove('cal-selected'));

    // Find the cell for this date and add the selected style
    document.querySelectorAll('.cal-cell.cal-has-events').forEach(c => {
      const num = c.querySelector('.cal-day-num').textContent;
      const year  = current.getFullYear();
      const month = current.getMonth();
      // Rebuild the date string from the cell's day number
      const d = `${year}-${String(month+1).padStart(2,'0')}-${String(parseInt(num)).padStart(2,'0')}`;
      if (d === dateStr) c.classList.add('cal-selected');
    });

    // Update the event list below to show only this day's events
    renderUpcoming(dateStr);
  }

  /**
   * renderUpcoming(filterDate) — builds the event list below the calendar.
   *
   * When called with no argument (or undefined), it shows all events from
   * the currently displayed month onward. When called with a specific date
   * (after clicking a calendar cell), it shows only that day's events.
   *
   * For each event it builds a row with:
   *   - a date/time column on the left
   *   - a title (with a colored dot) and description in the middle
   *   - the tag category label on the right
   *
   * All HTML is created via JavaScript (createElement) rather than innerHTML
   * for each item, which is a bit verbose but safer and easier to style.
   *
   * @param {string} [filterDate] - optional "YYYY-MM-DD" to filter to one day
   */
  function renderUpcoming(filterDate) {
    const list = document.getElementById('events-list');
    const todayStr = toKey(new Date());

    // Sort events chronologically by date string (alphabetical sort works for YYYY-MM-DD)
    let filtered = [...EVENTS].sort((a, b) => a.date.localeCompare(b.date));

    if (filterDate) {
      // User clicked a specific day — show only that day's events
      filtered = filtered.filter(e => e.date === filterDate);
    } else {
      /**
       * No filter: show events in the current month view.
       * monthStr looks like "2026-04" (year-month with zero-padded month).
       * We keep events that either:
       *   - haven't happened yet (date >= today), OR
       *   - are in the currently displayed month (date starts with monthStr).
       * Then we cut anything before the start of this month.
       * The result: past months are hidden, current + future months show up.
       */
      const year  = current.getFullYear();
      const month = current.getMonth();
      const monthStr = `${year}-${String(month + 1).padStart(2,'0')}`;
      filtered = filtered.filter(e => e.date >= todayStr || e.date.startsWith(monthStr));
      filtered = filtered.filter(e => e.date >= monthStr);
    }

    // If nothing matched, show a friendly "no events" message and stop
    if (filtered.length === 0) {
      list.innerHTML = '<p class="events-empty">No events this period.</p>';
      return;
    }

    list.innerHTML = ''; // Clear old list before building the new one

    filtered.forEach(e => {
      /**
       * Parse the date as noon local time (T12:00:00) to avoid timezone weirdness.
       * Without the time, JavaScript parses "YYYY-MM-DD" as midnight UTC, which
       * can shift to the previous day in US timezones. Noon is safely in the middle.
       */
      const d = new Date(e.date + 'T12:00:00');
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const color = TAG_COLORS[e.tag] || '#888'; // fallback gray for unknown tags

      // The outer container for one event row
      const item = document.createElement('div');
      item.className = 'event-item';

      // --- Left column: date and time ---
      const dateCol = document.createElement('div');
      dateCol.className = 'event-date-col';

      const dateSpan = document.createElement('span');
      dateSpan.className = 'event-date';
      dateSpan.textContent = dayLabel; // e.g. "Sat, Apr 4"

      const timeSpan = document.createElement('span');
      timeSpan.className = 'event-time';
      timeSpan.textContent = e.time; // e.g. "7:00 PM"

      dateCol.appendChild(dateSpan);
      dateCol.appendChild(timeSpan);

      // --- Middle column: title (with colored dot) and description ---
      const body = document.createElement('div');
      body.className = 'event-body';

      const titleRow = document.createElement('div');
      titleRow.className = 'event-title-row';

      // Small colored circle that visually matches the calendar dot
      const dot = document.createElement('span');
      dot.className = 'event-tag-dot';
      dot.style.background = color;

      const title = document.createElement('h3');
      title.className = 'event-title';
      title.textContent = e.title;

      titleRow.appendChild(dot);
      titleRow.appendChild(title);
      body.appendChild(titleRow);

      // Only add a description paragraph if there's something to say
      if (e.description) {
        const desc = document.createElement('p');
        desc.className = 'event-desc';
        desc.textContent = e.description;
        body.appendChild(desc);
      }

      // --- Right column: tag label (e.g. "live music") ---
      const tagLabel = document.createElement('span');
      tagLabel.className = 'event-tag-label';
      tagLabel.style.color = color; // same color as the dot for visual consistency
      tagLabel.textContent = e.tag;

      // Assemble the full row
      item.appendChild(dateCol);
      item.appendChild(body);
      item.appendChild(tagLabel);
      list.appendChild(item);
    });
  }

  /**
   * Previous/Next month buttons.
   * setMonth() handles year rollovers automatically — going back from January
   * lands in December of the prior year without us doing any special math.
   * After changing the month, we re-render the whole calendar.
   */
  document.getElementById('cal-prev').addEventListener('click', () => {
    current.setMonth(current.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById('cal-next').addEventListener('click', () => {
    current.setMonth(current.getMonth() + 1);
    renderCalendar();
  });

  // Kick everything off by rendering the current month on page load
  renderCalendar();

})();
