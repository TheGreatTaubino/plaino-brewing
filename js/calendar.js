(() => {
  const TAG_COLORS = {
    "live music": "#3b5fa0",
    "trivia":     "#4a8c5c",
    "special":    "#c0392b",
    "tasting":    "#8b5e9e",
    "private":    "#b0a090"
  };

  let current = new Date();
  current.setDate(1);

  function toKey(date) {
    return date.toISOString().slice(0, 10);
  }

  function groupByDate(events) {
    return events.reduce((acc, e) => {
      (acc[e.date] = acc[e.date] || []).push(e);
      return acc;
    }, {});
  }

  function renderCalendar() {
    const year  = current.getFullYear();
    const month = current.getMonth();
    const today = toKey(new Date());
    const byDate = groupByDate(EVENTS);

    // Header
    document.getElementById('cal-month-label').textContent =
      current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Grid
    const grid = document.getElementById('cal-grid');
    grid.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Day-of-week headers
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
      const el = document.createElement('div');
      el.className = 'cal-dow';
      el.textContent = d;
      grid.appendChild(el);
    });

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      grid.appendChild(Object.assign(document.createElement('div'), { className: 'cal-cell cal-empty' }));
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const cell = document.createElement('div');
      cell.className = 'cal-cell' + (dateStr === today ? ' cal-today' : '');
      if (byDate[dateStr]) cell.classList.add('cal-has-events');

      const num = document.createElement('span');
      num.className = 'cal-day-num';
      num.textContent = d;
      cell.appendChild(num);

      if (byDate[dateStr]) {
        const dots = document.createElement('div');
        dots.className = 'cal-dots';
        byDate[dateStr].slice(0, 3).forEach(e => {
          const dot = document.createElement('span');
          dot.className = 'cal-dot';
          dot.style.background = TAG_COLORS[e.tag] || '#888';
          dots.appendChild(dot);
        });
        cell.appendChild(dots);
        cell.addEventListener('click', () => highlightDay(dateStr));
      }

      grid.appendChild(cell);
    }

    renderUpcoming();
  }

  function highlightDay(dateStr) {
    document.querySelectorAll('.cal-cell').forEach(c => c.classList.remove('cal-selected'));
    document.querySelectorAll('.cal-cell.cal-has-events').forEach(c => {
      const num = c.querySelector('.cal-day-num').textContent;
      const year  = current.getFullYear();
      const month = current.getMonth();
      const d = `${year}-${String(month+1).padStart(2,'0')}-${String(parseInt(num)).padStart(2,'0')}`;
      if (d === dateStr) c.classList.add('cal-selected');
    });
    renderUpcoming(dateStr);
  }

  function renderUpcoming(filterDate) {
    const list = document.getElementById('events-list');
    const todayStr = toKey(new Date());

    let filtered = [...EVENTS].sort((a, b) => a.date.localeCompare(b.date));

    if (filterDate) {
      filtered = filtered.filter(e => e.date === filterDate);
    } else {
      // Show events from current month view onward
      const year  = current.getFullYear();
      const month = current.getMonth();
      const monthStr = `${year}-${String(month + 1).padStart(2,'0')}`;
      filtered = filtered.filter(e => e.date >= todayStr || e.date.startsWith(monthStr));
      filtered = filtered.filter(e => e.date >= monthStr);
    }

    if (filtered.length === 0) {
      list.innerHTML = '<p class="events-empty">No events this period.</p>';
      return;
    }

    list.innerHTML = filtered.map(e => {
      const d = new Date(e.date + 'T12:00:00');
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const color = TAG_COLORS[e.tag] || '#888';
      return `
        <div class="event-item">
          <div class="event-date-col">
            <span class="event-date">${dayLabel}</span>
            <span class="event-time">${e.time}</span>
          </div>
          <div class="event-body">
            <div class="event-title-row">
              <span class="event-tag-dot" style="background:${color};"></span>
              <h3 class="event-title">${e.title}</h3>
            </div>
            ${e.description ? `<p class="event-desc">${e.description}</p>` : ''}
          </div>
          <span class="event-tag-label" style="color:${color};">${e.tag}</span>
        </div>`;
    }).join('');
  }

  document.getElementById('cal-prev').addEventListener('click', () => {
    current.setMonth(current.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById('cal-next').addEventListener('click', () => {
    current.setMonth(current.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();
})();
